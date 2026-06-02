package com.camazones.notifications.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record WelcomeEmailRequest(
        @Email @NotBlank String email,
        @NotBlank String customerName
) {}
