package com.hotel.reservation.repository;

import com.hotel.reservation.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    
    List<Reservation> findByUserId(Long userId);
    
    List<Reservation> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    Optional<Reservation> findByConfirmationNumber(String confirmationNumber);
    
    List<Reservation> findByCheckInDateBetween(LocalDate startDate, LocalDate endDate);
    
    long countByStatusIn(List<String> statuses);
    
    @Query("SELECT SUM(r.totalAmount) FROM Reservation r WHERE r.status = :status")
    Optional<BigDecimal> sumTotalAmountByStatus(@Param("status") String status);
}