package com.camazones.notifications.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record PurchaseReceiptRequest(
        @Email @NotBlank String email,
        @NotBlank String customerName,
        @NotBlank String productTitle,
        @NotBlank String total,
        @NotBlank String method,
        @NotBlank String transactionId
) {}
