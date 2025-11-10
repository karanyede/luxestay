package com.hotel.reservation.repository;

import com.hotel.reservation.model.Payment;
import com.hotel.reservation.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    Optional<Payment> findByReservationIdAndStatus(Long reservationId, PaymentStatus status);
}