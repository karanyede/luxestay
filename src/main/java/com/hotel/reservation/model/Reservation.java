package com.hotel.reservation.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "reservations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Booking reference is required")
    @Column(name = "booking_reference", unique = true, nullable = false)
    private String bookingReference;

    @NotNull(message = "Check-in date is required")
    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;

    @NotNull(message = "Check-out date is required")
    @Column(name = "check_out_date", nullable = false)
    private LocalDate checkOutDate;

    @NotNull(message = "Number of guests is required")
    @Min(value = 1, message = "At least 1 guest required")
    @Column(nullable = false)
    private Integer guestCount;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.0", message = "Total amount must be positive")
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @NotBlank(message = "Status is required")
    @Builder.Default
    @Column(nullable = false)
    private String status = "PENDING";
    
    @Column(name = "confirmation_number", unique = true)
    private String confirmationNumber;

    @Column(name = "actual_check_in")
    private LocalDateTime actualCheckIn;
    
    @Column(name = "actual_check_out")
    private LocalDateTime actualCheckOut;

    @NotBlank(message = "Guest name is required")
    @Column(name = "guest_name", nullable = false)
    private String guestName;

    @Email(message = "Guest email should be valid")
    @Column(name = "guest_email")
    private String guestEmail;

    @Column(name = "guest_phone")
    private String guestPhone;

    @Column(name = "special_requests", columnDefinition = "TEXT")
    private String specialRequests;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    @JsonBackReference
    private Room room;

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Payment> payments;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}