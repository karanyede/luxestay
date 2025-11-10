package com.hotel.reservation.security;

import com.hotel.reservation.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Skip JWT validation for authentication endpoints
        String path = request.getRequestURI();
        if (path.contains("/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // Check if Authorization header exists and starts with Bearer
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract JWT token
        jwt = authHeader.substring(7);
        
        try {
            userEmail = jwtService.extractUsername(jwt);

            // If user email is found and no authentication is set in context
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                // Validate the token
                if (jwtService.validateToken(jwt)) {
                    // Extract additional claims
                    Long userId = jwtService.extractUserId(jwt);
                    String role = jwtService.extractUserRole(jwt);
                    
                    // Create authorities from role
                    List<SimpleGrantedAuthority> authorities = List.of(
                            new SimpleGrantedAuthority("ROLE_" + (role != null ? role.toUpperCase() : "USER"))
                    );
                    
                    // Create custom principal with user details
                    JwtUserPrincipal principal = new JwtUserPrincipal(userEmail, userId, role);
                    
                    // Create authentication token
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            principal,
                            null,
                            authorities
                    );
                    
                    // Set additional details
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // Set authentication in security context
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    
                    log.debug("User {} authenticated successfully with role {} and userId {}", userEmail, role, userId);
                }
            }
        } catch (Exception e) {
            log.error("Cannot set user authentication: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}