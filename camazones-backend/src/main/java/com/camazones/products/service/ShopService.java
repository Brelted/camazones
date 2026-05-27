package com.camazones.products.service;

import com.camazones.auth.entity.User;
import com.camazones.auth.repository.UserRepository;
import com.camazones.products.dto.CreateShopRequest;
import com.camazones.products.dto.ShopResponse;
import com.camazones.products.entity.Shop;
import com.camazones.products.repository.ShopRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ShopService {

    private final ShopRepository   shopRepository;
    private final UserRepository   userRepository;
    private final ProductMapper    mapper;

    public ShopService(ShopRepository shopRepository,
                       UserRepository userRepository,
                       ProductMapper mapper) {
        this.shopRepository = shopRepository;
        this.userRepository = userRepository;
        this.mapper         = mapper;
    }

    /** Tâche 9 : POST /shops */
    @Transactional
    public ShopResponse createShop(String ownerEmail, CreateShopRequest req) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable"));

        Shop shop = Shop.builder()
                .owner(owner)
                .name(req.name())
                .description(req.description())
                .logoUrl(req.logoUrl())
                .category(req.category())
                .city(req.city())
                .build();

        return mapper.toShopResponse(shopRepository.save(shop));
    }

    /** Tâche 10 : GET /shops/:id */
    public ShopResponse getShop(UUID shopId) {
        Shop shop = shopRepository.findByIdAndDeletedAtIsNull(shopId)
                .orElseThrow(() -> new IllegalArgumentException("Boutique introuvable"));
        return mapper.toShopResponse(shop);
    }
}
