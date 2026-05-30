package com.camazones.auth.dto;

import com.camazones.auth.entity.UserRole;
import java.util.UUID;

/**
 * Réponse renvoyée après un login ou register réussi.
 */
public record AuthResponse(
        String token,
        UserInfo user
) {
    public record UserInfo(
            UUID   id,
            String email,
            String firstName,
            String lastName,
            String phone,
            UserRole role
    ) {}
}
