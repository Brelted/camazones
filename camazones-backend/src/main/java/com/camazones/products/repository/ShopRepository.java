package com.camazones.products.repository;

import com.camazones.products.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ShopRepository extends JpaRepository<Shop, UUID> {
    List<Shop>       findByOwnerIdAndDeletedAtIsNull(UUID ownerId);
    Optional<Shop>   findByIdAndDeletedAtIsNull(UUID id);
    boolean          existsByOwnerIdAndDeletedAtIsNull(UUID ownerId);
}
