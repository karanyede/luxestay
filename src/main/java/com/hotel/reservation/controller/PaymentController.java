package com.hotel.reservation.controller;

import com.hotel.reservation.model.Payment;
import com.hotel.reservation.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Create payment order
     */
    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createPaymentOrder(@RequestBody CreateOrderRequest request) {
        try {
            log.info("Creating payment order for reservation: {}", request.reservationId);
            Map<String, Object> orderData = paymentService.createPaymentOrder(
                    request.reservationId, 
                    request.amount
            );
            return ResponseEntity.ok(orderData);
        } catch (Exception e) {
            log.error("Error creating payment order: ", e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage() != null ? e.getMessage() : "Failed to create payment order"
            ));
        }
    }

    /**
     * Verify payment
     */
    @PostMapping("/verify")
    public ResponseEntity<PaymentResponse> verifyPayment(@RequestBody VerifyPaymentRequest request) {
        try {
            log.info("Verifying payment: {}", request.paymentId);
            Payment payment = paymentService.verifyAndCompletePayment(
                    request.paymentId,
                    request.razorpayPaymentId,
                    request.razorpayOrderId,
                    request.razorpaySignature
            );
            
            return ResponseEntity.ok(new PaymentResponse(
                    true, 
                    "Payment verified successfully", 
                    payment
            ));
        } catch (Exception e) {
            log.error("Payment verification failed: ", e);
            return ResponseEntity.badRequest().body(new PaymentResponse(
                    false, 
                    e.getMessage(), 
                    null
            ));
        }
    }

    /**
     * Get Razorpay key
     */
    @GetMapping("/razorpay-key")
    public ResponseEntity<Map<String, String>> getRazorpayKey() {
        String key = paymentService.getRazorpayKey();
        return ResponseEntity.ok(Map.of("key", key != null ? key : ""));
    }

    /**
     * Process refund
     */
    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<PaymentResponse> processRefund(@PathVariable Long paymentId) {
        try {
            Payment payment = paymentService.processRefund(paymentId);
            return ResponseEntity.ok(new PaymentResponse(
                    true, 
                    "Refund processed successfully", 
                    payment
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new PaymentResponse(
                    false, 
                    e.getMessage(), 
                    null
            ));
        }
    }

    // DTOs
    public static class CreateOrderRequest {
        public Long reservationId;
        public BigDecimal amount;
    }

    public static class VerifyPaymentRequest {
        public Long paymentId;
        public String razorpayPaymentId;
        public String razorpayOrderId;
        public String razorpaySignature;
    }

    public static class PaymentResponse {
        public final boolean success;
        public final String message;
        public final Payment payment;

        public PaymentResponse(boolean success, String message, Payment payment) {
            this.success = success;
            this.message = message;
            this.payment = payment;
        }
    }
}
