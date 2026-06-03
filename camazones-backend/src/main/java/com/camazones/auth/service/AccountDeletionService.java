package com.camazones.auth.service;

import com.camazones.admin.repository.CommissionRepository;
import com.camazones.auth.entity.User;
import com.camazones.auth.repository.UserRepository;
import com.camazones.messages.entity.ChatConversation;
import com.camazones.messages.repository.ChatConversationRepository;
import com.camazones.products.entity.Product;
import com.camazones.products.entity.Shop;
import com.camazones.products.repository.ProductRepository;
import com.camazones.products.repository.ShopRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AccountDeletionService {

    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;
    private final CommissionRepository commissionRepository;
    private final ChatConversationRepository chatConversationRepository;

    public AccountDeletionService(UserRepository userRepository,
                                  ShopRepository shopRepository,
                                  ProductRepository productRepository,
                                  CommissionRepository commissionRepository,
                                  ChatConversationRepository chatConversationRepository) {
        this.userRepository = userRepository;
        this.shopRepository = shopRepository;
        this.productRepository = productRepository;
        this.commissionRepository = commissionRepository;
        this.chatConversationRepository = chatConversationRepository;
    }

    @Transactional
    public void deleteAccount(User user) {
        UUID userId = user.getId();
        List<ChatConversation> conversations = chatConversationRepository.findAllForUserId(userId);
        List<Product> products = productRepository.findAllLinkedToUser(userId);
        List<Shop> shops = shopRepository.findByOwnerId(userId);
        List<UUID> productIds = products.stream().map(Product::getId).toList();
        List<UUID> shopIds = shops.stream().map(Shop::getId).toList();

        if (!productIds.isEmpty()) {
            commissionRepository.deleteByProductIds(productIds);
        }
        if (!shopIds.isEmpty()) {
            commissionRepository.deleteByShopIds(shopIds);
        }
        commissionRepository.deleteBySellerId(userId);
        chatConversationRepository.deleteAll(conversations);
        productRepository.deleteAll(products);
        shopRepository.deleteAll(shops);
        userRepository.delete(user);
    }
}
