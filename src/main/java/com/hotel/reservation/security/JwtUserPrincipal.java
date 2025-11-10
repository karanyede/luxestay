package com.hotel.reservation.security;

import java.security.Principal;

public class JwtUserPrincipal implements Principal {
    private final String email;
    private final Long userId;
    private final String role;

    public JwtUserPrincipal(String email, Long userId, String role) {
        this.email = email;
        this.userId = userId;
        this.role = role;
    }

    @Override
    public String getName() {
        return email;
    }

    public String getEmail() {
        return email;
    }

    public Long getUserId() {
        return userId;
    }

    public String getRole() {
        return role;
    }
}