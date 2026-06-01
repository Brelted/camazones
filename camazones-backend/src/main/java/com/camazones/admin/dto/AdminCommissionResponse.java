package com.camazones.admin.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record AdminCommissionResponse(
        UUID id,
        String orderReference,
        String sellerName,
        String shopName,
        String productTitle,
        BigDecimal grossAmount,
        BigDecimal commissionRate,
        BigDecimal commissionAmount,
        LocalDateTime createdAt
) {}
