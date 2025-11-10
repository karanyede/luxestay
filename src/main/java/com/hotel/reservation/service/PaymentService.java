package com.hotel.reservation.service;

import com.hotel.reservation.model.Payment;
import com.hotel.reservation.model.PaymentStatus;
import com.hotel.reservation.model.Reservation;
import com.hotel.reservation.repository.PaymentRepository;
import com.hotel.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;

    @Value("${razorpay.key.id:}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:}")
    private String razorpayKeySecret;

    /**
     * Create a payment order for Razorpay
     */
    public Map<String, Object> createPaymentOrder(Long reservationId, BigDecimal amount) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));

        validateRazorpayConfiguration();

        // Create payment record
        Payment payment = Payment.builder()
                .reservation(reservation)
                .amount(amount)
                .status(PaymentStatus.PENDING)
                .paymentMethod("RAZORPAY")
                .transactionId(generateTransactionId())
                .build();

        payment = paymentRepository.save(payment);

        try {
            int amountInPaise = amount
                    .multiply(new BigDecimal("100"))
                    .setScale(0, RoundingMode.HALF_UP)
                    .intValueExact();

            RazorpayClient razorpayClient = createRazorpayClient();

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", payment.getTransactionId());
            orderRequest.put("payment_capture", 1);

            JSONObject notes = new JSONObject();
            notes.put("reservationId", reservationId);
            notes.put("paymentId", payment.getId());
            orderRequest.put("notes", notes);

            Order order = razorpayClient.orders.create(orderRequest);

            String razorpayOrderId = order.get("id");
            payment.setTransactionId(razorpayOrderId);
            paymentRepository.save(payment);

            Map<String, Object> orderData = new HashMap<>();
            orderData.put("orderId", razorpayOrderId);
            orderData.put("amount", order.get("amount"));
            orderData.put("currency", order.get("currency"));
            orderData.put("paymentId", payment.getId());
            orderData.put("reservationId", reservationId);
            orderData.put("key", razorpayKeyId);
            orderData.put("status", order.get("status"));

            log.info("Razorpay order created successfully: {}", razorpayOrderId);
            return orderData;
        } catch (RazorpayException ex) {
            log.error("Failed to create Razorpay order", ex);
            throw new IllegalStateException("Unable to create payment order at the moment. Please try again.");
        }
    }

    /**
     * Verify and complete payment
     */
    public Payment verifyAndCompletePayment(Long paymentId, String razorpayPaymentId, 
                                           String razorpayOrderId, String razorpaySignature) {
    Payment payment = paymentRepository.findById(paymentId)
        .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

    boolean isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

        if (isValid) {
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setTransactionId(razorpayPaymentId);
            payment.setProcessedAt(LocalDateTime.now());

            // Update reservation status
            Reservation reservation = payment.getReservation();
            reservation.setStatus("CONFIRMED");
            reservationRepository.save(reservation);

            log.info("Payment completed successfully: {}", paymentId);
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            log.error("Payment verification failed: {}", paymentId);
            throw new IllegalArgumentException("Payment verification failed");
        }

        return paymentRepository.save(payment);
    }

    /**
     * Process refund
     */
    public Payment processRefund(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        if (payment.getStatus() != PaymentStatus.COMPLETED) {
            throw new IllegalArgumentException("Only completed payments can be refunded");
        }

        payment.setStatus(PaymentStatus.REFUNDED);
        log.info("Refund processed for payment: {}", paymentId);

        return paymentRepository.save(payment);
    }

    /**
     * Get payment by reservation
     */
    public Payment getPaymentByReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));

        return reservation.getPayments().stream()
                .filter(p -> p.getStatus() == PaymentStatus.COMPLETED)
                .findFirst()
                .orElse(null);
    }

    /**
     * Generate unique transaction ID
     */
    private String generateTransactionId() {
        return "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    /**
     * Verify Razorpay payment signature
     * In production, use Razorpay SDK for proper verification
     */
    private boolean verifyPaymentSignature(String orderId, String paymentId, String signature) {
        log.info("Verifying payment - Order: {}, Payment: {}", orderId, paymentId);

        if (signature == null || signature.isBlank()) {
            return false;
        }

        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", orderId);
            attributes.put("razorpay_payment_id", paymentId);
            attributes.put("razorpay_signature", signature);

            return Utils.verifyPaymentSignature(attributes, razorpayKeySecret);
        } catch (RazorpayException e) {
            log.error("Payment signature verification failed", e);
            return false;
        }
    }

    /**
     * Get Razorpay key for frontend
     */
    public String getRazorpayKey() {
        return razorpayKeyId;
    }

    private RazorpayClient createRazorpayClient() throws RazorpayException {
        return new RazorpayClient(razorpayKeyId, razorpayKeySecret);
    }

    private void validateRazorpayConfiguration() {
        if (razorpayKeyId == null || razorpayKeyId.isBlank() ||
                razorpayKeySecret == null || razorpayKeySecret.isBlank()) {
            throw new IllegalStateException("Razorpay configuration is missing. Please add key id and secret.");
        }
    }
}
