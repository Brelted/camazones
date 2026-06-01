package com.camazones.admin.repository;

import com.camazones.admin.entity.CommissionTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface CommissionRepository extends JpaRepository<CommissionTransaction, UUID> {
    List<CommissionTransaction> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);
}
