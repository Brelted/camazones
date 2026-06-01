package com.camazones.admin.dto;

import com.camazones.auth.entity.UserRole;

import java.time.LocalDateTime;
import java.util.UUID;

public record AdminUserResponse(
        UUID id,
        String email,
        String firstName,
        String lastName,
        String phone,
        UserRole role,
        boolean verified,
        boolean blocked,
        String city,
        LocalDateTime createdAt
) {}
