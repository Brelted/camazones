package com.camazones.core.config;

import com.camazones.admin.entity.CommissionTransaction;
import com.camazones.admin.repository.CommissionRepository;
import com.camazones.auth.entity.User;
import com.camazones.auth.entity.UserRole;
import com.camazones.auth.repository.UserRepository;
import com.camazones.products.entity.Product;
import com.camazones.products.entity.ProductImage;
import com.camazones.products.entity.Shop;
import com.camazones.products.entity.SubscriptionTier;
import com.camazones.products.repository.ProductRepository;
import com.camazones.products.repository.ShopRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;
    private final CommissionRepository commissionRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      ShopRepository shopRepository,
                      ProductRepository productRepository,
                      CommissionRepository commissionRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.shopRepository = shopRepository;
        this.productRepository = productRepository;
        this.commissionRepository = commissionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (productRepository.count() > 0) {
            return;
        }

        User admin = createUser("admin@camazones.demo", "Admin", "Camazones", "+237600000000", UserRole.ADMIN, true, "Douala");
        User koaOwner = createUser("koa@camazones.demo", "Atelier", "Koa", "+237600000101", UserRole.SELLER, true, "Douala");
        User taliaOwner = createUser("talia@camazones.demo", "Talia", "Closet", "+237600000102", UserRole.SELLER, true, "Yaounde");
        User nomaOwner = createUser("noma@camazones.demo", "Studio", "Noma", "+237600000103", UserRole.SELLER, false, "Bafoussam");
        User sawaOwner = createUser("sawa@camazones.demo", "Sawa", "Deals", "+237600000104", UserRole.SELLER, false, "Limbe");
        User mila = createUser("mila@camazones.demo", "Mila", "Select", "+237600000201", UserRole.SELLER, false, "Douala");
        User alan = createUser("alan.independant@camazones.demo", "Alan", "Independant", "+237600000301", UserRole.SELLER, true, "Douala");
        User sonyOwner = createUser("sony@camazones.demo", "Sony", "Boutique", "+237600000302", UserRole.SELLER, true, "Douala");

        Shop koa = createShop(koaOwner, "Atelier Koa", "Mode premium, accessoires durables et finitions elegantes.", "Mode premium", "Douala", true, SubscriptionTier.PREMIUM);
        Shop talia = createShop(taliaOwner, "Talia Closet", "Vetements tendance, robes, chemises et accessoires propres.", "Vetements", "Yaounde", true, SubscriptionTier.FREE);
        Shop noma = createShop(nomaOwner, "Studio Noma", "Accessoires tech fiables et selection bien organisee.", "Tech", "Bafoussam", false, SubscriptionTier.PREMIUM);
        Shop sawa = createShop(sawaOwner, "Sawa Deals", "Selection mixte, prix visibles et offres rapides.", "Marketplace", "Limbe", false, SubscriptionTier.FREE);
        Shop sony = createShop(sonyOwner, "Sony Store", "Boutique Sony avec consoles, audio, cameras et appareils premium.", "Appareils Sony", "Douala", true, SubscriptionTier.PREMIUM);

        List<String> fashion = List.of(
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900",
                "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900",
                "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900",
                "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900",
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900",
                "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900",
                "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900",
                "https://images.unsplash.com/photo-1541643600914-78b084683601?w=900"
        );
        List<String> tech = List.of(
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900",
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900",
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900",
                "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900",
                "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=900",
                "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900",
                "https://images.unsplash.com/photo-1601593346740-925612772716?w=900",
                "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=900"
        );

        seedShopProducts(koa, koaOwner, fashion, new String[]{"Sac Kaya", "Veste Nuit", "Sneaker Ivoire", "Lunettes Sol", "Montre Line", "Chemise Lin", "Portefeuille Nova", "Parfum Bois"});
        seedShopProducts(talia, taliaOwner, fashion, new String[]{"Mini Bag Cyan", "Dress Sand", "Basic Tee", "Red Runner", "Sun Glasses", "Clean Watch", "City Jacket", "Soft Perfume"});
        seedShopProducts(noma, nomaOwner, tech, new String[]{"Power Slim 20K", "Stand Lux", "Airbuds Noma", "Watch Pro", "Speaker Mini", "Clavier Slate", "Case Armor", "Cable Fast"});
        seedShopProducts(sawa, sawaOwner, List.of(fashion.get(5), fashion.get(2), tech.get(7), tech.get(0), tech.get(4), fashion.get(7), fashion.get(0), tech.get(1)), new String[]{"Basic Tee", "Mini Bag", "Airbuds Lite", "Phone Plus", "Speaker Go", "Perfume Clear", "Red Sneaker", "Laptop Air"});
        seedShopProducts(sony, sonyOwner, tech, new String[]{"PlayStation 5 Slim", "Casque Sony WH", "Camera Alpha", "Sony Xperia Pro", "Speaker Sony Go", "Manette DualSense", "Barre de son Sony", "Chargeur Sony Fast"});

        createProduct(mila, null, "Watch Line", "Accessoires", "Montre sobre disponible rapidement.", "Douala", 18000, 2, fashion.get(4));
        createProduct(alan, null, "Tablette Alan Clean", "Gadgets", "Tablette tres propre vendue par Alan independant.", "Douala", 65000, 1, tech.get(1));
        createProduct(admin, null, "Admin Test Product", "System", "Produit de verification admin.", "Douala", 1000, 1, tech.get(5));

        seedCommissions();
    }

    private User createUser(String email, String firstName, String lastName, String phone, UserRole role, boolean verified, String city) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User user = User.builder()
                    .email(email)
                    .passwordHash(passwordEncoder.encode("Camazones2026!"))
                    .firstName(firstName)
                    .lastName(lastName)
                    .phoneNumber(phone)
                    .role(role)
                    .build();
            user.setVerified(verified);
            user.setCity(city);
            return userRepository.save(user);
        });
    }

    private Shop createShop(User owner, String name, String description, String category, String city, boolean verified, SubscriptionTier tier) {
        Shop shop = Shop.builder()
                .owner(owner)
                .name(name)
                .description(description)
                .category(category)
                .city(city)
                .subscriptionTier(tier)
                .build();
        shop.setVerified(verified);
        shop.setRating(new BigDecimal(verified ? "4.8" : "4.3"));
        shop.setTotalReviews(verified ? 128 : 46);
        return shopRepository.save(shop);
    }

    private void seedShopProducts(Shop shop, User owner, List<String> images, String[] titles) {
        for (int i = 0; i < titles.length; i++) {
            createProduct(owner, shop, titles[i], i % 2 == 0 ? "Mode" : "Gadgets", "Article Camazones pret pour vitrine, stock clair et vendeur joignable.", shop.getCity(), 8500 + (i * 4200), 4 + i, images.get(i));
        }
    }

    private Product createProduct(User seller, Shop shop, String title, String category, String description, String city, int price, int stock, String imageUrl) {
        Product product = Product.builder()
                .seller(seller)
                .shop(shop)
                .title(title)
                .description(description)
                .category(category)
                .price(BigDecimal.valueOf(price))
                .negotiable(true)
                .stockQuantity(stock)
                .city(city)
                .primaryImageUrl(imageUrl)
                .build();
        product.setRating(new BigDecimal("4.6"));
        product.setTotalReviews(18);
        product.getImages().add(new ProductImage(product, imageUrl, 0));
        return productRepository.save(product);
    }

    private void seedCommissions() {
        if (commissionRepository.count() > 0) {
            return;
        }

        List<Product> products = productRepository.findAll();
        BigDecimal rate = new BigDecimal("0.1000");

        for (int i = 0; i < products.size(); i++) {
            Product product = products.get(i);
            BigDecimal quantity = BigDecimal.valueOf(1L + (i % 3));
            BigDecimal gross = product.getPrice().multiply(quantity);
            BigDecimal amount = gross.multiply(rate).setScale(2, RoundingMode.HALF_UP);

            CommissionTransaction commission = new CommissionTransaction();
            commission.setOrderReference("CMZ-WEEK-" + String.format("%04d", i + 1));
            commission.setSeller(product.getSeller());
            commission.setShop(product.getShop());
            commission.setProduct(product);
            commission.setGrossAmount(gross);
            commission.setCommissionRate(rate);
            commission.setCommissionAmount(amount);
            commission.setCreatedAt(LocalDateTime.now().minusDays(i % 6).minusHours(i));
            commissionRepository.save(commission);
        }

        products.stream()
                .filter(product -> "PlayStation 5 Slim".equals(product.getTitle()))
                .findFirst()
                .ifPresent(product -> {
                    BigDecimal gross = BigDecimal.valueOf(350000);
                    CommissionTransaction commission = new CommissionTransaction();
                    commission.setOrderReference("CMZ-ALAN-SONY-350");
                    commission.setSeller(product.getSeller());
                    commission.setShop(product.getShop());
                    commission.setProduct(product);
                    commission.setGrossAmount(gross);
                    commission.setCommissionRate(rate);
                    commission.setCommissionAmount(gross.multiply(rate).setScale(2, RoundingMode.HALF_UP));
                    commission.setCreatedAt(LocalDateTime.now().minusHours(2));
                    commissionRepository.save(commission);
                });
    }
}
