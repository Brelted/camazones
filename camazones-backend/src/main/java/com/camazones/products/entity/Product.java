package com.camazones.products.entity;

import com.camazones.auth.entity.User;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Produit en vente — correspond à la table "products" du SCHEMA.md
 * Inclut géolocalisation (latitude/longitude) — Tâche 11.
 */
@Entity
@Table(name = "products", indexes = {
        @Index(name = "idx_products_seller_id",  columnList = "seller_id"),
        @Index(name = "idx_products_shop_id",    columnList = "shop_id"),
        @Index(name = "idx_products_category",   columnList = "category"),
        @Index(name = "idx_products_city",       columnList = "city"),
        @Index(name = "idx_products_status",     columnList = "status")
})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id")
    private Shop shop;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    @Column(name = "is_negotiable", nullable = false)
    private boolean isNegotiable = false;

    @Column(name = "stock_quantity", nullable = false)
    private int stockQuantity = 0;

    @Column(length = 100)
    private String city;

    // ── Tâche 11 : Géolocalisation ────────────────────────────────────────
    @Column(precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(precision = 11, scale = 8)
    private BigDecimal longitude;

    @Column(name = "primary_image_url", length = 500)
    private String primaryImageUrl;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.ZERO;

    @Column(name = "total_reviews")
    private int totalReviews = 0;

    @Column(nullable = false)
    private int views = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProductStatus status = ProductStatus.ACTIVE;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    private List<ProductImage> images = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // ── Constructeurs ─────────────────────────────────────────────────────

    public Product() {}

    // ── Getters & Setters ─────────────────────────────────────────────────

    public UUID          getId()                      { return id; }
    public User          getSeller()                  { return seller; }
    public void          setSeller(User v)            { this.seller = v; }
    public Shop          getShop()                    { return shop; }
    public void          setShop(Shop v)              { this.shop = v; }
    public String        getTitle()                   { return title; }
    public void          setTitle(String v)           { this.title = v; }
    public String        getDescription()             { return description; }
    public void          setDescription(String v)     { this.description = v; }
    public String        getCategory()                { return category; }
    public void          setCategory(String v)        { this.category = v; }
    public BigDecimal    getPrice()                   { return price; }
    public void          setPrice(BigDecimal v)       { this.price = v; }
    public boolean       isNegotiable()               { return isNegotiable; }
    public void          setNegotiable(boolean v)     { this.isNegotiable = v; }
    public int           getStockQuantity()           { return stockQuantity; }
    public void          setStockQuantity(int v)      { this.stockQuantity = v; }
    public String        getCity()                    { return city; }
    public void          setCity(String v)            { this.city = v; }
    public BigDecimal    getLatitude()                { return latitude; }
    public void          setLatitude(BigDecimal v)    { this.latitude = v; }
    public BigDecimal    getLongitude()               { return longitude; }
    public void          setLongitude(BigDecimal v)   { this.longitude = v; }
    public String        getPrimaryImageUrl()         { return primaryImageUrl; }
    public void          setPrimaryImageUrl(String v) { this.primaryImageUrl = v; }
    public BigDecimal    getRating()                  { return rating; }
    public void          setRating(BigDecimal v)      { this.rating = v; }
    public int           getTotalReviews()            { return totalReviews; }
    public void          setTotalReviews(int v)       { this.totalReviews = v; }
    public int           getViews()                   { return views; }
    public void          setViews(int v)              { this.views = v; }
    public ProductStatus getStatus()                  { return status; }
    public void          setStatus(ProductStatus v)   { this.status = v; }
    public List<ProductImage> getImages()             { return images; }
    public LocalDateTime getCreatedAt()               { return createdAt; }
    public LocalDateTime getUpdatedAt()               { return updatedAt; }
    public LocalDateTime getDeletedAt()               { return deletedAt; }
    public void          setDeletedAt(LocalDateTime v){ this.deletedAt = v; }

    // ── Builder ───────────────────────────────────────────────────────────

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Product p = new Product();
        public Builder seller(User v)          { p.seller = v;        return this; }
        public Builder shop(Shop v)            { p.shop = v;          return this; }
        public Builder title(String v)         { p.title = v;         return this; }
        public Builder description(String v)   { p.description = v;   return this; }
        public Builder category(String v)      { p.category = v;      return this; }
        public Builder price(BigDecimal v)     { p.price = v;         return this; }
        public Builder negotiable(boolean v)   { p.isNegotiable = v;  return this; }
        public Builder stockQuantity(int v)    { p.stockQuantity = v; return this; }
        public Builder city(String v)          { p.city = v;          return this; }
        public Builder latitude(BigDecimal v)  { p.latitude = v;      return this; }
        public Builder longitude(BigDecimal v) { p.longitude = v;     return this; }
        public Builder primaryImageUrl(String v){ p.primaryImageUrl=v; return this; }
        public Product build()                 { return p; }
    }
}
