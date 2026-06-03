package com.camazones.payments.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CheckoutSessionRequest(
        @NotBlank String productTitle,
        @NotNull @Min(100) Long amount,
        String currency,
        @Email String customerEmail,
        String customerName,
        UUID conversationId,
        String successUrl,
        String cancelUrl
) {}
