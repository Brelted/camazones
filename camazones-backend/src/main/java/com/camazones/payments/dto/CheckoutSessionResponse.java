package com.camazones.payments.dto;

public record CheckoutSessionResponse(
        String sessionId,
        String checkoutUrl,
        String provider,
        String currency,
        Long amount
) {}
