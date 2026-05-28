package com.camazones.products.service;

import com.camazones.auth.entity.User;
import com.camazones.auth.repository.UserRepository;
import com.camazones.products.dto.*;
import com.camazones.products.entity.Product;
import com.camazones.products.entity.ProductImage;
import com.camazones.products.entity.ProductStatus;
import com.camazones.products.repository.ProductRepository;
import com.camazones.products.repository.ProductSpecification;
import com.camazones.products.repository.ShopRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ShopRepository    shopRepository;
    private final UserRepository    userRepository;
    private final ProductMapper     mapper;

    public ProductService(ProductRepository productRepository,
                          ShopRepository shopRepository,
                          UserRepository userRepository,
                          ProductMapper mapper) {
        this.productRepository = productRepository;
        this.shopRepository    = shopRepository;
        this.userRepository    = userRepository;
        this.mapper            = mapper;
    }

    // ── Tâche 4 : GET /products ───────────────────────────────────────────

    public ProductPageResponse getProducts(String category, String city,
                                           String search, int page, int limit) {
        Pageable pageable = PageRequest.of(
                Math.max(0, page - 1),   // API page 1 = index 0
                Math.min(limit, 100),    // max 100 items par page
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<Product> result = productRepository.findAll(
                ProductSpecification.filter(category, city, search),
                pageable
        );

        List<ProductResponse> data = result.getContent()
                .stream().map(mapper::toResponse).toList();

        return new ProductPageResponse(
                data,
                result.getTotalElements(),
                page,
                limit,
                result.getTotalPages()
        );
    }

    // ── Tâche 5 : POST /products ──────────────────────────────────────────

    @Transactional
    public ProductResponse createProduct(String sellerEmail, CreateProductRequest req) {
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable"));

        Product product = Product.builder()
                .seller(seller)
                .shop(req.shopId() != null
                        ? shopRepository.findByIdAndDeletedAtIsNull(req.shopId()).orElse(null)
                        : null)
                .title(req.title())
                .description(req.description())
                .category(req.category())
                .price(req.price())
                .negotiable(req.negotiable())
                .stockQuantity(req.stockQuantity())
                .city(req.city())
                .latitude(req.latitude())
                .longitude(req.longitude())
                .primaryImageUrl(req.primaryImageUrl())
                .build();

        // Ajouter les images supplémentaires
        if (req.imageUrls() != null) {
            for (int i = 0; i < req.imageUrls().size(); i++) {
                product.getImages().add(new ProductImage(product, req.imageUrls().get(i), i));
            }
        }

        return mapper.toResponse(productRepository.save(product));
    }

    // ── Tâche 6 : GET /products/:id ──────────────────────────────────────

    @Transactional
    public ProductResponse getProduct(UUID productId) {
        Product product = findActiveProduct(productId);
        productRepository.incrementViews(productId);
        return mapper.toResponse(product);
    }

    // ── Tâche 7 : PUT /products/:id ──────────────────────────────────────

    @Transactional
    public ProductResponse updateProduct(String sellerEmail, UUID productId,
                                         UpdateProductRequest req) {
        Product product = findActiveProduct(productId);
        checkOwnership(product, sellerEmail);

        if (req.title()          != null) product.setTitle(req.title());
        if (req.description()    != null) product.setDescription(req.description());
        if (req.category()       != null) product.setCategory(req.category());
        if (req.price()          != null) product.setPrice(req.price());
        if (req.negotiable()     != null) product.setNegotiable(req.negotiable());
        if (req.stockQuantity()  != null) product.setStockQuantity(req.stockQuantity());
        if (req.city()           != null) product.setCity(req.city());
        if (req.latitude()       != null) product.setLatitude(req.latitude());
        if (req.longitude()      != null) product.setLongitude(req.longitude());
        if (req.primaryImageUrl()!= null) product.setPrimaryImageUrl(req.primaryImageUrl());
        if (req.status()         != null) product.setStatus(req.status());

        // Remplacer les images si fournies
        if (req.imageUrls() != null) {
            product.getImages().clear();
            for (int i = 0; i < req.imageUrls().size(); i++) {
                product.getImages().add(new ProductImage(product, req.imageUrls().get(i), i));
            }
        }

        return mapper.toResponse(productRepository.save(product));
    }

    // ── Tâche 8 : DELETE /products/:id (soft delete) ─────────────────────

    @Transactional
    public void deleteProduct(String sellerEmail, UUID productId) {
        Product product = findActiveProduct(productId);
        checkOwnership(product, sellerEmail);
        product.setDeletedAt(LocalDateTime.now());
        product.setStatus(ProductStatus.INACTIVE);
        productRepository.save(product);
    }

    // ── Tâche 10 : GET /shops/:id/products ───────────────────────────────

    public ProductPageResponse getShopProducts(UUID shopId, int page, int limit) {
        Pageable pageable = PageRequest.of(
                Math.max(0, page - 1), Math.min(limit, 100),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
        Page<Product> result = productRepository
                .findByShopIdAndDeletedAtIsNullAndStatus(
                        shopId, ProductStatus.ACTIVE, pageable);

        return new ProductPageResponse(
                result.getContent().stream().map(mapper::toResponse).toList(),
                result.getTotalElements(), page, limit, result.getTotalPages()
        );
    }

    // ── Utilitaires privés ────────────────────────────────────────────────

    private Product findActiveProduct(UUID id) {
        return productRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Produit introuvable"));
    }

    private void checkOwnership(Product product, String email) {
        if (!product.getSeller().getEmail().equals(email)) {
            throw new AccessDeniedException("Vous n'êtes pas le propriétaire de ce produit");
        }
    }
}
