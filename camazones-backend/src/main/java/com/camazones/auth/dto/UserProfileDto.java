package com.camazones.auth.dto;

import com.camazones.auth.entity.UserRole;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Réponse de GET /auth/me — profil complet de l'utilisateur connecté.
 */
public record UserProfileDto(
        UUID          id,
        String        email,
        String        firstName,
        String        lastName,
        String        phoneNumber,
        String        profilePictureUrl,
        String        bio,
        UserRole      role,
        boolean       isVerified,
        String        city,
        LocalDateTime createdAt
) {}
