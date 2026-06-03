package com.camazones.admin.controller;

import com.camazones.admin.dto.*;
import com.camazones.admin.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    ResponseEntity<AdminDashboardResponse> dashboard() {
        return ResponseEntity.ok(adminService.dashboard());
    }

    @GetMapping("/users")
    ResponseEntity<List<AdminUserResponse>> users() {
        return ResponseEntity.ok(adminService.users());
    }

    @GetMapping("/shops")
    ResponseEntity<List<AdminShopResponse>> shops() {
        return ResponseEntity.ok(adminService.shops());
    }

    @GetMapping("/products")
    ResponseEntity<List<AdminProductResponse>> products() {
        return ResponseEntity.ok(adminService.products());
    }

    @GetMapping("/commissions/week")
    ResponseEntity<List<AdminCommissionResponse>> weeklyCommissions() {
        return ResponseEntity.ok(adminService.weeklyCommissions());
    }

    @PatchMapping("/users/{id}/block")
    ResponseEntity<AdminUserResponse> blockUser(@AuthenticationPrincipal UserDetails admin, @PathVariable UUID id) {
        return ResponseEntity.ok(adminService.blockUser(admin.getUsername(), id));
    }

    @PatchMapping("/users/{id}/unblock")
    ResponseEntity<AdminUserResponse> unblockUser(@PathVariable UUID id) {
        return ResponseEntity.ok(adminService.unblockUser(id));
    }

    @DeleteMapping("/users/{id}")
    ResponseEntity<Void> deleteUser(@AuthenticationPrincipal UserDetails admin, @PathVariable UUID id) {
        adminService.deleteUser(admin.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/shops/{id}/block")
    ResponseEntity<AdminShopResponse> blockShop(@PathVariable UUID id) {
        return ResponseEntity.ok(adminService.blockShop(id));
    }

    @PatchMapping("/shops/{id}/unblock")
    ResponseEntity<AdminShopResponse> unblockShop(@PathVariable UUID id) {
        return ResponseEntity.ok(adminService.unblockShop(id));
    }

    @PatchMapping("/products/{id}/block")
    ResponseEntity<AdminProductResponse> blockProduct(@PathVariable UUID id) {
        return ResponseEntity.ok(adminService.blockProduct(id));
    }

    @PatchMapping("/products/{id}/unblock")
    ResponseEntity<AdminProductResponse> unblockProduct(@PathVariable UUID id) {
        return ResponseEntity.ok(adminService.unblockProduct(id));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<ErrorResponse> notFound(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    ResponseEntity<ErrorResponse> forbidden(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponse(ex.getMessage()));
    }

    record ErrorResponse(String message) {}
}
