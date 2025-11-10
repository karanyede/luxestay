package com.hotel.reservation.repository;

import com.hotel.reservation.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    
    List<Hotel> findByIsActiveTrue();
    
    Optional<Hotel> findByIdAndIsActiveTrue(Long id);
    
    List<Hotel> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);
    
    List<Hotel> findByAddressContainingIgnoreCaseAndIsActiveTrue(String address);
    
    @Query("SELECT h FROM Hotel h WHERE h.rating >= :minRating AND h.isActive = true")
    List<Hotel> findByMinRating(@Param("minRating") Double minRating);
    
    @Query("SELECT h FROM Hotel h WHERE h.rating BETWEEN :minRating AND :maxRating AND h.isActive = true")
    List<Hotel> findByRatingBetweenAndIsActiveTrue(@Param("minRating") Double minRating, @Param("maxRating") Double maxRating);
    
    @Query("SELECT h FROM Hotel h WHERE h.isActive = true ORDER BY h.rating DESC")
    List<Hotel> findTopRatedHotels();
}
