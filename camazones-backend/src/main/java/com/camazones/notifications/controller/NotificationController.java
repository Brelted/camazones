package com.camazones.notifications.controller;

import com.camazones.notifications.dto.PurchaseReceiptRequest;
import com.camazones.notifications.dto.WelcomeEmailRequest;
import com.camazones.notifications.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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

    @GetMapping("/status")
    ResponseEntity<NotificationStatusResponse> status() {
        boolean configured = emailService.isConfigured();
        return ResponseEntity.ok(new NotificationStatusResponse(
                configured,
                emailService.statusMessage()
        ));
    }

    @PostMapping("/purchase-receipt")
    ResponseEntity<NotificationResponse> sendPurchaseReceipt(@Valid @RequestBody PurchaseReceiptRequest request) {
        boolean sent = emailService.sendPurchaseReceipt(request);
        return ResponseEntity.ok(new NotificationResponse(sent, sent ? "Facture envoyee." : "Facture non envoyee. Verifie la configuration SMTP."));
    }

    @PostMapping("/welcome")
    ResponseEntity<NotificationResponse> sendWelcome(@Valid @RequestBody WelcomeEmailRequest request) {
        boolean sent = emailService.sendWelcomeEmail(request);
        return ResponseEntity.ok(new NotificationResponse(sent, sent ? "Email de bienvenue envoye." : "Email non envoye. Verifie la configuration SMTP."));
    }

    record NotificationResponse(boolean sent, String message) {}

    record NotificationStatusResponse(boolean configured, String message) {}
}
