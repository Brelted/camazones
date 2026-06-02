package com.camazones.admin.entity;

import com.camazones.auth.entity.User;
import com.camazones.products.entity.Product;
import com.camazones.products.entity.Shop;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "commission_transactions", indexes = {
        @Index(name = "idx_commissions_created_at", columnList = "created_at"),
        @Index(name = "idx_commissions_seller_id", columnList = "seller_id")
})
public class CommissionTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(name = "order_reference", nullable = false, unique = true, length = 80)
    private String orderReference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id")
    private Shop shop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "gross_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal grossAmount;

    @Column(name = "commission_rate", nullable = false, precision = 5, scale = 4)
    private BigDecimal commissionRate;

    @Column(name = "commission_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal commissionAmount;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public UUID getId() { return id; }
    public String getOrderReference() { return orderReference; }
    public void setOrderReference(String orderReference) { this.orderReference = orderReference; }
    public User getSeller() { return seller; }
    public void setSeller(User seller) { this.seller = seller; }
    public Shop getShop() { return shop; }
    public void setShop(Shop shop) { this.shop = shop; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public BigDecimal getGrossAmount() { return grossAmount; }
    public void setGrossAmount(BigDecimal grossAmount) { this.grossAmount = grossAmount; }
    public BigDecimal getCommissionRate() { return commissionRate; }
    public void setCommissionRate(BigDecimal commissionRate) { this.commissionRate = commissionRate; }
    public BigDecimal getCommissionAmount() { return commissionAmount; }
    public void setCommissionAmount(BigDecimal commissionAmount) { this.commissionAmount = commissionAmount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @PrePersist
    void beforeCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
