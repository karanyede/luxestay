package com.hotel.reservation.repository;

import com.hotel.reservation.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByEmailAndIsActiveTrue(String email);
    
    Optional<User> findByIdAndIsActiveTrue(Long id);
    
    List<User> findByIsActiveTrue();
    
    @Query("SELECT u FROM User u WHERE u.isActive = true AND " +
           "(LOWER(u.fullName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<User> findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            @Param("searchTerm") String searchTerm);
    
    long countByIsActiveTrue();
}