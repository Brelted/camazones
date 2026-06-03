package com.camazones.payments.controller;

import com.camazones.payments.dto.CheckoutSessionRequest;
import com.camazones.payments.dto.CheckoutSessionResponse;
import com.camazones.payments.service.StripeCheckoutService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientResponseException;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final StripeCheckoutService stripeCheckoutService;

    public PaymentController(StripeCheckoutService stripeCheckoutService) {
        this.stripeCheckoutService = stripeCheckoutService;
    }

    @PostMapping("/checkout-session")
    ResponseEntity<CheckoutSessionResponse> checkoutSession(@Valid @RequestBody CheckoutSessionRequest request) {
        return ResponseEntity.ok(stripeCheckoutService.createSession(request));
    }

    @GetMapping("/status")
    ResponseEntity<PaymentStatusResponse> status() {
        boolean configured = stripeCheckoutService.isConfigured();
        return ResponseEntity.ok(new PaymentStatusResponse(
                "stripe_checkout",
                configured,
                configured ? "Stripe configure." : "Stripe non configure. Definis une vraie cle STRIPE_SECRET_KEY."
        ));
    }

    @ExceptionHandler(IllegalStateException.class)
    ResponseEntity<ErrorResponse> notConfigured(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(RestClientResponseException.class)
    ResponseEntity<ErrorResponse> stripeError(RestClientResponseException ex) {
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(new ErrorResponse(ex.getResponseBodyAsString()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<ErrorResponse> badRequest(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(ex.getMessage()));
    }

    record PaymentStatusResponse(String provider, boolean available, String message) {}
    record ErrorResponse(String message) {}
}
