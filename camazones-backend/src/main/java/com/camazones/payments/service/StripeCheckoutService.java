package com.camazones.payments.service;

import com.camazones.messages.entity.ChatConversation;
import com.camazones.messages.repository.ChatConversationRepository;
import com.camazones.payments.dto.CheckoutSessionRequest;
import com.camazones.payments.dto.CheckoutSessionResponse;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;

@Service
public class StripeCheckoutService {

    private static final String STRIPE_CHECKOUT_URL = "https://api.stripe.com/v1/checkout/sessions";
    private static final long CARD_DELIVERY_AND_FEE = 1850L;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String secretKey;
    private final String defaultCurrency;
    private final String apiVersion;
    private final ChatConversationRepository conversationRepository;

    public StripeCheckoutService(
            @Value("${camazones.stripe.secret-key:}") String secretKey,
            @Value("${camazones.stripe.currency:xaf}") String defaultCurrency,
            @Value("${camazones.stripe.api-version:}") String apiVersion,
            ChatConversationRepository conversationRepository) {
        this.secretKey = secretKey;
        this.defaultCurrency = defaultCurrency;
        this.apiVersion = apiVersion;
        this.conversationRepository = conversationRepository;
    }

    @Transactional(readOnly = true)
    public CheckoutSessionResponse createSession(CheckoutSessionRequest request) {
        if (!hasUsableSecretKey()) {
            throw new IllegalStateException("Stripe n'est pas configure. Definis une vraie cle STRIPE_SECRET_KEY.");
        }

        long effectiveAmount = resolveEffectiveAmount(request);
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
        form.add("line_items[0][price_data][unit_amount]", String.valueOf(effectiveAmount));
        form.add("line_items[0][price_data][product_data][name]", request.productTitle());
        form.add("metadata[product_title]", request.productTitle());
        form.add("metadata[customer_name]", clean(request.customerName(), "Client Camazones"));
        form.add("metadata[amount_source]", request.conversationId() == null ? "catalog" : "conversation_offer");

        if (request.customerEmail() != null && !request.customerEmail().isBlank()) {
            form.add("customer_email", request.customerEmail());
            form.add("metadata[customer_email]", request.customerEmail());
        }
        if (request.conversationId() != null) {
            form.add("metadata[conversation_id]", request.conversationId().toString());
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
                effectiveAmount
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

    private long resolveEffectiveAmount(CheckoutSessionRequest request) {
        if (request.conversationId() == null) {
            return request.amount();
        }

        ChatConversation conversation = conversationRepository.findById(request.conversationId())
                .orElseThrow(() -> new IllegalArgumentException("Offre de paiement introuvable."));

        if (request.customerEmail() != null && !request.customerEmail().isBlank() && !isParticipant(conversation, request.customerEmail())) {
            throw new IllegalArgumentException("Ce client ne fait pas partie de la discussion.");
        }
        if (!"SELLER_SENT".equalsIgnoreCase(conversation.getNegotiatedOfferStatus()) || conversation.getNegotiatedPrice() == null) {
            throw new IllegalArgumentException("Aucune offre vendeur valide pour cette discussion.");
        }

        BigDecimal negotiatedPrice = conversation.getNegotiatedPrice();
        if (negotiatedPrice.compareTo(BigDecimal.valueOf(100)) < 0) {
            throw new IllegalArgumentException("Montant negocie invalide.");
        }
        return negotiatedPrice.longValue() + CARD_DELIVERY_AND_FEE;
    }

    private boolean isParticipant(ChatConversation conversation, String email) {
        return conversation.getParticipantOne().getEmail().equalsIgnoreCase(email)
                || conversation.getParticipantTwo().getEmail().equalsIgnoreCase(email);
    }

    private String clean(String value, String fallback) {
        if (value == null || value.trim().isBlank()) {
            return fallback;
        }
        return value.trim();
    }
}
