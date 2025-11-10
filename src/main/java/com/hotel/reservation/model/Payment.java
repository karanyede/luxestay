package com.hotel.reservation.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", message = "Amount must be positive")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "transaction_id")
    private String transactionId;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    @JsonBackReference
    private Reservation reservation;

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