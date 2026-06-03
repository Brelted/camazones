package com.camazones.products.repository;

import com.camazones.products.entity.Product;
import com.camazones.products.entity.ProductStatus;
import com.camazones.products.entity.Shop;
import com.camazones.auth.entity.User;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
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

            // Recherche globale multi-champs: titre, description, categorie, ville, vendeur, boutique.
            if (search != null && !search.isBlank()) {
                query.distinct(true);
                Join<Product, User> seller = root.join("seller", JoinType.LEFT);
                Join<Product, Shop> shop = root.join("shop", JoinType.LEFT);
                List<Predicate> searchPredicates = new ArrayList<>();
                String pattern = "%" + normalize(search) + "%";
                searchPredicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern),
                        cb.like(cb.lower(root.get("category")), pattern),
                        cb.like(cb.lower(root.get("city")), pattern),
                        cb.like(cb.lower(seller.get("firstName")), pattern),
                        cb.like(cb.lower(seller.get("lastName")), pattern),
                        cb.like(cb.lower(seller.get("email")), pattern),
                        cb.like(cb.lower(shop.get("name")), pattern),
                        cb.like(cb.lower(shop.get("category")), pattern)
                ));

                for (String token : normalize(search).split("\\s+")) {
                    if (token.length() < 3 || isStopWord(token)) {
                        continue;
                    }
                    String tokenPattern = "%" + token + "%";
                    searchPredicates.add(cb.or(
                            cb.like(cb.lower(root.get("title")), tokenPattern),
                            cb.like(cb.lower(root.get("description")), tokenPattern),
                            cb.like(cb.lower(root.get("category")), tokenPattern),
                            cb.like(cb.lower(root.get("city")), tokenPattern),
                            cb.like(cb.lower(seller.get("firstName")), tokenPattern),
                            cb.like(cb.lower(seller.get("lastName")), tokenPattern),
                            cb.like(cb.lower(seller.get("email")), tokenPattern),
                            cb.like(cb.lower(shop.get("name")), tokenPattern),
                            cb.like(cb.lower(shop.get("category")), tokenPattern)
                    ));
                }
                predicates.add(cb.or(searchPredicates.toArray(new Predicate[0])));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase().replaceAll("[^a-z0-9àâäéèêëîïôöùûüç\\s-]", " ");
    }

    private static boolean isStopWord(String token) {
        return List.of("avec", "dans", "pour", "des", "les", "une", "un", "qui", "que", "est", "sur", "cherche", "recherche").contains(token);
    }
}
