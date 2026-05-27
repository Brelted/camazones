package com.camazones.products.repository;

import com.camazones.products.entity.Product;
import com.camazones.products.entity.ProductStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

/**
 * Filtres dynamiques pour GET /products
 * Chaque filtre est optionnel — on ne l'applique que s'il est fourni.
 */
public class ProductSpecification {

    public static Specification<Product> filter(
            String category,
            String city,
            String search
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Jamais les produits supprimés (soft delete)
            predicates.add(cb.isNull(root.get("deletedAt")));

            // Seulement les produits actifs
            predicates.add(cb.equal(root.get("status"), ProductStatus.ACTIVE));

            // Filtre catégorie
            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(
                        cb.lower(root.get("category")),
                        category.toLowerCase()
                ));
            }

            // Filtre ville
            if (city != null && !city.isBlank()) {
                predicates.add(cb.equal(
                        cb.lower(root.get("city")),
                        city.toLowerCase()
                ));
            }

            // Recherche par titre (LIKE %search%)
            if (search != null && !search.isBlank()) {
                predicates.add(cb.like(
                        cb.lower(root.get("title")),
                        "%" + search.toLowerCase() + "%"
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
