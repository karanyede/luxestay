package com.hotel.reservation.controller;

import com.hotel.reservation.model.User;
import com.hotel.reservation.service.JwtService;
import com.hotel.reservation.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(
    origins = {"http://localhost:3000", "http://localhost:3001"},
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
    allowedHeaders = "*",
    allowCredentials = "true"
)
@Slf4j
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    /**
     * Register a new user
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("=== REGISTRATION REQUEST ===");
        log.info("Email: {}", request.email);
        log.info("Full Name: {}", request.fullName);
        log.info("Phone: {}", request.phone);
        
        try {
            User user = userService.registerUser(
                    request.email,
                    request.password,
                    request.fullName,
                    request.phone
            );
            
            log.info("User registered successfully with ID: {}", user.getId());
            
            // Generate JWT token
            String token = jwtService.generateJwtToken(user.getEmail(), user.getId(), user.getRole());
            log.info("JWT token generated for user: {}", user.getEmail());
            
            AuthResponse response = new AuthResponse(true, "User registered successfully", user.getId(), user.getEmail(), user.getFullName(), user.getRole(), token);
            log.info("Registration response: {}", response);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            log.error("Registration failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, e.getMessage(), null, null, null, null, null));
        } catch (Exception e) {
            log.error("Unexpected error during registration: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AuthResponse(false, "Internal server error", null, null, null, null, null));
        }
    }

    /**
     * Authenticate user login
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("=== LOGIN REQUEST ===");
        log.info("Email: {}", request.email);
        
        try {
            Optional<User> userOpt = userService.authenticateUser(request.email, request.password);
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                log.info("User authenticated successfully: {}", user.getEmail());
                
                // Generate JWT token
                String token = jwtService.generateJwtToken(user.getEmail(), user.getId(), user.getRole());
                log.info("JWT token generated for login: {}", user.getEmail());
                
                AuthResponse response = new AuthResponse(true, "Login successful", user.getId(), user.getEmail(), user.getFullName(), user.getRole(), token);
                log.info("Login response: {}", response);
                
                return ResponseEntity.ok(response);
            } else {
                log.warn("Login failed for email: {}", request.email);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new AuthResponse(false, "Invalid email or password", null, null, null, null, null));
            }
        } catch (Exception e) {
            log.error("Unexpected error during login: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AuthResponse(false, "Internal server error", null, null, null, null, null));
        }
    }

    /**
     * Check if email exists
     */
    @PostMapping("/check-email")
    public ResponseEntity<EmailCheckResponse> checkEmail(@RequestBody EmailCheckRequest request) {
        boolean exists = userService.existsByEmail(request.email);
        return ResponseEntity.ok(new EmailCheckResponse(exists));
    }

    // Request DTOs
    public static class RegisterRequest {
        public String email;
        public String password;
        public String fullName;
        public String phone;
    }

    public static class LoginRequest {
        public String email;
        public String password;
    }

    public static class EmailCheckRequest {
        public String email;
    }

    // Response DTOs
    public static class AuthResponse {
        public final boolean success;
        public final String message;
        public final Long userId;
        public final String email;
        public final String fullName;
        public final String role;
        public final String token;

        public AuthResponse(boolean success, String message, Long userId, String email, String fullName, String role, String token) {
            this.success = success;
            this.message = message;
            this.userId = userId;
            this.email = email;
            this.fullName = fullName;
            this.role = role;
            this.token = token;
        }
    }

    public static class EmailCheckResponse {
        public final boolean exists;

        public EmailCheckResponse(boolean exists) {
            this.exists = exists;
        }
    }
}
