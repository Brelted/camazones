package com.camazones.products.dto;

import com.camazones.products.entity.ProductStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Réponse JSON pour un produit — exposé au frontend.
 */
public record ProductResponse(
        UUID          id,
        String        title,
        String        description,
        String        category,
        BigDecimal    price,
        boolean       negotiable,
        int           stockQuantity,
        String        city,
        BigDecimal    latitude,
        BigDecimal    longitude,
        String        primaryImageUrl,
        List<String>  imageUrls,
        BigDecimal    rating,
        int           totalReviews,
        int           views,
        ProductStatus status,
        SellerInfo    seller,
        ShopInfo      shop,
        LocalDateTime createdAt
) {
    public record SellerInfo(UUID id, String firstName, String lastName) {}
    public record ShopInfo(UUID id, String name, String logoUrl) {}
}
