package com.camazones.messages.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record StartConversationRequest(
        @Email @NotBlank String recipientEmail,
        String productTitle,
        String openingMessage
) {}
