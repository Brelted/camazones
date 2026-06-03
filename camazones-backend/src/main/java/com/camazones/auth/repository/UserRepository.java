package com.camazones.auth.repository;

import com.camazones.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository Spring Data JPA pour l'entité User.
 * Toutes les requêtes CRUD de base sont fournies automatiquement.
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Chercher un user par email (pour le login et la validation)
     */
    Optional<User> findByEmail(String email);

    Optional<User> findByEmailAndDeletedAtIsNullAndRemovedAtIsNull(String email);

    /**
     * Vérifier si un email est déjà utilisé (pour le register)
     */
    boolean existsByEmail(String email);

    /**
     * Vérifier si un numéro de téléphone est déjà utilisé
     */
    boolean existsByPhoneNumber(String phoneNumber);
}
