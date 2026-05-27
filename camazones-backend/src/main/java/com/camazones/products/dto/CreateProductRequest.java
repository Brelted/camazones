package com.camazones.products.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record CreateProductRequest(
        @NotBlank(message = "Le titre est obligatoire")
        String title,

        String description,

        @NotBlank(message = "La catégorie est obligatoire")
        String category,

        @NotNull(message = "Le prix est obligatoire")
        @DecimalMin(value = "0.0", inclusive = false, message = "Le prix doit être positif")
        BigDecimal price,

        boolean negotiable,

        @Min(value = 0, message = "Le stock ne peut pas être négatif")
        int stockQuantity,

        String city,
        BigDecimal latitude,
        BigDecimal longitude,
        String primaryImageUrl,
        List<String> imageUrls,
        UUID shopId          // Optionnel : rattacher à une boutique
) {}
