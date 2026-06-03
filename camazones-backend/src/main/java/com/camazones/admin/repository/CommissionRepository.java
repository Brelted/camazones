package com.camazones.admin.repository;

import com.camazones.admin.entity.CommissionTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
public interface CommissionRepository extends JpaRepository<CommissionTransaction, UUID> {
    List<CommissionTransaction> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);

    @Modifying
    @Query("delete from CommissionTransaction c where c.seller.id = :sellerId")
    void deleteBySellerId(@Param("sellerId") UUID sellerId);

    @Modifying
    @Query("delete from CommissionTransaction c where c.shop.id in :shopIds")
    void deleteByShopIds(@Param("shopIds") Collection<UUID> shopIds);

    @Modifying
    @Query("delete from CommissionTransaction c where c.product.id in :productIds")
    void deleteByProductIds(@Param("productIds") Collection<UUID> productIds);
}
