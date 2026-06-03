package com.camazones.admin.service;

import com.camazones.admin.dto.*;
import com.camazones.admin.entity.CommissionTransaction;
import com.camazones.admin.repository.CommissionRepository;
import com.camazones.auth.entity.User;
import com.camazones.auth.repository.UserRepository;
import com.camazones.auth.service.AccountDeletionService;
import com.camazones.products.entity.Product;
import com.camazones.products.entity.ProductStatus;
import com.camazones.products.entity.Shop;
import com.camazones.products.repository.ProductRepository;
import com.camazones.products.repository.ShopRepository;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.UUID;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;
    private final CommissionRepository commissionRepository;
    private final AccountDeletionService accountDeletionService;

    public AdminService(UserRepository userRepository,
                        ShopRepository shopRepository,
                        ProductRepository productRepository,
                        CommissionRepository commissionRepository,
                        AccountDeletionService accountDeletionService) {
        this.userRepository = userRepository;
        this.shopRepository = shopRepository;
        this.productRepository = productRepository;
        this.commissionRepository = commissionRepository;
        this.accountDeletionService = accountDeletionService;
    }

    public AdminDashboardResponse dashboard() {
        List<AdminCommissionResponse> commissions = weeklyCommissions();
        LocalDateTime start = weekStart();
        LocalDateTime end = weekEnd(start);
        BigDecimal totalGross = commissions.stream()
                .map(AdminCommissionResponse::grossAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalCommission = commissions.stream()
                .map(AdminCommissionResponse::commissionAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new AdminDashboardResponse(
                users(),
                shops(),
                products(),
                commissions,
                new AdminDashboardResponse.CommissionSummary(totalGross, totalCommission, commissions.size(), start, end)
        );
    }

    public List<AdminUserResponse> users() {
        return userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .filter(user -> user.getRemovedAt() == null)
                .map(this::mapUser)
                .toList();
    }

    public List<AdminShopResponse> shops() {
        return shopRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(this::mapShop)
                .toList();
    }

    public List<AdminProductResponse> products() {
        return productRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(this::mapProduct)
                .toList();
    }

    public List<AdminCommissionResponse> weeklyCommissions() {
        LocalDateTime start = weekStart();
        return commissionRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, weekEnd(start))
                .stream()
                .map(this::mapCommission)
                .toList();
    }

    @Transactional
    public AdminUserResponse blockUser(String adminEmail, UUID id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));
        if (user.getEmail().equalsIgnoreCase(adminEmail)) {
            throw new AccessDeniedException("Un administrateur ne peut pas se bloquer lui-meme");
        }
        user.setDeletedAt(LocalDateTime.now());
        return mapUser(userRepository.save(user));
    }

    @Transactional
    public AdminUserResponse unblockUser(UUID id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));
        user.setDeletedAt(null);
        return mapUser(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(String adminEmail, UUID id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));
        if (user.getEmail().equalsIgnoreCase(adminEmail)) {
            throw new AccessDeniedException("Un administrateur ne peut pas se supprimer lui-meme");
        }
        accountDeletionService.deleteAccount(user);
    }

    @Transactional
    public AdminProductResponse blockProduct(UUID id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Produit introuvable"));
        product.setStatus(ProductStatus.INACTIVE);
        product.setDeletedAt(LocalDateTime.now());
        return mapProduct(productRepository.save(product));
    }

    @Transactional
    public AdminProductResponse unblockProduct(UUID id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Produit introuvable"));
        product.setStatus(ProductStatus.ACTIVE);
        product.setDeletedAt(null);
        return mapProduct(productRepository.save(product));
    }

    @Transactional
    public AdminShopResponse blockShop(UUID id) {
        Shop shop = shopRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Boutique introuvable"));
        shop.setDeletedAt(LocalDateTime.now());
        return mapShop(shopRepository.save(shop));
    }

    @Transactional
    public AdminShopResponse unblockShop(UUID id) {
        Shop shop = shopRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Boutique introuvable"));
        shop.setDeletedAt(null);
        return mapShop(shopRepository.save(shop));
    }

    private AdminUserResponse mapUser(User user) {
        return new AdminUserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getRole(),
                user.isVerified(),
                user.getDeletedAt() != null,
                user.getCity(),
                user.getCreatedAt()
        );
    }

    private AdminShopResponse mapShop(Shop shop) {
        User owner = shop.getOwner();
        return new AdminShopResponse(
                shop.getId(),
                shop.getName(),
                shop.getCity(),
                shop.getCategory(),
                shop.isVerified(),
                shop.getDeletedAt() != null,
                shop.getSubscriptionTier(),
                displayName(owner),
                owner.getEmail(),
                shop.getCreatedAt()
        );
    }

    private AdminProductResponse mapProduct(Product product) {
        User seller = product.getSeller();
        Shop shop = product.getShop();
        return new AdminProductResponse(
                product.getId(),
                product.getTitle(),
                product.getCategory(),
                product.getPrice(),
                product.getStatus(),
                product.getDeletedAt() != null || product.getStatus() == ProductStatus.INACTIVE,
                displayName(seller),
                seller.getEmail(),
                shop == null ? null : shop.getName(),
                product.getCreatedAt()
        );
    }

    private AdminCommissionResponse mapCommission(CommissionTransaction commission) {
        return new AdminCommissionResponse(
                commission.getId(),
                commission.getOrderReference(),
                displayName(commission.getSeller()),
                commission.getShop() == null ? "Vendeur independant" : commission.getShop().getName(),
                commission.getProduct() == null ? "Commande Camazones" : commission.getProduct().getTitle(),
                commission.getGrossAmount(),
                commission.getCommissionRate(),
                commission.getCommissionAmount(),
                commission.getCreatedAt()
        );
    }

    private String displayName(User user) {
        return ((user.getFirstName() == null ? "" : user.getFirstName()) + " " + (user.getLastName() == null ? "" : user.getLastName())).trim();
    }

    private LocalDateTime weekStart() {
        return LocalDateTime.now()
                .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .with(LocalTime.MIN);
    }

    private LocalDateTime weekEnd(LocalDateTime start) {
        return start.plusDays(7).minusNanos(1);
    }
}
