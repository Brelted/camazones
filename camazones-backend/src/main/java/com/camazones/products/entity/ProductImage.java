package com.camazones.products.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Image d'un produit — correspond à la table "product_images" du SCHEMA.md
 */
@Entity
@Table(name = "product_images")
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "display_order")
    private int displayOrder = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // ── Constructeurs ─────────────────────────────────────────────────────

    public ProductImage() {}

    public ProductImage(Product product, String imageUrl, int displayOrder) {
        this.product      = product;
        this.imageUrl     = imageUrl;
        this.displayOrder = displayOrder;
    }

    // ── Getters ───────────────────────────────────────────────────────────

    public UUID          getId()           { return id; }
    public Product       getProduct()      { return product; }
    public void          setProduct(Product v) { this.product = v; }
    public String        getImageUrl()     { return imageUrl; }
    public void          setImageUrl(String v) { this.imageUrl = v; }
    public int           getDisplayOrder() { return displayOrder; }
    public void          setDisplayOrder(int v) { this.displayOrder = v; }
    public LocalDateTime getCreatedAt()    { return createdAt; }
}
