package com.hotel.reservation.service;

import com.hotel.reservation.model.*;
import com.hotel.reservation.repository.ReservationRepository;
import com.hotel.reservation.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    private final RoomService roomService;
    private final UserService userService;

    /**
     * Create a new reservation with payment
     */
    public Reservation createReservation(Long userId, Long roomId, LocalDate checkIn, 
                                       LocalDate checkOut, Integer guestCount,
                                       String guestName, String guestEmail, 
                                       String guestPhone, String specialRequests) {
        
        // Validate inputs
        if (checkIn.isAfter(checkOut) || checkIn.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Invalid check-in or check-out dates");
        }
        
        // Check room availability
        if (!roomService.isRoomAvailable(roomId, checkIn, checkOut)) {
            throw new IllegalStateException("Room is not available for the selected dates");
        }
        
        // Get room and user
        Room room = roomService.getRoomById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));
        
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        // Validate guest count
        if (guestCount > room.getCapacity()) {
            throw new IllegalArgumentException("Guest count exceeds room capacity");
        }
        
        // Calculate total amount
        BigDecimal totalAmount = roomService.calculateTotalCost(room, checkIn, checkOut);
        
        // Create reservation
        Reservation reservation = Reservation.builder()
                .user(user)
                .room(room)
                .checkInDate(checkIn)
                .checkOutDate(checkOut)
                .guestCount(guestCount)
                .totalAmount(totalAmount)
                .status("PENDING")
                .bookingReference(generateBookingReference())
                .confirmationNumber(generateConfirmationNumber())
                .guestName(guestName != null ? guestName : user.getFullName())
                .guestEmail(guestEmail != null ? guestEmail : user.getEmail())
                .guestPhone(guestPhone != null ? guestPhone : user.getPhone())
                .specialRequests(specialRequests)
                .build();
        
        reservation = reservationRepository.save(reservation);
        
        // Create initial payment record
        Payment payment = Payment.builder()
                .reservation(reservation)
                .amount(totalAmount)
                .paymentMethod("PENDING")
                .status(PaymentStatus.PENDING)
                .transactionId(generateTransactionId())
                .build();
        
        paymentRepository.save(payment);
        
        return reservation;
    }

    /**
     * Process payment for reservation
     */
    public Payment processPayment(Long reservationId, String paymentMethod, String paymentDetails) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
        
        if (!"PENDING".equals(reservation.getStatus())) {
            throw new IllegalStateException("Reservation is not in pending status");
        }
        
        // Get pending payment
        Payment payment = paymentRepository.findByReservationIdAndStatus(reservationId, PaymentStatus.PENDING)
                .orElseThrow(() -> new IllegalStateException("No pending payment found"));
        
        // Simulate payment processing
        boolean paymentSuccessful = processPaymentWithProvider(payment.getAmount(), paymentMethod, paymentDetails);
        
        if (paymentSuccessful) {
            // Update payment
            payment.setPaymentMethod(paymentMethod);
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setProcessedAt(LocalDateTime.now());
            
            // Update reservation
            reservation.setStatus("CONFIRMED");
            
            paymentRepository.save(payment);
            reservationRepository.save(reservation);
            
            return payment;
        } else {
            // Payment failed
            payment.setStatus(PaymentStatus.FAILED);
            payment.setProcessedAt(LocalDateTime.now());
            
            reservation.setStatus("CANCELLED");
            
            paymentRepository.save(payment);
            reservationRepository.save(reservation);
            
            throw new IllegalStateException("Payment processing failed");
        }
    }

    /**
     * Cancel reservation
     */
    public boolean cancelReservation(Long reservationId, Long userId) {
        Optional<Reservation> reservationOpt = reservationRepository.findById(reservationId);
        
        if (reservationOpt.isEmpty()) {
            return false;
        }
        
        Reservation reservation = reservationOpt.get();
        
        // Check if user owns this reservation
        if (!reservation.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized to cancel this reservation");
        }
        
        // Check if cancellation is allowed
        if ("CANCELLED".equals(reservation.getStatus()) || "COMPLETED".equals(reservation.getStatus())) {
            throw new IllegalStateException("Cannot cancel reservation in current status");
        }
        
        // Calculate cancellation policy
        boolean isRefundable = isRefundEligible(reservation);
        
        // Cancel reservation
        reservation.setStatus("CANCELLED");
        reservation.setCancelledAt(LocalDateTime.now());
        
        // Handle refund if applicable
        if (isRefundable) {
            processRefund(reservation);
        }
        
        reservationRepository.save(reservation);
        return true;
    }

    /**
     * Get user's reservations
     */
    public List<Reservation> getUserReservations(Long userId) {
        return reservationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Get reservation by ID
     */
    public Optional<Reservation> getReservationById(Long id) {
        return reservationRepository.findById(id);
    }

    /**
     * Get reservation by confirmation number
     */
    public Optional<Reservation> getReservationByConfirmationNumber(String confirmationNumber) {
        return reservationRepository.findByConfirmationNumber(confirmationNumber);
    }

    /**
     * Check-in guest
     */
    public Reservation checkIn(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
        
        if (!"CONFIRMED".equals(reservation.getStatus())) {
            throw new IllegalStateException("Reservation is not confirmed");
        }
        
        if (reservation.getCheckInDate().isAfter(LocalDate.now())) {
            throw new IllegalStateException("Check-in date has not arrived");
        }
        
        reservation.setStatus("CHECKED_IN");
        reservation.setActualCheckIn(LocalDateTime.now());
        
        return reservationRepository.save(reservation);
    }

    /**
     * Check-out guest
     */
    public Reservation checkOut(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
        
        if (!"CHECKED_IN".equals(reservation.getStatus())) {
            throw new IllegalStateException("Guest is not checked in");
        }
        
        reservation.setStatus("COMPLETED");
        reservation.setActualCheckOut(LocalDateTime.now());
        
        return reservationRepository.save(reservation);
    }

    /**
     * Get reservations by date range
     */
    public List<Reservation> getReservationsByDateRange(LocalDate startDate, LocalDate endDate) {
        return reservationRepository.findByCheckInDateBetween(startDate, endDate);
    }

    /**
     * Get reservation statistics
     */
    public long getTotalReservations() {
        return reservationRepository.count();
    }

    public long getActiveReservations() {
        return reservationRepository.countByStatusIn(List.of("CONFIRMED", "CHECKED_IN"));
    }

    public BigDecimal getTotalRevenue() {
        return reservationRepository.sumTotalAmountByStatus("COMPLETED")
                .orElse(BigDecimal.ZERO);
    }

    // Helper methods
    
    private String generateBookingReference() {
        return "BK" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
    
    private String generateConfirmationNumber() {
        return "HR" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
    
    private String generateTransactionId() {
        return "TXN" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    private boolean processPaymentWithProvider(BigDecimal amount, String paymentMethod, String paymentDetails) {
        // Simulate payment processing
        // In real implementation, integrate with payment providers like Stripe, PayPal, etc.
        
        // Simulate 95% success rate
        return Math.random() < 0.95;
    }
    
    private boolean isRefundEligible(Reservation reservation) {
        // Simple cancellation policy: free cancellation up to 24 hours before check-in
        LocalDateTime cutoffTime = reservation.getCheckInDate().atStartOfDay().minusHours(24);
        return LocalDateTime.now().isBefore(cutoffTime);
    }
    
    private void processRefund(Reservation reservation) {
        // Create refund payment record
        Payment refund = Payment.builder()
                .reservation(reservation)
                .amount(reservation.getTotalAmount().negate()) // Negative amount for refund
                .paymentMethod("REFUND")
                .status(PaymentStatus.COMPLETED)
                .transactionId(generateTransactionId())
                .processedAt(LocalDateTime.now())
                .build();
        
        paymentRepository.save(refund);
    }
}