package com.hotel.reservation.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "hotels")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Hotel name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Address is required")
    @Column(nullable = false)
    private String address;

    @Email(message = "Email should be valid")
    private String email;

    @Pattern(regexp = "^[+]?[0-9\\-\\s()]{10,15}$", message = "Phone number should be valid")
    private String phone;

    @DecimalMin(value = "0.0", message = "Rating must be positive")
    @DecimalMax(value = "5.0", message = "Rating must not exceed 5.0")
    @Column(columnDefinition = "DECIMAL(2,1) DEFAULT 4.0")
    @Builder.Default
    private Double rating = 4.0;

    @Column(name = "amenities", columnDefinition = "TEXT")
    private String amenities; // Comma-separated values for H2 compatibility

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

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
    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Room> rooms;

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
