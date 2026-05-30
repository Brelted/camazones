package com.camazones.auth.dto;

public record UpdateProfileRequest(
        String firstName,
        String lastName,
        String phone,
        String profilePictureUrl,
        String bio,
        String city,
        String address
) {}
