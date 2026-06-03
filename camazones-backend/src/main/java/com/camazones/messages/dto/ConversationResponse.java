package com.camazones.messages.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ConversationResponse(
        UUID id,
        String recipientEmail,
        String recipientName,
        String productTitle,
        String status,
        int unread,
        LocalDateTime updatedAt,
        List<MessageResponse> messages
) {}
