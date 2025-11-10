package com.hotel.reservation.service;

import com.hotel.reservation.model.User;
import com.hotel.reservation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Register a new user
     */
    public User registerUser(String email, String password, String fullName, String phone) {
        // Check if user already exists
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("User with this email already exists");
        }

        // Create new user
        User user = User.builder()
                .email(email.toLowerCase())
                .passwordHash(passwordEncoder.encode(password))
                .fullName(fullName)
                .phone(phone)
                .role("USER")
                .isActive(true)
                .build();

        return userRepository.save(user);
    }

    /**
     * Authenticate user login
     */
    public Optional<User> authenticateUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmailAndIsActiveTrue(email.toLowerCase());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPasswordHash())) {
                return Optional.of(user);
            }
        }
        
        return Optional.empty();
    }

    /**
     * Get user by ID
     */
    public Optional<User> getUserById(Long id) {
        return userRepository.findByIdAndIsActiveTrue(id);
    }

    /**
     * Get user by email
     */
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmailAndIsActiveTrue(email.toLowerCase());
    }

    /**
     * Update user profile
     */
    public Optional<User> updateUserProfile(Long userId, String fullName, String phone) {
        return userRepository.findByIdAndIsActiveTrue(userId)
                .map(user -> {
                    user.setFullName(fullName);
                    user.setPhone(phone);
                    return userRepository.save(user);
                });
    }

    /**
     * Change user password
     */
    public boolean changePassword(Long userId, String currentPassword, String newPassword) {
        Optional<User> userOpt = userRepository.findByIdAndIsActiveTrue(userId);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Verify current password
            if (passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
                // Update password
                user.setPasswordHash(passwordEncoder.encode(newPassword));
                userRepository.save(user);
                return true;
            }
        }
        
        return false;
    }

    /**
     * Deactivate user account
     */
    public boolean deactivateUser(Long userId) {
        return userRepository.findById(userId)
                .map(user -> {
                    user.setIsActive(false);
                    userRepository.save(user);
                    return true;
                })
                .orElse(false);
    }

    /**
     * Get all active users (Admin only)
     */
    public List<User> getAllActiveUsers() {
        return userRepository.findByIsActiveTrue();
    }

    /**
     * Search users by name or email (Admin only)
     */
    public List<User> searchUsers(String searchTerm) {
        return userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(searchTerm);
    }

    /**
     * Get user statistics
     */
    public long getTotalUsers() {
        return userRepository.count();
    }

    public long getActiveUsersCount() {
        return userRepository.countByIsActiveTrue();
    }

    /**
     * Check if user exists by email
     */
    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase()).isPresent();
    }

    /**
     * Reset password (for password reset functionality)
     */
    public boolean resetPassword(String email, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email.toLowerCase());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPasswordHash(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return true;
        }
        
        return false;
    }

    /**
     * Update user role (Admin only)
     */
    public Optional<User> updateUserRole(Long userId, String role) {
        return userRepository.findById(userId)
                .map(user -> {
                    user.setRole(role);
                    return userRepository.save(user);
                });
    }
}
