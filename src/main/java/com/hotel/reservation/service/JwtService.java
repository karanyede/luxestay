package com.hotel.reservation.service;

import com.hotel.reservation.config.JwtProperties;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@Slf4j
public class JwtService {

    private final JwtProperties jwtProperties;

    public JwtService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }

    /**
     * Generate JWT token for user
     */
    public String generateJwtToken(String email, Long userId, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("role", role);
        return createToken(claims, email);
    }

    /**
     * Create token with claims and subject
     */
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtProperties.getExpiration()))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Get signing key for JWT
     */
    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.getSecret());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Extract username from token
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extract user ID from token
     */
    public Long extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", Long.class));
    }

    /**
     * Extract user role from token
     */
    public String extractUserRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    /**
     * Extract expiration date from token
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extract claim from token
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extract all claims from token
     */
    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSignKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
            throw new RuntimeException("JWT token is expired");
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
            throw new RuntimeException("JWT token is unsupported");
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
            throw new RuntimeException("Invalid JWT token");
        } catch (SecurityException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
            throw new RuntimeException("Invalid JWT signature");
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
            throw new RuntimeException("JWT claims string is empty");
        }
    }

    /**
     * Check if token is expired
     */
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Validate token
     */
    public Boolean validateToken(String token, String username) {
        try {
            final String tokenUsername = extractUsername(token);
            return (tokenUsername.equals(username) && !isTokenExpired(token));
        } catch (Exception e) {
            log.error("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Validate token without username check
     */
    public Boolean validateToken(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            log.error("Token validation failed: {}", e.getMessage());
            return false;
        }
    }
}