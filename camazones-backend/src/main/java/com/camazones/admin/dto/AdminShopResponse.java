package com.camazones.admin.dto;

import com.camazones.products.entity.SubscriptionTier;

import java.time.LocalDateTime;
import java.util.UUID;

public record AdminShopResponse(
        UUID id,
        String name,
        String city,
        String category,
        boolean verified,
        boolean blocked,
        SubscriptionTier subscriptionTier,
        String ownerName,
        String ownerEmail,
        LocalDateTime createdAt
) {}
