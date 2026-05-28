package com.camazones.products.dto;

import com.camazones.products.entity.ProductStatus;
import java.math.BigDecimal;
import java.util.List;

public record UpdateProductRequest(
        String title,
        String description,
        String category,
        BigDecimal price,
        Boolean negotiable,
        Integer stockQuantity,
        String city,
        BigDecimal latitude,
        BigDecimal longitude,
        String primaryImageUrl,
        List<String> imageUrls,
        ProductStatus status
) {}
