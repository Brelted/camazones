package com.camazones.notifications.service;

import com.camazones.auth.entity.User;
import com.camazones.notifications.dto.PurchaseReceiptRequest;
import com.camazones.notifications.dto.WelcomeEmailRequest;
import jakarta.mail.AuthenticationFailedException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final JavaMailSender mailSender;
    private final boolean enabled;
    private final String from;
    private final String username;
    private final String password;

    public EmailService(
            JavaMailSender mailSender,
            @Value("${camazones.mail.enabled:false}") boolean enabled,
            @Value("${camazones.mail.from:}") String from,
            @Value("${spring.mail.username:}") String username,
            @Value("${spring.mail.password:}") String password) {
        this.mailSender = mailSender;
        this.enabled = enabled;
        this.from = from;
        this.username = username;
        this.password = password;
    }

    public boolean sendWelcomeEmail(User user) {
        String fullName = displayName(user.getFirstName(), user.getLastName());
        String html = layout(
                "Bienvenue sur Camazones",
                "Merci de rejoindre Camazones",
                """
                <p>Bonjour <strong>%s</strong>,</p>
                <p>Votre compte est cree avec succes.</p>
                <p>Merci de rejoindre Camazones, le marche certifie qui rapproche les acheteurs, les vendeurs et les boutiques du Cameroun.</p>
                <p>Vous pouvez maintenant decouvrir les vitrines, discuter avec les vendeurs et finaliser vos achats en securite.</p>
                """.formatted(escape(fullName))
        );
        return send(user.getEmail(), "Bienvenue sur Camazones", html);
    }

    @Async
    public void sendWelcomeEmailAsync(User user) {
        sendWelcomeEmail(user);
    }

    public boolean sendWelcomeEmail(WelcomeEmailRequest request) {
        String html = layout(
                "Bienvenue sur Camazones",
                "Compte cree avec succes",
                """
                <p>Bonjour <strong>%s</strong>,</p>
                <p>Votre compte Camazones est actif. Vous pouvez maintenant decouvrir les boutiques, publier des articles, discuter avec les vendeurs et payer vos achats en securite.</p>
                <div class="box">
                  <p><strong>Email:</strong> %s</p>
                  <p><strong>Date:</strong> %s</p>
                </div>
                <p>Merci de rejoindre le marche certifie Camazones.</p>
                """.formatted(escape(request.customerName()), escape(request.email()), FORMATTER.format(LocalDateTime.now()))
        );
        return send(request.email(), "Bienvenue sur Camazones", html);
    }

    public boolean sendPurchaseReceipt(PurchaseReceiptRequest request) {
        String html = layout(
                "Facture Camazones",
                "Recu d'achat",
                """
                <p>Bonjour <strong>%s</strong>,</p>
                <p>Votre achat a ete valide. Voici le recu de votre transaction.</p>
                <div class="box">
                  <p><strong>Produit:</strong> %s</p>
                  <p><strong>Total:</strong> %s</p>
                  <p><strong>Methode:</strong> %s</p>
                  <p><strong>Transaction:</strong> %s</p>
                  <p><strong>Date:</strong> %s</p>
                </div>
                <p>Conservez ce message comme preuve de paiement.</p>
                """.formatted(
                        escape(request.customerName()),
                        escape(request.productTitle()),
                        escape(request.total()),
                        escape(request.method()),
                        escape(request.transactionId()),
                        FORMATTER.format(LocalDateTime.now())
                )
        );
        return send(request.email(), "Facture Camazones - " + request.transactionId(), html);
    }

    public boolean isConfigured() {
        return enabled
                && from != null && !from.isBlank()
                && username != null && !username.isBlank()
                && password != null && !password.isBlank();
    }

    public String statusMessage() {
        if (!enabled) {
            return "SMTP desactive.";
        }
        if (from == null || from.isBlank() || username == null || username.isBlank()) {
            return "SMTP incomplet. Ajoute CAMAZONES_MAIL_USERNAME et CAMAZONES_MAIL_FROM.";
        }
        if (password == null || password.isBlank()) {
            return "SMTP incomplet. Ajoute CAMAZONES_MAIL_PASSWORD.";
        }
        return "SMTP configure.";
    }

    private boolean send(String to, String subject, String html) {
        if (!isConfigured()) {
            log.info("Email non configure. Sujet '{}' pour {}", subject, to);
            return false;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, StandardCharsets.UTF_8.name());
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            if (from != null && !from.isBlank()) {
                helper.setFrom(from);
            }
            mailSender.send(message);
            log.info("Email envoye a {}: {}", to, subject);
            return true;
        } catch (Exception error) {
            if (isAuthenticationError(error)) {
                log.warn("Email non envoye a {}: authentification Gmail refusee. Utilise un mot de passe d'application Gmail a 16 caracteres.", to);
                return false;
            }
            log.warn("Email non envoye a {}: {}", to, error.getMessage());
            return false;
        }
    }

    private boolean isAuthenticationError(Throwable error) {
        Throwable current = error;
        while (current != null) {
            if (current instanceof AuthenticationFailedException) {
                return true;
            }
            current = current.getCause();
        }
        return false;
    }

    private String layout(String title, String heading, String body) {
        return """
                <!doctype html>
                <html>
                  <body style="margin:0;background:#E8DCC8;font-family:Arial,sans-serif;color:#1F1F1F;">
                    <style>
                      .card{max-width:620px;margin:24px auto;background:#F6E7CA;border:1px solid rgba(31,31,31,.12);border-radius:22px;padding:28px}
                      .brand{color:#FF5A00;font-size:28px;font-weight:900;margin:0}
                      .heading{font-size:22px;font-weight:900;margin:18px 0 8px}
                      .box{background:#FFF8EA;border-radius:16px;padding:16px;margin:18px 0}
                      p{line-height:1.55}
                    </style>
                    <div class="card">
                      <p class="brand">Camazones</p>
                      <p style="margin:4px 0 0;color:#21874A;font-weight:800;">Marche certifie du Cameroun</p>
                      <h1 class="heading">%s</h1>
                      %s
                      <p style="font-size:12px;color:rgba(31,31,31,.62);margin-top:22px;">%s</p>
                    </div>
                  </body>
                </html>
                """.formatted(escape(heading), body, escape(title));
    }

    private String displayName(String firstName, String lastName) {
        String value = ((firstName == null ? "" : firstName) + " " + (lastName == null ? "" : lastName)).trim();
        return value.isBlank() ? "Client Camazones" : value;
    }

    private String escape(String value) {
        if (value == null) {
            return "";
        }
        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;");
    }
}
