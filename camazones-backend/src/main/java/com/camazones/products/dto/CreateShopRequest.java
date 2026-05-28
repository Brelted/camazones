package com.camazones.products.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateShopRequest(
        @NotBlank(message = "Le nom de la boutique est obligatoire")
        String name,

        String description,
        String logoUrl,
        String category,
        String city
) {}
