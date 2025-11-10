package com.hotel.reservation.controller;

import com.hotel.reservation.model.Reservation;
import com.hotel.reservation.model.Payment;
import com.hotel.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ReservationController {

    private final ReservationService reservationService;

    /**
     * Create a new reservation
     */
    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(@Valid @RequestBody CreateReservationRequest request) {
        try {
            Reservation reservation = reservationService.createReservation(
                    request.userId,
                    request.roomId,
                    request.checkIn,
                    request.checkOut,
                    request.guestCount,
                    request.guestName,
                    request.guestEmail,
                    request.guestPhone,
                    request.specialRequests
            );
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ReservationResponse(true, "Reservation created successfully", reservation));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ReservationResponse(false, e.getMessage(), null));
        }
    }

    /**
     * Process payment for reservation
     */
    @PostMapping("/{reservationId}/payment")
    public ResponseEntity<PaymentResponse> processPayment(
            @PathVariable Long reservationId,
            @Valid @RequestBody PaymentRequest request) {
        
        try {
            Payment payment = reservationService.processPayment(
                    reservationId,
                    request.paymentMethod,
                    request.paymentDetails
            );
            
            return ResponseEntity.ok(new PaymentResponse(true, "Payment processed successfully", payment));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new PaymentResponse(false, e.getMessage(), null));
        }
    }

    /**
     * Cancel reservation
     */
    @PostMapping("/{reservationId}/cancel")
    public ResponseEntity<CancelResponse> cancelReservation(
            @PathVariable Long reservationId,
            @RequestParam Long userId) {
        
        try {
            boolean cancelled = reservationService.cancelReservation(reservationId, userId);
            if (cancelled) {
                return ResponseEntity.ok(new CancelResponse(true, "Reservation cancelled successfully"));
            } else {
                return ResponseEntity.badRequest().body(new CancelResponse(false, "Unable to cancel reservation"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new CancelResponse(false, e.getMessage()));
        }
    }

    /**
     * Get user's reservations
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Reservation>> getUserReservations(@PathVariable Long userId) {
        List<Reservation> reservations = reservationService.getUserReservations(userId);
        return ResponseEntity.ok(reservations);
    }

    /**
     * Get reservation by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) {
        return reservationService.getReservationById(id)
                .map(reservation -> ResponseEntity.ok(reservation))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get reservation by confirmation number
     */
    @GetMapping("/confirmation/{confirmationNumber}")
    public ResponseEntity<Reservation> getReservationByConfirmation(@PathVariable String confirmationNumber) {
        return reservationService.getReservationByConfirmationNumber(confirmationNumber)
                .map(reservation -> ResponseEntity.ok(reservation))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Check-in guest
     */
    @PostMapping("/{reservationId}/checkin")
    public ResponseEntity<Reservation> checkIn(@PathVariable Long reservationId) {
        try {
            Reservation reservation = reservationService.checkIn(reservationId);
            return ResponseEntity.ok(reservation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Check-out guest
     */
    @PostMapping("/{reservationId}/checkout")
    public ResponseEntity<Reservation> checkOut(@PathVariable Long reservationId) {
        try {
            Reservation reservation = reservationService.checkOut(reservationId);
            return ResponseEntity.ok(reservation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get reservations by date range (Admin only)
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<Reservation>> getReservationsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<Reservation> reservations = reservationService.getReservationsByDateRange(startDate, endDate);
        return ResponseEntity.ok(reservations);
    }

    /**
     * Get reservation statistics (Admin only)
     */
    @GetMapping("/stats")
    public ResponseEntity<ReservationStatsResponse> getReservationStats() {
        long totalReservations = reservationService.getTotalReservations();
        long activeReservations = reservationService.getActiveReservations();
        BigDecimal totalRevenue = reservationService.getTotalRevenue();
        
        return ResponseEntity.ok(new ReservationStatsResponse(totalReservations, activeReservations, totalRevenue));
    }

    // Request DTOs
    public static class CreateReservationRequest {
        public Long userId;
        public Long roomId;
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        public LocalDate checkIn;
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        public LocalDate checkOut;
        public Integer guestCount;
        public String guestName;
        public String guestEmail;
        public String guestPhone;
        public String specialRequests;
    }

    public static class PaymentRequest {
        public String paymentMethod;
        public String paymentDetails;
    }

    // Response DTOs
    public static class ReservationResponse {
        public final boolean success;
        public final String message;
        public final Reservation reservation;

        public ReservationResponse(boolean success, String message, Reservation reservation) {
            this.success = success;
            this.message = message;
            this.reservation = reservation;
        }
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

    public static class CancelResponse {
        public final boolean success;
        public final String message;

        public CancelResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }
    }

    public static class ReservationStatsResponse {
        public final long totalReservations;
        public final long activeReservations;
        public final BigDecimal totalRevenue;

        public ReservationStatsResponse(long totalReservations, long activeReservations, BigDecimal totalRevenue) {
            this.totalReservations = totalReservations;
            this.activeReservations = activeReservations;
            this.totalRevenue = totalRevenue;
        }
    }
}