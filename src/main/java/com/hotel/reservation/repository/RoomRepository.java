package com.hotel.reservation.repository;

import com.hotel.reservation.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    
    List<Room> findByIsActiveTrue();
    
    Optional<Room> findByIdAndIsActiveTrue(Long id);
    
    List<Room> findByHotelIdAndIsActiveTrue(Long hotelId);
    
    List<Room> findByCategoryAndIsActiveTrue(String category);
    
    List<Room> findByCapacityGreaterThanEqualAndIsActiveTrue(Integer capacity);
    
    @Query("SELECT r FROM Room r WHERE r.basePrice BETWEEN :minPrice AND :maxPrice AND r.isActive = true")
    List<Room> findByPriceRange(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice);
    
    @Query("SELECT r FROM Room r WHERE r.hotel.id = :hotelId AND r.category = :category AND r.capacity >= :capacity AND r.isActive = true")
    List<Room> findAvailableRooms(@Param("hotelId") Long hotelId, @Param("category") String category, @Param("capacity") Integer capacity);
    
    // Find rooms that are not booked for the given date range
    @Query("SELECT r FROM Room r WHERE r.isActive = true AND r.id NOT IN " +
           "(SELECT res.room.id FROM Reservation res WHERE UPPER(res.status) != 'CANCELLED' AND " +
           "((res.checkInDate <= :checkOut AND res.checkOutDate >= :checkIn)))")
    List<Room> findAvailableRoomsForDateRange(@Param("checkIn") LocalDate checkIn, @Param("checkOut") LocalDate checkOut);
    
    // Find available rooms with filters
    @Query("SELECT r FROM Room r WHERE r.isActive = true AND " +
           "(:capacity IS NULL OR r.capacity >= :capacity) AND " +
           "(:category IS NULL OR r.category = :category) AND " +
           "(:hotelId IS NULL OR r.hotel.id = :hotelId) AND " +
           "r.id NOT IN (SELECT res.room.id FROM Reservation res WHERE UPPER(res.status) != 'CANCELLED' AND " +
           "((res.checkInDate <= :checkOut AND res.checkOutDate >= :checkIn)))")
    List<Room> findAvailableRoomsWithFilters(
        @Param("checkIn") LocalDate checkIn, 
        @Param("checkOut") LocalDate checkOut,
        @Param("capacity") Integer capacity,
        @Param("category") String category,
        @Param("hotelId") Long hotelId
    );
}