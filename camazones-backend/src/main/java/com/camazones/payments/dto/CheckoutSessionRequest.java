package com.camazones.payments.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CheckoutSessionRequest(
        @NotBlank String productTitle,
        @NotNull @Min(100) Long amount,
        String currency,
        @Email String customerEmail,
        String customerName,
        String successUrl,
        String cancelUrl
) {}
