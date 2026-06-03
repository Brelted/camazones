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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Component
@Order(1)
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;
    private final CommissionRepository commissionRepository;
    private final PasswordEncoder passwordEncoder;
    private final boolean seedEnabled;

    public DataSeeder(UserRepository userRepository,
                      ShopRepository shopRepository,
                      ProductRepository productRepository,
                      CommissionRepository commissionRepository,
                      PasswordEncoder passwordEncoder,
                      @Value("${camazones.seed.enabled:true}") boolean seedEnabled) {
        this.userRepository = userRepository;
        this.shopRepository = shopRepository;
        this.productRepository = productRepository;
        this.commissionRepository = commissionRepository;
        this.passwordEncoder = passwordEncoder;
        this.seedEnabled = seedEnabled;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!seedEnabled || userRepository.count() > 0) {
            return;
        }

        User admin = createUser("admin@camazones.demo", "Admin", "Camazones", "+237600000000", UserRole.ADMIN, true, "Douala");
        User client = createUser("client@camazones.demo", "Client", "Demo", "+237600000001", UserRole.BUYER, false, "Douala");
        User koaOwner = createUser("atelier.koa@camazones.demo", "Atelier", "Koa", "+237600000101", UserRole.SELLER, true, "Douala");
        User taliaOwner = createUser("talia.closet@camazones.demo", "Talia", "Closet", "+237600000102", UserRole.SELLER, true, "Yaounde");
        User nomaOwner = createUser("studio.noma@camazones.demo", "Studio", "Noma", "+237600000103", UserRole.SELLER, false, "Bafoussam");
        User sawaOwner = createUser("sawa.deals@camazones.demo", "Sawa", "Deals", "+237600000104", UserRole.SELLER, false, "Limbe");
        User bijouxOwner = createUser("bijoux.mboa@camazones.demo", "Bijoux", "Mboa", "+237600000105", UserRole.SELLER, true, "Douala");
        User oudOwner = createUser("maison.oud@camazones.demo", "Maison", "Oud", "+237600000106", UserRole.SELLER, true, "Yaounde");
        User sikaOwner = createUser("cuisine.sika@camazones.demo", "Cuisine", "Sika", "+237600000107", UserRole.SELLER, false, "Bafoussam");
        User visionOwner = createUser("vision.home@camazones.demo", "Vision", "Home", "+237600000108", UserRole.SELLER, true, "Douala");
        User kidsOwner = createUser("mboa.kids@camazones.demo", "Mboa", "Kids", "+237600000109", UserRole.SELLER, false, "Garoua");
        User saveursOwner = createUser("saveurs.mboa@camazones.demo", "Saveurs", "Mboa", "+237600000110", UserRole.SELLER, true, "Yaounde");
        User mila = createUser("mila@camazones.demo", "Mila", "Select", "+237600000201", UserRole.SELLER, false, "Douala");
        User alan = createUser("alan.independant@camazones.demo", "Alan", "Independant", "+237600000301", UserRole.SELLER, true, "Douala");
        User sonyOwner = createUser("sony@camazones.demo", "Sony", "Boutique", "+237600000302", UserRole.SELLER, true, "Douala");
        createUser("boutique@camazones.demo", "Boutique", "Demo", "+237600000002", UserRole.SELLER, false, "Douala");
        createUser("premium@camazones.demo", "Premium", "Demo", "+237600000003", UserRole.SELLER, true, "Douala");

        Shop koa = createShop(koaOwner, "Atelier Koa", "Mode premium, accessoires durables et finitions elegantes.", "Mode premium", "Douala", true, SubscriptionTier.PREMIUM);
        Shop talia = createShop(taliaOwner, "Talia Closet", "Vetements tendance, robes, chemises et accessoires propres.", "Vetements", "Yaounde", true, SubscriptionTier.FREE);
        Shop noma = createShop(nomaOwner, "Studio Noma", "Accessoires tech fiables et selection bien organisee.", "Tech", "Bafoussam", false, SubscriptionTier.PREMIUM);
        Shop sawa = createShop(sawaOwner, "Sawa Deals", "Selection mixte, prix visibles et offres rapides.", "Marketplace", "Limbe", false, SubscriptionTier.FREE);
        Shop sony = createShop(sonyOwner, "Sony Store", "Boutique Sony avec consoles, audio, cameras et appareils premium.", "Appareils Sony", "Douala", true, SubscriptionTier.PREMIUM);
        Shop bijoux = createShop(bijouxOwner, "Bijoux Mboa", "Bagues, colliers, bracelets et montres pour cadeaux elegants.", "Bijoux et montres", "Douala", true, SubscriptionTier.FREE);
        Shop oud = createShop(oudOwner, "Maison Oud", "Parfums doux, huiles et coffrets pour une signature elegante.", "Parfums et soins", "Yaounde", true, SubscriptionTier.PREMIUM);
        Shop sika = createShop(sikaOwner, "Cuisine Sika", "Ustensiles solides, marmites, mixeurs et accessoires maison.", "Ustensiles cuisine", "Bafoussam", false, SubscriptionTier.FREE);
        Shop vision = createShop(visionOwner, "Vision Home", "Televisions, son, appareils maison et livraison securisee.", "TV et maison", "Douala", true, SubscriptionTier.PREMIUM);
        Shop kids = createShop(kidsOwner, "Mboa Kids", "Vetements enfants, sacs, petits accessoires et articles utiles.", "Famille et enfants", "Garoua", false, SubscriptionTier.FREE);
        Shop saveurs = createShop(saveursOwner, "Saveurs Mboa", "Plats camerounais, boissons maison et commandes rapides.", "Repas et aliments", "Yaounde", true, SubscriptionTier.FREE);

        seedShopProducts(koa, koaOwner, new String[]{"Sac Kaya cuir", "Robe Lina beige", "Sneaker Rouge", "Lunettes Sol", "Montre Line acier", "Chemise Lin creme", "Veste City noire", "Parfum Bois doux", "Ceinture Tressee", "Sandales Nuit"});
        seedShopProducts(talia, taliaOwner, new String[]{"Mini Bag cyan", "Robe Sand", "T-shirt Basic", "Red Runner", "Bracelet Or fin", "Clean Watch", "City Jacket", "Soft Perfume", "Jupe Crepe", "Foulard Satin"});
        seedShopProducts(noma, nomaOwner, new String[]{"Smartphone Clear X", "Laptop Desk 14", "Casque Noma Pro", "Watch Pro", "Speaker Mini", "Clavier Slate", "Camera Compact", "Earbuds Fast", "Power Bank 30K", "Router Wifi Pro"});
        seedShopProducts(sony, sonyOwner, new String[]{"Sony Xperia Slim", "Sony TV Bravia 55", "Casque Sony WH", "Camera Sony Alpha", "Sony Watch Pro", "Speaker Sony Go", "Sony Earbuds Sense", "Sony Soundbar Cinema", "PlayStation 5 Slim", "Manette DualSense"});
        seedShopProducts(sawa, sawaOwner, new String[]{"Basic Tee coton", "Mini Bag orange", "Airbuds Lite", "Phone Plus 64", "Speaker Go", "Perfume Clear", "Red Sneaker", "Laptop Air 13", "Sandale Beach", "Blender Compact"});
        seedShopProducts(bijoux, bijouxOwner, new String[]{"Collier Or Mboa", "Bague Saphir", "Bracelet Cuir", "Boucles Pearl", "Montre Classic", "Chaine Argent", "Parure Douce", "Bague Mariage", "Broche Emeraude", "Coffret Bijoux"});
        seedShopProducts(oud, oudOwner, new String[]{"Oud Royal", "Vanille Ambree", "Musc Blanc", "Coffret Luxe", "Huile Corps", "Brume Florale", "Creme Main", "Savon Noir", "Encens Ambre", "Diffuseur Oud"});
        seedShopProducts(sika, sikaOwner, new String[]{"Marmite Alu 12L", "Poele Granit", "Set Couteaux", "Mixeur Plus", "Assiettes Ceram", "Verres Clean", "Bouilloire Inox", "Range Epices", "Planche Bambou", "Thermos 1L"});
        seedShopProducts(vision, visionOwner, new String[]{"TV Vision 43 4K", "TV Vision 65 OLED", "Projecteur Mini", "Soundbar Home", "Support TV mural", "Climatiseur 12K", "Ventilateur Pro", "Regulateur Tension", "Frigo Compact", "Camera Interieur"});
        seedShopProducts(kids, kidsOwner, new String[]{"Robe Fille Rose", "Basket School", "Sac Ecole Bleu", "Gourde Inox", "Pyjama Coton", "Casque Mini", "Montre Fun Kids", "Parfum Doux Kids", "Jeu Construction", "Tablette Edu"});
        seedShopProducts(saveurs, saveursOwner, new String[]{"Ndole maison", "Poulet DG", "Eru plantain", "Poisson braise", "Riz crevettes", "Achu sauce jaune", "Beignets haricots", "Koki plantain", "Jus de bissap", "Attieke poisson"});

        createProduct(mila, null, "Watch Line", "Bijoux", "Montre sobre disponible rapidement.", "Douala", 18000, 2, null);
        createProduct(alan, null, "Tablette Alan Clean", "Gadgets", "Tablette tres propre vendue par Alan independant.", "Douala", 65000, 1, null);
        createProduct(client, null, "Sac Client Clean", "Accessoires", "Article client demo pour test de publication independante.", "Douala", 12000, 1, null);
        createProduct(admin, null, "Admin Test Product", "System", "Produit de verification admin.", "Douala", 1000, 1, null);

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
        Shop shop = shopRepository.findByNameIgnoreCase(name).orElseGet(() -> Shop.builder()
                .owner(owner)
                .name(name)
                .build());
        shop.setOwner(owner);
        shop.setDescription(description);
        shop.setCategory(category);
        shop.setCity(city);
        shop.setSubscriptionTier(tier);
        shop.setVerified(verified);
        shop.setRating(new BigDecimal(verified ? "4.8" : "4.3"));
        shop.setTotalReviews(verified ? 128 : 46);
        shop.setDeletedAt(null);
        return shopRepository.save(shop);
    }

    private void seedShopProducts(Shop shop, User owner, String[] titles) {
        for (int i = 0; i < titles.length; i++) {
            String category = categoryFor(titles[i]);
            createProduct(owner, shop, titles[i], category, descriptionFor(titles[i], category), shop.getCity(), priceFor(titles[i], category, i), 4 + i, null);
        }
    }

    private String categoryFor(String title) {
        String value = title.toLowerCase();
        if (value.contains("xperia") || value.contains("phone") || value.contains("smartphone")) return "Telephones";
        if (value.contains("tv ")) return "Televisions";
        if (value.contains("laptop") || value.contains("clavier") || value.contains("router") || value.contains("power bank") || value.contains("tablette")) return "Gadgets";
        if (value.contains("casque") || value.contains("speaker") || value.contains("earbuds") || value.contains("soundbar") || value.contains("airbuds")) return "Audio";
        if (value.contains("playstation") || value.contains("dualsense")) return "Gaming";
        if (value.contains("camera")) return "Cameras";
        if (value.contains("robe") || value.contains("chemise") || value.contains("tee") || value.contains("jacket") || value.contains("jupe") || value.contains("pyjama")) return "Vetements";
        if (value.contains("sneaker") || value.contains("runner") || value.contains("sandale") || value.contains("basket")) return "Chaussures";
        if (value.contains("parfum") || value.contains("oud") || value.contains("musc") || value.contains("brume") || value.contains("savon") || value.contains("encens") || value.contains("diffuseur")) return "Parfums";
        if (value.contains("montre") || value.contains("watch") || value.contains("bague") || value.contains("bracelet") || value.contains("collier") || value.contains("chaine") || value.contains("parure") || value.contains("broche") || value.contains("bijoux")) return "Bijoux";
        if (value.contains("marmite") || value.contains("poele") || value.contains("couteaux") || value.contains("assiettes") || value.contains("verres") || value.contains("bouilloire") || value.contains("epices") || value.contains("planche") || value.contains("thermos") || value.contains("gourde")) return "Ustensiles";
        if (value.contains("mixeur") || value.contains("blender") || value.contains("climatiseur") || value.contains("ventilateur") || value.contains("frigo")) return "Electromenager";
        if (value.contains("jeu")) return "Jouets";
        if (value.contains("ndole") || value.contains("poulet") || value.contains("eru") || value.contains("poisson") || value.contains("riz") || value.contains("achu") || value.contains("beignets") || value.contains("koki") || value.contains("bissap") || value.contains("attieke")) return "Alimentation";
        return "Accessoires";
    }

    private Integer fixedPriceFor(String title) {
        return switch (title) {
            case "Sac Kaya cuir" -> 35000;
            case "Robe Lina beige" -> 30000;
            case "Sneaker Rouge" -> 32000;
            case "Lunettes Sol" -> 12500;
            case "Montre Line acier" -> 28000;
            case "Chemise Lin creme" -> 18000;
            case "Veste City noire" -> 30000;
            case "Parfum Bois doux" -> 25000;
            case "Ceinture Tressee" -> 10000;
            case "Sandales Nuit" -> 12000;
            case "Mini Bag cyan" -> 18000;
            case "Robe Sand" -> 28000;
            case "T-shirt Basic" -> 7000;
            case "Red Runner" -> 30000;
            case "Bracelet Or fin" -> 12000;
            case "Clean Watch" -> 22000;
            case "City Jacket" -> 28000;
            case "Soft Perfume" -> 22000;
            case "Jupe Crepe" -> 15000;
            case "Foulard Satin" -> 7500;
            case "Smartphone Clear X" -> 120000;
            case "Laptop Desk 14" -> 299000;
            case "Casque Noma Pro" -> 30000;
            case "Watch Pro" -> 45000;
            case "Speaker Mini" -> 18000;
            case "Clavier Slate" -> 18000;
            case "Camera Compact" -> 150000;
            case "Earbuds Fast" -> 18000;
            case "Power Bank 30K" -> 22000;
            case "Router Wifi Pro" -> 35000;
            case "Sony Xperia Slim" -> 390000;
            case "Sony TV Bravia 55" -> 570000;
            case "Casque Sony WH" -> 169000;
            case "Camera Sony Alpha" -> 520000;
            case "Sony Watch Pro" -> 95000;
            case "Speaker Sony Go" -> 42000;
            case "Sony Earbuds Sense" -> 40000;
            case "Sony Soundbar Cinema" -> 170000;
            case "PlayStation 5 Slim" -> 425000;
            case "Manette DualSense" -> 55000;
            case "Basic Tee coton" -> 5000;
            case "Mini Bag orange" -> 15000;
            case "Airbuds Lite" -> 12000;
            case "Phone Plus 64" -> 75000;
            case "Speaker Go" -> 15000;
            case "Perfume Clear" -> 18000;
            case "Red Sneaker" -> 28000;
            case "Laptop Air 13" -> 260000;
            case "Sandale Beach" -> 10000;
            case "Blender Compact" -> 18000;
            case "Collier Or Mboa" -> 45000;
            case "Bague Saphir" -> 35000;
            case "Bracelet Cuir" -> 12000;
            case "Boucles Pearl" -> 15000;
            case "Montre Classic" -> 40000;
            case "Chaine Argent" -> 25000;
            case "Parure Douce" -> 60000;
            case "Bague Mariage" -> 85000;
            case "Broche Emeraude" -> 18000;
            case "Coffret Bijoux" -> 12000;
            case "Oud Royal" -> 65000;
            case "Vanille Ambree" -> 30000;
            case "Musc Blanc" -> 25000;
            case "Coffret Luxe" -> 85000;
            case "Huile Corps" -> 15000;
            case "Brume Florale" -> 15000;
            case "Creme Main" -> 6500;
            case "Savon Noir" -> 4500;
            case "Encens Ambre" -> 6000;
            case "Diffuseur Oud" -> 18000;
            case "Marmite Alu 12L" -> 25000;
            case "Poele Granit" -> 15000;
            case "Set Couteaux" -> 18000;
            case "Mixeur Plus" -> 23500;
            case "Assiettes Ceram" -> 16000;
            case "Verres Clean" -> 9000;
            case "Bouilloire Inox" -> 18000;
            case "Range Epices" -> 6500;
            case "Planche Bambou" -> 5000;
            case "Thermos 1L" -> 8500;
            case "TV Vision 43 4K" -> 180000;
            case "TV Vision 65 OLED" -> 790000;
            case "Projecteur Mini" -> 120000;
            case "Soundbar Home" -> 145000;
            case "Support TV mural" -> 15000;
            case "Climatiseur 12K" -> 280000;
            case "Ventilateur Pro" -> 30000;
            case "Regulateur Tension" -> 25000;
            case "Frigo Compact" -> 180000;
            case "Camera Interieur" -> 45000;
            case "Robe Fille Rose" -> 10000;
            case "Basket School" -> 15000;
            case "Sac Ecole Bleu" -> 9000;
            case "Gourde Inox" -> 5000;
            case "Pyjama Coton" -> 8000;
            case "Casque Mini" -> 12000;
            case "Montre Fun Kids" -> 7000;
            case "Parfum Doux Kids" -> 8000;
            case "Jeu Construction" -> 15000;
            case "Tablette Edu" -> 45000;
            case "Ndole maison" -> 4500;
            case "Poulet DG" -> 6500;
            case "Eru plantain" -> 5000;
            case "Poisson braise" -> 7500;
            case "Riz crevettes" -> 5500;
            case "Achu sauce jaune" -> 5000;
            case "Beignets haricots" -> 1500;
            case "Koki plantain" -> 3500;
            case "Jus de bissap" -> 1000;
            case "Attieke poisson" -> 6000;
            default -> null;
        };
    }

    private int priceFor(String title, String category, int index) {
        Integer fixedPrice = fixedPriceFor(title);
        if (fixedPrice != null) {
            return fixedPrice;
        }
        String value = title.toLowerCase();
        if (value.contains("oled")) return 890000;
        if (value.contains("bravia")) return 650000;
        if (value.contains("alpha")) return 520000;
        if (value.contains("playstation")) return 440000;
        if (value.contains("xperia")) return 390000;
        if (value.contains("laptop")) return 260000 + (index * 10000);
        if (value.contains("climatiseur")) return 320000;
        if (value.contains("frigo")) return 210000;
        if (value.contains("soundbar") || value.contains("projecteur")) return 165000 + (index * 5000);
        if (value.contains("camera")) return 65000 + (index * 15000);
        if (value.contains("telephone") || "Telephones".equals(category)) return 95000 + (index * 12000);
        if ("Gaming".equals(category)) return 55000 + (index * 9000);
        if ("Audio".equals(category)) return 18500 + (index * 6500);
        if ("Bijoux".equals(category)) return 18000 + (index * 8500);
        if ("Parfums".equals(category)) return 12000 + (index * 7000);
        if ("Electromenager".equals(category)) return 24500 + (index * 9000);
        if ("Alimentation".equals(category)) return 1500 + (index * 700);
        if ("Ustensiles".equals(category)) return 7500 + (index * 3500);
        if ("Chaussures".equals(category)) return 16000 + (index * 4000);
        if ("Vetements".equals(category)) return 8500 + (index * 4500);
        return 9000 + (index * 3500);
    }

    private String descriptionFor(String title, String category) {
        return title + " disponible chez Camazones, categorie " + category + ", stock clair et vendeur joignable.";
    }

    private Product createProduct(User seller, Shop shop, String title, String category, String description, String city, int price, int stock, String imageUrl) {
        Product existing = productRepository.findFirstBySellerIdAndTitleIgnoreCaseAndDeletedAtIsNull(seller.getId(), title).orElse(null);
        if (existing != null) {
            existing.setShop(shop);
            existing.setCategory(category);
            existing.setDescription(description);
            existing.setCity(city);
            existing.setPrice(BigDecimal.valueOf(price));
            existing.setStockQuantity(stock);
            return productRepository.save(existing);
        }

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
        if (imageUrl != null && !imageUrl.isBlank()) {
            product.getImages().add(new ProductImage(product, imageUrl, 0));
        }
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
