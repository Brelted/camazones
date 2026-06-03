package com.camazones.products.dto;

import com.camazones.products.entity.SubscriptionTier;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record ShopResponse(
        UUID             id,
        String           name,
        String           description,
        String           logoUrl,
        String           category,
        String           city,
        BigDecimal       rating,
        int              totalReviews,
        boolean          verified,
        SubscriptionTier subscriptionTier,
        OwnerInfo        owner,
        LocalDateTime    createdAt
) {
    public record OwnerInfo(UUID id, String email, String firstName, String lastName) {}
}
