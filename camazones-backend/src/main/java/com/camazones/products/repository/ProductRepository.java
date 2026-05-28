package com.camazones.products.repository;

import com.camazones.products.entity.Product;
import com.camazones.products.entity.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository
        extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {

    Optional<Product> findByIdAndDeletedAtIsNull(UUID id);

    Page<Product> findByShopIdAndDeletedAtIsNullAndStatus(
            UUID shopId, ProductStatus status, Pageable pageable);

    // Incrémenter le compteur de vues
    @Modifying
    @Query("UPDATE Product p SET p.views = p.views + 1 WHERE p.id = :id")
    void incrementViews(@Param("id") UUID id);
}
