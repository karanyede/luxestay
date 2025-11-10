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
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "rooms")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Room {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Room number is required")
    @Column(name = "room_number", nullable = false)
    private String roomNumber;

    @NotBlank(message = "Category is required")
    @Column(nullable = false)
    private String category;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    @Column(nullable = false)
    private Integer capacity;

    @NotNull(message = "Base price is required")
    @DecimalMin(value = "0.0", message = "Price must be positive")
    @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "amenities", columnDefinition = "TEXT")
    private String amenities; // Comma-separated values for H2 compatibility

    @Column(name = "image_url")
    private String imageUrl;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", nullable = false)
    @JsonBackReference
    private Hotel hotel;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Reservation> reservations;

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