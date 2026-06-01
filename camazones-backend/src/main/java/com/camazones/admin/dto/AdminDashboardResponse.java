package com.camazones.admin.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record AdminDashboardResponse(
        List<AdminUserResponse> users,
        List<AdminShopResponse> shops,
        List<AdminProductResponse> products,
        List<AdminCommissionResponse> weeklyCommissions,
        CommissionSummary summary
) {
    public record CommissionSummary(
            BigDecimal totalGross,
            BigDecimal totalCommission,
            long count,
            LocalDateTime weekStart,
            LocalDateTime weekEnd
    ) {}
}
