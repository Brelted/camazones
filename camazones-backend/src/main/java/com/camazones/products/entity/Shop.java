package com.camazones.products.entity;

import com.camazones.auth.entity.User;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Boutique d'un vendeur — correspond à la table "shops" du SCHEMA.md
 */
@Entity
@Table(name = "shops")
public class Shop {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(length = 100)
    private String category;

    @Column(length = 100)
    private String city;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.ZERO;

    @Column(name = "total_reviews")
    private int totalReviews = 0;

    @Column(name = "is_verified", nullable = false)
    private boolean isVerified = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "subscription_tier", nullable = false, length = 20)
    private SubscriptionTier subscriptionTier = SubscriptionTier.FREE;

    @Column(name = "subscription_expires_at")
    private LocalDateTime subscriptionExpiresAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // ── Constructeurs ─────────────────────────────────────────────────────

    public Shop() {}

    // ── Getters & Setters ─────────────────────────────────────────────────

    public UUID             getId()                       { return id; }
    public User             getOwner()                    { return owner; }
    public void             setOwner(User v)              { this.owner = v; }
    public String           getName()                     { return name; }
    public void             setName(String v)             { this.name = v; }
    public String           getDescription()              { return description; }
    public void             setDescription(String v)      { this.description = v; }
    public String           getLogoUrl()                  { return logoUrl; }
    public void             setLogoUrl(String v)          { this.logoUrl = v; }
    public String           getCategory()                 { return category; }
    public void             setCategory(String v)         { this.category = v; }
    public String           getCity()                     { return city; }
    public void             setCity(String v)             { this.city = v; }
    public BigDecimal       getRating()                   { return rating; }
    public void             setRating(BigDecimal v)       { this.rating = v; }
    public int              getTotalReviews()             { return totalReviews; }
    public void             setTotalReviews(int v)        { this.totalReviews = v; }
    public boolean          isVerified()                  { return isVerified; }
    public void             setVerified(boolean v)        { this.isVerified = v; }
    public SubscriptionTier getSubscriptionTier()         { return subscriptionTier; }
    public void             setSubscriptionTier(SubscriptionTier v) { this.subscriptionTier = v; }
    public LocalDateTime    getSubscriptionExpiresAt()    { return subscriptionExpiresAt; }
    public void             setSubscriptionExpiresAt(LocalDateTime v) { this.subscriptionExpiresAt = v; }
    public LocalDateTime    getCreatedAt()                { return createdAt; }
    public LocalDateTime    getUpdatedAt()                { return updatedAt; }
    public LocalDateTime    getDeletedAt()                { return deletedAt; }
    public void             setDeletedAt(LocalDateTime v) { this.deletedAt = v; }

    // ── Builder ───────────────────────────────────────────────────────────

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Shop s = new Shop();
        public Builder owner(User v)              { s.owner = v;              return this; }
        public Builder name(String v)             { s.name = v;               return this; }
        public Builder description(String v)      { s.description = v;        return this; }
        public Builder logoUrl(String v)          { s.logoUrl = v;            return this; }
        public Builder category(String v)         { s.category = v;           return this; }
        public Builder city(String v)             { s.city = v;               return this; }
        public Builder subscriptionTier(SubscriptionTier v) { s.subscriptionTier = v; return this; }
        public Shop build()                       { return s; }
    }
}
