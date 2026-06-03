package com.camazones.messages.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record NegotiatedOfferRequest(
        @NotNull @Min(100) Long amount,
        String note
) {}
