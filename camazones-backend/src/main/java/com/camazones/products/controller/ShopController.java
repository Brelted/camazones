package com.camazones.products.controller;

import com.camazones.products.dto.*;
import com.camazones.products.service.ProductService;
import com.camazones.products.service.ShopService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * POST /shops              → créer une boutique      (JWT)
 * GET  /shops/:id          → voir une boutique       (public)
 * GET  /shops/:id/products → produits d'une boutique (public)
 */
@RestController
@RequestMapping("/shops")
public class ShopController {

    private final ShopService    shopService;
    private final ProductService productService;

    public ShopController(ShopService shopService, ProductService productService) {
        this.shopService    = shopService;
        this.productService = productService;
    }

    @PostMapping
    ResponseEntity<ShopResponse> create(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody CreateShopRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(shopService.createShop(user.getUsername(), request));
    }

    @GetMapping("/{id}")
    ResponseEntity<ShopResponse> getOne(@PathVariable UUID id) {
        return ResponseEntity.ok(shopService.getShop(id));
    }

    @GetMapping("/{id}/products")
    ResponseEntity<ProductPageResponse> getProducts(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "1")  int page,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(productService.getShopProducts(id, page, limit));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<ErrorResponse> notFound(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(ex.getMessage()));
    }

    record ErrorResponse(String message) {}
}
