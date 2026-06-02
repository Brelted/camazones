package com.camazones.notifications.controller;

import com.camazones.notifications.dto.PurchaseReceiptRequest;
import com.camazones.notifications.dto.WelcomeEmailRequest;
import com.camazones.notifications.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final EmailService emailService;

    public NotificationController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/purchase-receipt")
    ResponseEntity<NotificationResponse> sendPurchaseReceipt(@Valid @RequestBody PurchaseReceiptRequest request) {
        emailService.sendPurchaseReceipt(request);
        return ResponseEntity.ok(new NotificationResponse(true, "Facture envoyee."));
    }

    @PostMapping("/welcome")
    ResponseEntity<NotificationResponse> sendWelcome(@Valid @RequestBody WelcomeEmailRequest request) {
        emailService.sendWelcomeEmail(request);
        return ResponseEntity.ok(new NotificationResponse(true, "Email de bienvenue envoye."));
    }

    record NotificationResponse(boolean sent, String message) {}
}
