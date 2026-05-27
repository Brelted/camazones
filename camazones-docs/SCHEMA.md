# Database Schema - Camazones

Structure de la base de données pour l'application Camazones.

## 📊 Entity Relationship Diagram

```
User (1) ←─→ (M) Shop
User (1) ←─→ (M) Product
User (1) ←─→ (M) Order
Product (1) ←─→ (M) OrderItem
Order (1) ←─→ (M) Escrow
User (1) ←─→ (M) Negotiation
Product (1) ←─→ (M) Negotiation
User (1) ←─→ (M) WalletTransaction
User (1) ←─→ (M) Reel
Product (1) ←─→ (M) Reel
```

## 📋 Tables Principales

### 1. **Users**
Tous les utilisateurs (acheteurs et vendeurs)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone_number VARCHAR(20) UNIQUE,
  profile_picture_url VARCHAR(500),
  bio TEXT,
  role ENUM('BUYER', 'SELLER', 'ADMIN') DEFAULT 'BUYER',
  is_verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMP,
  city VARCHAR(100),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);
```

### 2. **Shops**
Boutiques des vendeurs

```sql
CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logo_url VARCHAR(500),
  category VARCHAR(100),
  city VARCHAR(100),
  rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  subscription_tier ENUM('FREE', 'MONTHLY', 'PREMIUM') DEFAULT 'FREE',
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);
```

### 3. **Products**
Articles en vente

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES users(id),
  shop_id UUID REFERENCES shops(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(15, 2) NOT NULL,
  is_negotiable BOOLEAN DEFAULT false,
  stock_quantity INT DEFAULT 0,
  city VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  primary_image_url VARCHAR(500),
  rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  views INT DEFAULT 0,
  status ENUM('ACTIVE', 'SOLD', 'INACTIVE') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);
```

### 4. **ProductImages**
Galerie d'images pour chaque produit

```sql
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. **Orders**
Commandes de clients

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES users(id),
  seller_id UUID NOT NULL REFERENCES users(id),
  product_id UUID NOT NULL REFERENCES products(id),
  negotiated_price DECIMAL(15, 2),
  status ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. **Escrow**
Système de blocage des fonds

```sql
CREATE TABLE escrow (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id),
  buyer_id UUID NOT NULL REFERENCES users(id),
  seller_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(15, 2) NOT NULL,
  status ENUM('HELD', 'RELEASED', 'REFUNDED') DEFAULT 'HELD',
  release_date TIMESTAMP,
  refund_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7. **Negotiations**
Négociation de prix

```sql
CREATE TABLE negotiations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  buyer_id UUID NOT NULL REFERENCES users(id),
  seller_id UUID NOT NULL REFERENCES users(id),
  initial_price DECIMAL(15, 2) NOT NULL,
  current_offer DECIMAL(15, 2),
  status ENUM('OPEN', 'ACCEPTED', 'REJECTED', 'EXPIRED') DEFAULT 'OPEN',
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 8. **NegotiationMessages**
Messages dans les négociations

```sql
CREATE TABLE negotiation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  negotiation_id UUID NOT NULL REFERENCES negotiations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  message TEXT NOT NULL,
  proposed_price DECIMAL(15, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 9. **Wallet**
Portefeuille utilisateur

```sql
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id),
  balance DECIMAL(15, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'XAF',
  last_transaction_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 10. **WalletTransactions**
Historique des transactions

```sql
CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id),
  type ENUM('TOPUP', 'WITHDRAW', 'PAYMENT', 'REFUND', 'COMMISSION') NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  description VARCHAR(255),
  provider ENUM('MTN_MOMO', 'ORANGE_MONEY', 'INTERNAL') DEFAULT 'INTERNAL',
  external_transaction_id VARCHAR(255),
  status ENUM('SUCCESS', 'PENDING', 'FAILED') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 11. **Reels**
Vidéos/contenu social

```sql
CREATE TABLE reels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  video_url VARCHAR(500) NOT NULL,
  caption TEXT,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);
```

### 12. **ReelComments**
Commentaires sur les reels

```sql
CREATE TABLE reel_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reel_id UUID NOT NULL REFERENCES reels(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 Indexes

```sql
-- Performance indexes
CREATE INDEX idx_products_seller_id ON products(seller_id);
CREATE INDEX idx_products_shop_id ON products(shop_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_city ON products(city);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_seller_id ON orders(seller_id);
CREATE INDEX idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX idx_negotiations_product_id ON negotiations(product_id);
```

---

**À maintenir à jour par le Chef du projet**
