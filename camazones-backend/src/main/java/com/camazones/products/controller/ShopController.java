package com.camazones.products.controller;

import com.camazones.products.dto.CreateShopRequest;
import com.camazones.products.dto.ProductPageResponse;
import com.camazones.products.dto.ShopResponse;
import com.camazones.products.service.ProductService;
import com.camazones.products.service.ShopService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/shops")
public class ShopController {

    private final ShopService shopService;
    private final ProductService productService;

    public ShopController(ShopService shopService, ProductService productService) {
        this.shopService = shopService;
        this.productService = productService;
    }

    @GetMapping
    ResponseEntity<List<ShopResponse>> list() {
        return ResponseEntity.ok(shopService.getShops());
    }

    @PostMapping
    ResponseEntity<ShopResponse> create(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody CreateShopRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(shopService.createShop(user.getUsername(), request));
    }

    @GetMapping("/mine")
    ResponseEntity<ShopResponse> getMine(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(shopService.getMyShop(user.getUsername()));
    }

    @GetMapping("/{id}")
    ResponseEntity<ShopResponse> getOne(@PathVariable UUID id) {
        return ResponseEntity.ok(shopService.getShop(id));
    }

    @GetMapping("/{id}/products")
    ResponseEntity<ProductPageResponse> getProducts(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(productService.getShopProducts(id, page, limit));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<ErrorResponse> notFound(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(ex.getMessage()));
    }

    record ErrorResponse(String message) {}
}
