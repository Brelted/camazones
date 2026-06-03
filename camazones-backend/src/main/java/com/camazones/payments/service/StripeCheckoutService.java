package com.camazones.payments.service;

import com.camazones.payments.dto.CheckoutSessionRequest;
import com.camazones.payments.dto.CheckoutSessionResponse;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class StripeCheckoutService {

    private static final String STRIPE_CHECKOUT_URL = "https://api.stripe.com/v1/checkout/sessions";

    private final RestTemplate restTemplate = new RestTemplate();
    private final String secretKey;
    private final String defaultCurrency;
    private final String apiVersion;

    public StripeCheckoutService(
            @Value("${camazones.stripe.secret-key:}") String secretKey,
            @Value("${camazones.stripe.currency:xaf}") String defaultCurrency,
            @Value("${camazones.stripe.api-version:}") String apiVersion) {
        this.secretKey = secretKey;
        this.defaultCurrency = defaultCurrency;
        this.apiVersion = apiVersion;
    }

    public CheckoutSessionResponse createSession(CheckoutSessionRequest request) {
        if (!hasUsableSecretKey()) {
            throw new IllegalStateException("Stripe n'est pas configure. Definis une vraie cle STRIPE_SECRET_KEY.");
        }

        String currency = clean(request.currency(), defaultCurrency).toLowerCase();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(secretKey);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        if (apiVersion != null && !apiVersion.isBlank()) {
            headers.set("Stripe-Version", apiVersion.trim());
        }

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("mode", "payment");
        form.add("success_url", clean(request.successUrl(), "https://camazones.local/payment/success?session_id={CHECKOUT_SESSION_ID}"));
        form.add("cancel_url", clean(request.cancelUrl(), "https://camazones.local/payment/cancel"));
        form.add("line_items[0][quantity]", "1");
        form.add("line_items[0][price_data][currency]", currency);
        form.add("line_items[0][price_data][unit_amount]", String.valueOf(request.amount()));
        form.add("line_items[0][price_data][product_data][name]", request.productTitle());
        form.add("metadata[product_title]", request.productTitle());
        form.add("metadata[customer_name]", clean(request.customerName(), "Client Camazones"));

        if (request.customerEmail() != null && !request.customerEmail().isBlank()) {
            form.add("customer_email", request.customerEmail());
            form.add("metadata[customer_email]", request.customerEmail());
        }

        JsonNode payload = restTemplate.postForObject(STRIPE_CHECKOUT_URL, new HttpEntity<>(form, headers), JsonNode.class);
        if (payload == null || payload.path("url").asText("").isBlank()) {
            throw new IllegalStateException("Stripe n'a pas retourne de lien de paiement.");
        }

        return new CheckoutSessionResponse(
                payload.path("id").asText(),
                payload.path("url").asText(),
                "stripe_checkout",
                currency,
                request.amount()
        );
    }

    public boolean isConfigured() {
        return hasUsableSecretKey();
    }

    private boolean hasUsableSecretKey() {
        if (secretKey == null) {
            return false;
        }
        String key = secretKey.trim();
        return (key.startsWith("sk_test_") || key.startsWith("sk_live_"))
                && !key.toLowerCase().contains("remplacer");
    }

    private String clean(String value, String fallback) {
        if (value == null || value.trim().isBlank()) {
            return fallback;
        }
        return value.trim();
    }
}
