package com.camazones.products.dto;

import java.util.List;

/** Réponse paginée pour GET /products */
public record ProductPageResponse(
        List<ProductResponse> data,
        long  total,
        int   page,
        int   limit,
        int   totalPages
) {}
