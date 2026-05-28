package com.camazones.products.service;

import com.camazones.products.dto.ProductResponse;
import com.camazones.products.dto.ShopResponse;
import com.camazones.products.entity.Product;
import com.camazones.products.entity.Shop;
import org.springframework.stereotype.Component;

import java.util.List;

/** Convertit les entités en DTOs de réponse. */
@Component
public class ProductMapper {

    public ProductResponse toResponse(Product p) {
        List<String> imageUrls = p.getImages().stream()
                .map(img -> img.getImageUrl())
                .toList();

        ProductResponse.SellerInfo seller = new ProductResponse.SellerInfo(
                p.getSeller().getId(),
                p.getSeller().getFirstName(),
                p.getSeller().getLastName()
        );

        ProductResponse.ShopInfo shop = p.getShop() == null ? null :
                new ProductResponse.ShopInfo(
                        p.getShop().getId(),
                        p.getShop().getName(),
                        p.getShop().getLogoUrl()
                );

        return new ProductResponse(
                p.getId(), p.getTitle(), p.getDescription(), p.getCategory(),
                p.getPrice(), p.isNegotiable(), p.getStockQuantity(),
                p.getCity(), p.getLatitude(), p.getLongitude(),
                p.getPrimaryImageUrl(), imageUrls,
                p.getRating(), p.getTotalReviews(), p.getViews(),
                p.getStatus(), seller, shop, p.getCreatedAt()
        );
    }

    public ShopResponse toShopResponse(Shop s) {
        ShopResponse.OwnerInfo owner = new ShopResponse.OwnerInfo(
                s.getOwner().getId(),
                s.getOwner().getFirstName(),
                s.getOwner().getLastName()
        );
        return new ShopResponse(
                s.getId(), s.getName(), s.getDescription(), s.getLogoUrl(),
                s.getCategory(), s.getCity(), s.getRating(), s.getTotalReviews(),
                s.isVerified(), s.getSubscriptionTier(), owner, s.getCreatedAt()
        );
    }
}
