package com.camazones.messages.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record MessageResponse(
        UUID id,
        String from,
        String senderEmail,
        String senderName,
        String text,
        LocalDateTime createdAt
) {}
