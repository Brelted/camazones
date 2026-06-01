package com.camazones.admin.dto;

import com.camazones.products.entity.ProductStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record AdminProductResponse(
        UUID id,
        String title,
        String category,
        BigDecimal price,
        ProductStatus status,
        boolean blocked,
        String sellerName,
        String sellerEmail,
        String shopName,
        LocalDateTime createdAt
) {}
