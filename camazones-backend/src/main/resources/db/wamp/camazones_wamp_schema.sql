CREATE DATABASE IF NOT EXISTS camazones CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE camazones;

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS game_scores;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS commission_transactions;
DROP TABLE IF EXISTS receipts;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS shops;
DROP TABLE IF EXISTS wallet_transactions;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS=1;


CREATE TABLE users (
  id CHAR(8) PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone_number VARCHAR(30) UNIQUE,
  role ENUM('ADMIN','BUYER','SELLER') NOT NULL DEFAULT 'BUYER',
  account_type ENUM('INDEPENDENT','BOUTIQUE_PRO','ADMIN') NOT NULL DEFAULT 'INDEPENDENT',
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
  city VARCHAR(100) DEFAULT 'Douala',
  address VARCHAR(255),
  profile_picture_url VARCHAR(500),
  camazones_balance DECIMAL(15,2) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


CREATE TABLE wallet_transactions (
  id CHAR(8) PRIMARY KEY,
  user_id CHAR(8) NOT NULL,
  type ENUM('RECHARGE','PAYMENT','COMMISSION','REFUND') NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  label VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;


CREATE TABLE shops (
  id CHAR(8) PRIMARY KEY,
  owner_id CHAR(8) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  description TEXT,
  logo_url VARCHAR(500),
  category VARCHAR(100),
  city VARCHAR(100),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  visibility_rank INT NOT NULL DEFAULT 70,
  is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
) ENGINE=InnoDB;


CREATE TABLE categories (
  id CHAR(8) PRIMARY KEY,
  label VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(20) NOT NULL
) ENGINE=InnoDB;


CREATE TABLE products (
  id CHAR(8) PRIMARY KEY,
  seller_id CHAR(8) NOT NULL,
  shop_id CHAR(8),
  category_id CHAR(8) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(15,2) NOT NULL,
  commission_rate DECIMAL(5,4) NOT NULL DEFAULT 0.1000,
  stock_quantity INT NOT NULL DEFAULT 0,
  city VARCHAR(100),
  primary_image_url VARCHAR(500),
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  is_certified BOOLEAN NOT NULL DEFAULT FALSE,
  is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
  status ENUM('ACTIVE','PENDING','SOLD','BLOCKED') NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id),
  FOREIGN KEY (shop_id) REFERENCES shops(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB;


CREATE TABLE product_images (
  id CHAR(8) PRIMARY KEY,
  product_id CHAR(8) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;


CREATE TABLE orders (
  id CHAR(8) PRIMARY KEY,
  buyer_id CHAR(8) NOT NULL,
  seller_id CHAR(8) NOT NULL,
  shop_id CHAR(8),
  product_id CHAR(8) NOT NULL,
  gross_amount DECIMAL(15,2) NOT NULL,
  commission_amount DECIMAL(15,2) NOT NULL,
  seller_amount DECIMAL(15,2) NOT NULL,
  status ENUM('PENDING','PAID','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PAID',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id) REFERENCES users(id),
  FOREIGN KEY (seller_id) REFERENCES users(id),
  FOREIGN KEY (shop_id) REFERENCES shops(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;


CREATE TABLE payments (
  id CHAR(8) PRIMARY KEY,
  order_id CHAR(8) NOT NULL,
  method ENUM('ORANGE_MONEY','MTN_MOMO','CARD','CAMAZONES_WALLET') NOT NULL,
  provider_reference VARCHAR(100) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  sandbox_payload JSON,
  status ENUM('SANDBOX_SUCCESS','SANDBOX_FAILED','REFUNDED') NOT NULL DEFAULT 'SANDBOX_SUCCESS',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id)
) ENGINE=InnoDB;


CREATE TABLE receipts (
  id CHAR(8) PRIMARY KEY,
  payment_id CHAR(8) NOT NULL,
  pdf_url VARCHAR(500),
  digital_signature VARCHAR(80) NOT NULL,
  sent_to_email VARCHAR(255) NOT NULL,
  sent_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (payment_id) REFERENCES payments(id)
) ENGINE=InnoDB;


CREATE TABLE commission_transactions (
  id CHAR(8) PRIMARY KEY,
  order_id CHAR(8) NOT NULL,
  seller_id CHAR(8) NOT NULL,
  shop_id CHAR(8),
  product_id CHAR(8) NOT NULL,
  gross_amount DECIMAL(15,2) NOT NULL,
  commission_rate DECIMAL(5,4) NOT NULL DEFAULT 0.1000,
  commission_amount DECIMAL(15,2) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (seller_id) REFERENCES users(id),
  FOREIGN KEY (shop_id) REFERENCES shops(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;


CREATE TABLE messages (
  id CHAR(8) PRIMARY KEY,
  conversation_id CHAR(8) NOT NULL,
  buyer_id CHAR(8) NOT NULL,
  seller_id CHAR(8) NOT NULL,
  product_id CHAR(8),
  sender_id CHAR(8) NOT NULL,
  body TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id) REFERENCES users(id),
  FOREIGN KEY (seller_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (sender_id) REFERENCES users(id)
) ENGINE=InnoDB;


CREATE TABLE game_scores (
  id CHAR(8) PRIMARY KEY,
  user_id CHAR(8) NOT NULL,
  game_key VARCHAR(40) NOT NULL,
  score INT NOT NULL DEFAULT 0,
  coins INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE INDEX idx_products_search ON products(category_id, title, status, is_premium);
CREATE INDEX idx_commissions_week ON commission_transactions(created_at, seller_id);

INSERT INTO users (id, first_name, last_name, email, password_hash, phone_number, role, account_type, is_verified, city, camazones_balance) VALUES
('ADM00001','Admin','Camazones','admin@camazones.demo','$2b$10$3TfCjDyvHs3zb0y6BdahdumQL3ziv6V/idYGV2kWnC3azOdLIhf4C','+237600000000','ADMIN','ADMIN',1,'Douala',250000.00),
('ALAN0001','Alan','Independant','alan.independant@camazones.demo','$2b$10$3TfCjDyvHs3zb0y6BdahdumQL3ziv6V/idYGV2kWnC3azOdLIhf4C','+237600000301','SELLER','INDEPENDENT',1,'Douala',85000.00),
('CLNT0001','Client','Demo','client@camazones.demo','$2b$10$3TfCjDyvHs3zb0y6BdahdumQL3ziv6V/idYGV2kWnC3azOdLIhf4C','+237600000001','BUYER','INDEPENDENT',0,'Douala',25000.00),
('KOA00001','Atelier','Koa','atelier.koa@camazones.demo','$2b$10$3TfCjDyvHs3zb0y6BdahdumQL3ziv6V/idYGV2kWnC3azOdLIhf4C','+237600000103','SELLER','BOUTIQUE_PRO',1,'Douala',120000.00),
('TALIA001','Talia','Closet','talia.closet@camazones.demo','$2b$10$3TfCjDyvHs3zb0y6BdahdumQL3ziv6V/idYGV2kWnC3azOdLIhf4C','+237600000104','SELLER','BOUTIQUE_PRO',1,'Douala',45000.00),
('NOMA0001','Studio','Noma','studio.noma@camazones.demo','$2b$10$3TfCjDyvHs3zb0y6BdahdumQL3ziv6V/idYGV2kWnC3azOdLIhf4C','+237600000105','SELLER','BOUTIQUE_PRO',0,'Douala',120000.00),
('SONY0001','Sony','Store','sony@camazones.demo','$2b$10$3TfCjDyvHs3zb0y6BdahdumQL3ziv6V/idYGV2kWnC3azOdLIhf4C','+237600000106','SELLER','BOUTIQUE_PRO',1,'Douala',120000.00),
('SAWA0001','Sawa','Deals','sawa.deals@camazones.demo','$2b$10$3TfCjDyvHs3zb0y6BdahdumQL3ziv6V/idYGV2kWnC3azOdLIhf4C','+237600000107','SELLER','BOUTIQUE_PRO',0,'Douala',45000.00),
('BIJOUX01','Bijoux','Mboa','bijoux.mboa@camazones.demo','$2b$10$3TfCjDyvHs3zb0y6BdahdumQL3ziv6V/idYGV2kWnC3azOdLIhf4C','+237600000108','SELLER','BOUTIQUE_PRO',1,'Douala',120000.00),
('OUD00001','Maison','Oud','maison.oud@camazones.demo','$2b$10$3TfCjDyvHs3zb0y6BdahdumQL3ziv6V/idYGV2kWnC3azOdLIhf4C','+237600000109','SELLER','BOUTIQUE_PRO',1,'Douala',120000.00),
('SIKA0001','Cuisine','Sika','cuisine.sika@camazones.demo','$2b$10$3TfCjDyvHs3zb0y6BdahdumQL3ziv6V/idYGV2kWnC3azOdLIhf4C','+237600000110','SELLER','BOUTIQUE_PRO',0,'Douala',45000.00),
('VISION01','Vision','Home','vision.home@camazones.demo','$2b$10$3TfCjDyvHs3zb0y6BdahdumQL3ziv6V/idYGV2kWnC3azOdLIhf4C','+237600000111','SELLER','BOUTIQUE_PRO',1,'Douala',120000.00),
('KIDS0001','Mboa','Kids','mboa.kids@camazones.demo','$2b$10$3TfCjDyvHs3zb0y6BdahdumQL3ziv6V/idYGV2kWnC3azOdLIhf4C','+237600000112','SELLER','BOUTIQUE_PRO',0,'Douala',45000.00),
('MILA0001','Mila','Select','mila@camazones.demo','$2b$10$3TfCjDyvHs3zb0y6BdahdumQL3ziv6V/idYGV2kWnC3azOdLIhf4C','+237600000201','SELLER','INDEPENDENT',0,'Douala',32000.00),
('BOUT0001','Boutique','Demo','boutique@camazones.demo','$2b$10$3TfCjDyvHs3zb0y6BdahdumQL3ziv6V/idYGV2kWnC3azOdLIhf4C','+237600000002','SELLER','BOUTIQUE_PRO',0,'Douala',45000.00),
('PREM0001','Premium','Demo','premium@camazones.demo','$2b$10$3TfCjDyvHs3zb0y6BdahdumQL3ziv6V/idYGV2kWnC3azOdLIhf4C','+237600000003','SELLER','INDEPENDENT',1,'Douala',120000.00);

INSERT INTO categories (id, label, icon) VALUES
('C0000001','Accessoires','?'),
('C0000002','Vetements','?'),
('C0000003','Chaussures','?'),
('C0000004','Bijoux','?'),
('C0000005','Parfums','?'),
('C0000006','Telephones','?'),
('C0000007','Ordinateurs','?'),
('C0000008','Audio','?'),
('C0000009','Montres connectees','?'),
('C0000010','Bureau','?'),
('C0000011','Cameras','?'),
('C0000012','Gadgets','?'),
('C0000013','Televisions','?'),
('C0000014','Gaming','?'),
('C0000015','Electromenager','?'),
('C0000016','Soins','?'),
('C0000017','Ustensiles','?'),
('C0000018','Vaisselle','?'),
('C0000019','Image','?'),
('C0000020','Securite','?'),
('C0000021','Jouets','?');

INSERT INTO shops (id, owner_id, name, email, description, logo_url, category, city, is_verified, is_premium, visibility_rank) VALUES
('SHKOA001','KOA00001','Atelier Koa','atelier.koa@camazones.demo','Pieces sobres, accessoires durables et finitions elegantes pour une vitrine haut de gamme.','assets/shops/logos/atelier-koa.png','Mode premium','Douala',1,1,96),
('SHTAL001','TALIA001','Talia Closet','talia.closet@camazones.demo','Robes, chemises, sacs et bijoux modernes pour achats rapides.','assets/shops/logos/talia-closet.png','Vetements tendance','Yaounde',1,0,93),
('SHNOM001','NOMA0001','Studio Noma','studio.noma@camazones.demo','Telephones, laptops et accessoires tech fiables avec service rapide.','assets/shops/logos/studio-noma.png','Tech et mobilite','Bafoussam',0,1,90),
('SHSON001','SONY0001','Sony Store','sony.store@camazones.demo','Telephones, TV, cameras et audio Sony avec garantie boutique.','assets/shops/logos/sony-store.png','Sony mobile audio TV','Douala',1,1,87),
('SHSAW001','SAWA0001','Sawa Deals','sawa.deals@camazones.demo','Selection mixte avec prix visibles, gadgets, mode et accessoires.','assets/shops/logos/sawa-deals.png','Prix doux et mixte','Limbe',0,0,84),
('SHBIJ001','BIJOUX01','Bijoux Mboa','bijoux.mboa@camazones.demo','Bagues, colliers, bracelets et montres pour cadeaux elegants.','assets/shops/logos/bijoux-mboa.png','Bijoux et montres','Douala',1,1,81),
('SHOUD001','OUD00001','Maison Oud','maison.oud@camazones.demo','Parfums doux, huiles et coffrets pour une signature elegante.','assets/shops/logos/maison-oud.png','Parfums et soins','Yaounde',1,1,78),
('SHSIK001','SIKA0001','Cuisine Sika','cuisine.sika@camazones.demo','Ustensiles solides, marmites, mixeurs et accessoires maison.','assets/shops/logos/cuisine-sika.png','Ustensiles cuisine','Bafoussam',0,0,75),
('SHVIS001','VISION01','Vision Home','vision.home@camazones.demo','Televisions, son, appareils maison et livraison securisee.','assets/shops/logos/vision-home.png','TV et maison','Douala',1,1,72),
('SHKID001','KIDS0001','Mboa Kids','mboa.kids@camazones.demo','Vetements enfants, sacs, petits accessoires et articles utiles.','assets/shops/logos/mboa-kids.png','Famille et enfants','Garoua',0,0,69);

INSERT INTO products (id, seller_id, shop_id, category_id, title, description, price, commission_rate, stock_quantity, city, primary_image_url, is_premium, is_certified, status) VALUES
('P0000001','KOA00001','SHKOA001','C0000001','Sac Kaya cuir','Sac cuir structure, fermeture solide et finition doree discrete.',35000.00,0.1000,20,'Douala',NULL,1,1,'ACTIVE'),
('P0000002','KOA00001','SHKOA001','C0000002','Robe Lina beige','Robe fluide beige, coupe elegante et tissu doux.',30000.00,0.1000,4,'Douala',NULL,1,1,'ACTIVE'),
('P0000003','KOA00001','SHKOA001','C0000003','Sneaker Rouge','Sneaker rouge sportive, semelle confortable et look urbain.',32000.00,0.1000,9,'Douala',NULL,1,1,'ACTIVE'),
('P0000004','KOA00001','SHKOA001','C0000001','Lunettes Sol','Lunettes solaires noires, monture fine et protection UV.',12500.00,0.1000,12,'Douala',NULL,1,1,'ACTIVE'),
('P0000005','KOA00001','SHKOA001','C0000004','Montre Line acier','Montre acier minimaliste avec cadran clair.',28000.00,0.1000,6,'Douala',NULL,1,1,'ACTIVE'),
('P0000006','KOA00001','SHKOA001','C0000002','Chemise Lin creme','Chemise respirante, coupe droite et teinte naturelle.',18000.00,0.1000,10,'Douala',NULL,1,1,'ACTIVE'),
('P0000007','KOA00001','SHKOA001','C0000002','Veste City noire','Veste noire elegante, coupe urbaine et finition premium.',30000.00,0.1000,20,'Douala',NULL,1,1,'ACTIVE'),
('P0000008','KOA00001','SHKOA001','C0000005','Parfum Bois doux','Parfum boise doux, flacon sobre et tenue longue.',25000.00,0.1000,5,'Douala',NULL,1,1,'ACTIVE'),
('P0000009','KOA00001','SHKOA001','C0000001','Ceinture Tressee','Ceinture tressee solide avec boucle metal sobre.',10000.00,0.1000,14,'Douala',NULL,1,1,'ACTIVE'),
('P0000010','KOA00001','SHKOA001','C0000003','Sandales Nuit','Sandales noires confortables avec finition chic.',12000.00,0.1000,8,'Douala',NULL,1,1,'ACTIVE'),
('P0000011','TALIA001','SHTAL001','C0000001','Mini Bag cyan','Petit sac cyan, format ville et bandouliere solide.',18000.00,0.1000,7,'Yaounde',NULL,0,1,'ACTIVE'),
('P0000012','TALIA001','SHTAL001','C0000002','Robe Sand','Robe sable elegante, ideale sortie et bureau.',28000.00,0.1000,20,'Yaounde',NULL,0,1,'ACTIVE'),
('P0000013','TALIA001','SHTAL001','C0000002','T-shirt Basic','T-shirt coton blanc, coupe simple et propre.',7000.00,0.1000,18,'Yaounde',NULL,0,1,'ACTIVE'),
('P0000014','TALIA001','SHTAL001','C0000003','Red Runner','Basket rouge confortable pour style casual.',30000.00,0.1000,10,'Yaounde',NULL,0,1,'ACTIVE'),
('P0000015','TALIA001','SHTAL001','C0000004','Bracelet Or fin','Bracelet fin couleur or, fermoir discret.',12000.00,0.1000,8,'Yaounde',NULL,0,1,'ACTIVE'),
('P0000016','TALIA001','SHTAL001','C0000004','Clean Watch','Montre fine avec bracelet cuir et cadran lisible.',22000.00,0.1000,6,'Yaounde',NULL,0,1,'ACTIVE'),
('P0000017','TALIA001','SHTAL001','C0000002','City Jacket','Veste urbaine legere pour soiree et travail.',28000.00,0.1000,20,'Yaounde',NULL,0,1,'ACTIVE'),
('P0000018','TALIA001','SHTAL001','C0000005','Soft Perfume','Parfum feminin doux avec note florale propre.',22000.00,0.1000,3,'Yaounde',NULL,0,1,'ACTIVE'),
('P0000019','TALIA001','SHTAL001','C0000002','Jupe Crepe','Jupe crepe elegante, coupe fluide et couleur douce.',15000.00,0.1000,11,'Yaounde',NULL,0,1,'ACTIVE'),
('P0000020','TALIA001','SHTAL001','C0000001','Foulard Satin','Foulard satin leger pour finir une tenue propre.',7500.00,0.1000,20,'Yaounde',NULL,0,1,'ACTIVE'),
('P0000021','NOMA0001','SHNOM001','C0000006','Smartphone Clear X','Telephone 128 Go, ecran net et batterie longue duree.',120000.00,0.1000,12,'Bafoussam',NULL,1,0,'ACTIVE'),
('P0000022','NOMA0001','SHNOM001','C0000007','Laptop Desk 14','Laptop 14 pouces, SSD rapide et clavier confortable.',299000.00,0.1000,20,'Bafoussam',NULL,1,0,'ACTIVE'),
('P0000023','NOMA0001','SHNOM001','C0000008','Casque Noma Pro','Casque bluetooth noir, son clair et coussinets doux.',30000.00,0.1000,8,'Bafoussam',NULL,1,0,'ACTIVE'),
('P0000024','NOMA0001','SHNOM001','C0000009','Watch Pro','Montre connectee sport avec suivi quotidien.',45000.00,0.1000,5,'Bafoussam',NULL,1,0,'ACTIVE'),
('P0000025','NOMA0001','SHNOM001','C0000008','Speaker Mini','Enceinte bluetooth compacte, basse nette et autonomie fiable.',18000.00,0.1000,9,'Bafoussam',NULL,1,0,'ACTIVE'),
('P0000026','NOMA0001','SHNOM001','C0000010','Clavier Slate','Clavier silencieux, format bureau et touches stables.',18000.00,0.1000,4,'Bafoussam',NULL,1,0,'ACTIVE'),
('P0000027','NOMA0001','SHNOM001','C0000011','Camera Compact','Camera compacte pour photos produits et contenu boutique.',150000.00,0.1000,20,'Bafoussam',NULL,1,0,'ACTIVE'),
('P0000028','NOMA0001','SHNOM001','C0000008','Earbuds Fast','Ecouteurs sans fil avec boitier compact et connexion rapide.',18000.00,0.1000,20,'Bafoussam',NULL,1,0,'ACTIVE'),
('P0000029','NOMA0001','SHNOM001','C0000012','Power Bank 30K','Batterie externe 30000 mAh avec charge rapide.',22000.00,0.1000,9,'Bafoussam',NULL,1,0,'ACTIVE'),
('P0000030','NOMA0001','SHNOM001','C0000012','Router Wifi Pro','Routeur wifi stable pour maison et petite boutique.',35000.00,0.1000,6,'Bafoussam',NULL,1,0,'ACTIVE'),
('P0000031','SONY0001','SHSON001','C0000006','Sony Xperia Slim','Smartphone Sony premium, ecran OLED et charge rapide.',390000.00,0.1000,5,'Douala',NULL,1,1,'ACTIVE'),
('P0000032','SONY0001','SHSON001','C0000013','Sony TV Bravia 55','Televiseur 55 pouces 4K, image nette et son immersif.',570000.00,0.1000,3,'Douala',NULL,1,1,'ACTIVE'),
('P0000033','SONY0001','SHSON001','C0000008','Casque Sony WH','Casque reduction de bruit, son propre et autonomie longue.',169000.00,0.1000,8,'Douala',NULL,1,1,'ACTIVE'),
('P0000034','SONY0001','SHSON001','C0000011','Camera Sony Alpha','Camera Alpha pour createur, image nette et kit complet.',520000.00,0.1000,3,'Douala',NULL,1,1,'ACTIVE'),
('P0000035','SONY0001','SHSON001','C0000009','Sony Watch Pro','Montre connectee Sony, bracelet clair et suivi quotidien.',95000.00,0.1000,6,'Douala',NULL,1,1,'ACTIVE'),
('P0000036','SONY0001','SHSON001','C0000008','Speaker Sony Go','Enceinte Sony compacte, basse claire et bluetooth stable.',42000.00,0.1000,12,'Douala',NULL,1,1,'ACTIVE'),
('P0000037','SONY0001','SHSON001','C0000008','Sony Earbuds Sense','Ecouteurs Sony compacts, boitier propre et autonomie fiable.',40000.00,0.1000,10,'Douala',NULL,1,1,'ACTIVE'),
('P0000038','SONY0001','SHSON001','C0000008','Sony Soundbar Cinema','Barre de son salon, rendu cinema et design sobre.',170000.00,0.1000,4,'Douala',NULL,1,1,'ACTIVE'),
('P0000039','SONY0001','SHSON001','C0000014','PlayStation 5 Slim','Console PlayStation 5 Slim neuve avec garantie Sony.',425000.00,0.1000,3,'Douala',NULL,1,1,'ACTIVE'),
('P0000040','SONY0001','SHSON001','C0000014','Manette DualSense','Manette DualSense originale, retour haptique et finition propre.',55000.00,0.1000,8,'Douala',NULL,1,1,'ACTIVE'),
('P0000041','SAWA0001','SHSAW001','C0000002','Basic Tee coton','T-shirt coton propre pour usage quotidien.',5000.00,0.1000,20,'Limbe',NULL,0,0,'ACTIVE'),
('P0000042','SAWA0001','SHSAW001','C0000001','Mini Bag orange','Sac tendance couleur chaude avec fermeture solide.',15000.00,0.1000,10,'Limbe',NULL,0,0,'ACTIVE'),
('P0000043','SAWA0001','SHSAW001','C0000008','Airbuds Lite','Ecouteurs sans fil simples et boitier compact.',12000.00,0.1000,20,'Limbe',NULL,0,0,'ACTIVE'),
('P0000044','SAWA0001','SHSAW001','C0000006','Phone Plus 64','Telephone 64 Go, double SIM et batterie correcte.',75000.00,0.1000,12,'Limbe',NULL,0,0,'ACTIVE'),
('P0000045','SAWA0001','SHSAW001','C0000008','Speaker Go','Mini enceinte bluetooth pour maison et boutique.',15000.00,0.1000,15,'Limbe',NULL,0,0,'ACTIVE'),
('P0000046','SAWA0001','SHSAW001','C0000005','Perfume Clear','Parfum frais, flacon clair et senteur propre.',18000.00,0.1000,9,'Limbe',NULL,0,0,'ACTIVE'),
('P0000047','SAWA0001','SHSAW001','C0000003','Red Sneaker','Sneaker rouge visible, semelle souple et style street.',28000.00,0.1000,20,'Limbe',NULL,0,0,'ACTIVE'),
('P0000048','SAWA0001','SHSAW001','C0000007','Laptop Air 13','Laptop leger 13 pouces pour etudes et bureau.',260000.00,0.1000,6,'Limbe',NULL,0,0,'ACTIVE'),
('P0000049','SAWA0001','SHSAW001','C0000003','Sandale Beach','Sandale legere pour plage et marche quotidienne.',10000.00,0.1000,18,'Limbe',NULL,0,0,'ACTIVE'),
('P0000050','SAWA0001','SHSAW001','C0000015','Blender Compact','Blender compact pour jus frais et cuisine rapide.',18000.00,0.1000,7,'Limbe',NULL,0,0,'ACTIVE'),
('P0000051','BIJOUX01','SHBIJ001','C0000004','Collier Or Mboa','Collier couleur or, maillons fins et boite cadeau.',45000.00,0.1000,6,'Douala',NULL,1,1,'ACTIVE'),
('P0000052','BIJOUX01','SHBIJ001','C0000004','Bague Saphir','Bague elegante avec pierre bleue et finition brillante.',35000.00,0.1000,4,'Douala',NULL,1,1,'ACTIVE'),
('P0000053','BIJOUX01','SHBIJ001','C0000004','Bracelet Cuir','Bracelet cuir marron avec boucle metal.',12000.00,0.1000,20,'Douala',NULL,1,1,'ACTIVE'),
('P0000054','BIJOUX01','SHBIJ001','C0000004','Boucles Pearl','Boucles perle discretes pour tenue chic.',15000.00,0.1000,8,'Douala',NULL,1,1,'ACTIVE'),
('P0000055','BIJOUX01','SHBIJ001','C0000004','Montre Classic','Montre classique, cadran noir et bracelet acier.',40000.00,0.1000,5,'Douala',NULL,1,1,'ACTIVE'),
('P0000056','BIJOUX01','SHBIJ001','C0000004','Chaine Argent','Chaine argent brillante, longueur moyenne.',25000.00,0.1000,7,'Douala',NULL,1,1,'ACTIVE'),
('P0000057','BIJOUX01','SHBIJ001','C0000004','Parure Douce','Parure collier et boucles pour ceremonie.',60000.00,0.1000,3,'Douala',NULL,1,1,'ACTIVE'),
('P0000058','BIJOUX01','SHBIJ001','C0000004','Bague Mariage','Bague premium avec finition lisse et coffret.',85000.00,0.1000,2,'Douala',NULL,1,1,'ACTIVE'),
('P0000059','BIJOUX01','SHBIJ001','C0000004','Broche Emeraude','Broche elegante couleur emeraude pour veste et robe.',18000.00,0.1000,5,'Douala',NULL,1,1,'ACTIVE'),
('P0000060','BIJOUX01','SHBIJ001','C0000004','Coffret Bijoux','Coffret de rangement bijoux, doux et compact.',12000.00,0.1000,20,'Douala',NULL,1,1,'ACTIVE'),
('P0000061','OUD00001','SHOUD001','C0000005','Oud Royal','Parfum oud profond, flacon lourd et tenue longue.',65000.00,0.1000,5,'Yaounde',NULL,1,1,'ACTIVE'),
('P0000062','OUD00001','SHOUD001','C0000005','Vanille Ambree','Parfum vanille ambree, doux et chaleureux.',30000.00,0.1000,20,'Yaounde',NULL,1,1,'ACTIVE'),
('P0000063','OUD00001','SHOUD001','C0000005','Musc Blanc','Musc propre, discret et ideal au quotidien.',25000.00,0.1000,10,'Yaounde',NULL,1,1,'ACTIVE'),
('P0000064','OUD00001','SHOUD001','C0000005','Coffret Luxe','Coffret premium avec trois senteurs et boite cadeau.',85000.00,0.1000,3,'Yaounde',NULL,1,1,'ACTIVE'),
('P0000065','OUD00001','SHOUD001','C0000016','Huile Corps','Huile parfumee pour peau douce et brillante.',15000.00,0.1000,12,'Yaounde',NULL,1,1,'ACTIVE'),
('P0000066','OUD00001','SHOUD001','C0000005','Brume Florale','Brume legere florale pour usage quotidien.',15000.00,0.1000,8,'Yaounde',NULL,1,1,'ACTIVE'),
('P0000067','OUD00001','SHOUD001','C0000016','Creme Main','Creme mains hydratante, parfum doux.',6500.00,0.1000,20,'Yaounde',NULL,1,1,'ACTIVE'),
('P0000068','OUD00001','SHOUD001','C0000016','Savon Noir','Savon noir naturel pour routine soin.',4500.00,0.1000,20,'Yaounde',NULL,1,1,'ACTIVE'),
('P0000069','OUD00001','SHOUD001','C0000005','Encens Ambre','Encens ambre doux pour maison et boutique.',6000.00,0.1000,15,'Yaounde',NULL,1,1,'ACTIVE'),
('P0000070','OUD00001','SHOUD001','C0000005','Diffuseur Oud','Diffuseur oud discret avec batonnets et flacon sobre.',18000.00,0.1000,8,'Yaounde',NULL,1,1,'ACTIVE'),
('P0000071','SIKA0001','SHSIK001','C0000017','Marmite Alu 12L','Marmite aluminium 12 litres, couvercle solide.',25000.00,0.1000,12,'Bafoussam',NULL,0,0,'ACTIVE'),
('P0000072','SIKA0001','SHSIK001','C0000017','Poele Granit','Poele antiadhesive effet granit, manche robuste.',15000.00,0.1000,20,'Bafoussam',NULL,0,0,'ACTIVE'),
('P0000073','SIKA0001','SHSIK001','C0000017','Set Couteaux','Set de couteaux cuisine avec support compact.',18000.00,0.1000,8,'Bafoussam',NULL,0,0,'ACTIVE'),
('P0000074','SIKA0001','SHSIK001','C0000015','Mixeur Plus','Mixeur electrique pour jus, sauces et cuisine maison.',23500.00,0.1000,6,'Bafoussam',NULL,0,0,'ACTIVE'),
('P0000075','SIKA0001','SHSIK001','C0000018','Assiettes Ceram','Set assiettes ceramique beige, finition propre.',16000.00,0.1000,10,'Bafoussam',NULL,0,0,'ACTIVE'),
('P0000076','SIKA0001','SHSIK001','C0000018','Verres Clean','Set de verres transparents pour table familiale.',9000.00,0.1000,15,'Bafoussam',NULL,0,0,'ACTIVE'),
('P0000077','SIKA0001','SHSIK001','C0000015','Bouilloire Inox','Bouilloire inox rapide avec poignee isolee.',18000.00,0.1000,7,'Bafoussam',NULL,0,0,'ACTIVE'),
('P0000078','SIKA0001','SHSIK001','C0000017','Range Epices','Petit rangement epices, pratique pour plan de travail.',6500.00,0.1000,20,'Bafoussam',NULL,0,0,'ACTIVE'),
('P0000079','SIKA0001','SHSIK001','C0000017','Planche Bambou','Planche bambou solide pour decoupe propre.',5000.00,0.1000,20,'Bafoussam',NULL,0,0,'ACTIVE'),
('P0000080','SIKA0001','SHSIK001','C0000017','Thermos 1L','Thermos 1 litre garde chaud et froid pendant la journee.',8500.00,0.1000,16,'Bafoussam',NULL,0,0,'ACTIVE'),
('P0000081','VISION01','SHVIS001','C0000013','TV Vision 43 4K','Television 43 pouces 4K, image claire et cadre fin.',180000.00,0.1000,6,'Douala',NULL,1,1,'ACTIVE'),
('P0000082','VISION01','SHVIS001','C0000013','TV Vision 65 OLED','Grand televiseur 65 pouces OLED pour salon premium.',790000.00,0.1000,2,'Douala',NULL,1,1,'ACTIVE'),
('P0000083','VISION01','SHVIS001','C0000019','Projecteur Mini','Projecteur compact pour films, cours et presentations.',120000.00,0.1000,4,'Douala',NULL,1,1,'ACTIVE'),
('P0000084','VISION01','SHVIS001','C0000008','Soundbar Home','Barre de son salon avec basse profonde.',145000.00,0.1000,5,'Douala',NULL,1,1,'ACTIVE'),
('P0000085','VISION01','SHVIS001','C0000001','Support TV mural','Support mural solide pour television 32 a 65 pouces.',15000.00,0.1000,20,'Douala',NULL,1,1,'ACTIVE'),
('P0000086','VISION01','SHVIS001','C0000015','Climatiseur 12K','Climatiseur 12000 BTU, froid rapide et faible bruit.',280000.00,0.1000,3,'Douala',NULL,1,1,'ACTIVE'),
('P0000087','VISION01','SHVIS001','C0000015','Ventilateur Pro','Ventilateur puissant avec pied reglable.',30000.00,0.1000,8,'Douala',NULL,1,1,'ACTIVE'),
('P0000088','VISION01','SHVIS001','C0000001','Regulateur Tension','Regulateur pour proteger TV et appareils sensibles.',25000.00,0.1000,10,'Douala',NULL,1,1,'ACTIVE'),
('P0000089','VISION01','SHVIS001','C0000015','Frigo Compact','Frigo compact pour studio, chambre et petite boutique.',180000.00,0.1000,4,'Douala',NULL,1,1,'ACTIVE'),
('P0000090','VISION01','SHVIS001','C0000020','Camera Interieur','Camera interieur connectee pour surveillance maison.',45000.00,0.1000,8,'Douala',NULL,1,1,'ACTIVE'),
('P0000091','KIDS0001','SHKID001','C0000002','Robe Fille Rose','Robe enfant rose, tissu doux et coupe confortable.',10000.00,0.1000,12,'Garoua',NULL,0,0,'ACTIVE'),
('P0000092','KIDS0001','SHKID001','C0000003','Basket School','Basket enfant resistante pour ecole et sortie.',15000.00,0.1000,10,'Garoua',NULL,0,0,'ACTIVE'),
('P0000093','KIDS0001','SHKID001','C0000001','Sac Ecole Bleu','Sac ecole bleu avec compartiments solides.',9000.00,0.1000,20,'Garoua',NULL,0,0,'ACTIVE'),
('P0000094','KIDS0001','SHKID001','C0000017','Gourde Inox','Gourde inox enfant, bouchon securise.',5000.00,0.1000,20,'Garoua',NULL,0,0,'ACTIVE'),
('P0000095','KIDS0001','SHKID001','C0000002','Pyjama Coton','Pyjama coton doux pour nuit confortable.',8000.00,0.1000,15,'Garoua',NULL,0,0,'ACTIVE'),
('P0000096','KIDS0001','SHKID001','C0000008','Casque Mini','Casque enfant volume limite et mousse douce.',12000.00,0.1000,8,'Garoua',NULL,0,0,'ACTIVE'),
('P0000097','KIDS0001','SHKID001','C0000001','Montre Fun Kids','Montre enfant coloree et facile a lire.',7000.00,0.1000,10,'Garoua',NULL,0,0,'ACTIVE'),
('P0000098','KIDS0001','SHKID001','C0000005','Parfum Doux Kids','Petite eau parfumee douce pour enfant.',8000.00,0.1000,6,'Garoua',NULL,0,0,'ACTIVE'),
('P0000099','KIDS0001','SHKID001','C0000021','Jeu Construction','Jeu de construction enfant, pieces colorees et solides.',15000.00,0.1000,10,'Garoua',NULL,0,0,'ACTIVE'),
('P0000100','KIDS0001','SHKID001','C0000012','Tablette Edu','Tablette educative enfant avec coque renforcee.',45000.00,0.1000,5,'Garoua',NULL,0,0,'ACTIVE');

INSERT INTO product_images (id, product_id, image_url, display_order) VALUES
('I0000001','P0000001','assets/products/camazone-catalog/koa-sac-kaya-sac-kaya-cuir.jpg',0),
('I0000002','P0000002','assets/products/camazone-catalog/koa-robe-lina-robe-lina-beige.jpg',0),
('I0000003','P0000003','assets/products/camazone-catalog/koa-sneaker-rouge-sneaker-rouge.jpg',0),
('I0000004','P0000004','assets/products/camazone-catalog/koa-lunettes-sol-lunettes-sol.jpg',0),
('I0000005','P0000005','assets/products/camazone-catalog/koa-montre-line-montre-line-acier.jpg',0),
('I0000006','P0000006','assets/products/camazone-catalog/koa-chemise-lin-chemise-lin-creme.jpg',0),
('I0000007','P0000007','assets/products/camazone-catalog/koa-veste-city-veste-city-noire.jpg',0),
('I0000008','P0000008','assets/products/camazone-catalog/koa-parfum-bois-parfum-bois-doux.jpg',0),
('I0000009','P0000009','assets/products/camazone-catalog/koa-ceinture-tresse-ceinture-tressee.jpg',0),
('I0000010','P0000010','assets/products/camazone-catalog/koa-sandales-nuit-sandales-nuit.jpg',0),
('I0000011','P0000011','assets/products/camazone-catalog/talia-mini-bag-mini-bag-cyan.jpg',0),
('I0000012','P0000012','assets/products/camazone-catalog/talia-robe-sand-robe-sand.jpg',0),
('I0000013','P0000013','assets/products/camazone-catalog/talia-basic-tee-t-shirt-basic.jpg',0),
('I0000014','P0000014','assets/products/camazone-catalog/talia-red-runner-red-runner.jpg',0),
('I0000015','P0000015','assets/products/camazone-catalog/talia-bracelet-or-bracelet-or-fin.jpg',0),
('I0000016','P0000016','assets/products/camazone-catalog/talia-watch-clean-clean-watch.jpg',0),
('I0000017','P0000017','assets/products/camazone-catalog/talia-jacket-city-city-jacket.jpg',0),
('I0000018','P0000018','assets/products/camazone-catalog/talia-perfume-soft-soft-perfume.jpg',0),
('I0000019','P0000019','assets/products/camazone-catalog/talia-jupe-crepe-jupe-crepe.jpg',0),
('I0000020','P0000020','assets/products/camazone-catalog/talia-foulard-satin-foulard-satin.jpg',0),
('I0000021','P0000021','assets/products/camazone-catalog/noma-smartphone-clear-smartphone-clear-x.jpg',0),
('I0000022','P0000022','assets/products/camazone-catalog/noma-laptop-desk-laptop-desk-14.jpg',0),
('I0000023','P0000023','assets/products/camazone-catalog/noma-casque-pro-casque-noma-pro.jpg',0),
('I0000024','P0000024','assets/products/camazone-catalog/noma-watch-pro-watch-pro.jpg',0),
('I0000025','P0000025','assets/products/camazone-catalog/noma-speaker-mini-speaker-mini.jpg',0),
('I0000026','P0000026','assets/products/camazone-catalog/noma-clavier-slate-clavier-slate.jpg',0),
('I0000027','P0000027','assets/products/camazone-catalog/noma-camera-compact-camera-compact.jpg',0),
('I0000028','P0000028','assets/products/camazone-catalog/noma-earbuds-fast-earbuds-fast.jpg',0),
('I0000029','P0000029','assets/products/camazone-catalog/noma-power-bank-30k-power-bank-30k.jpg',0),
('I0000030','P0000030','assets/products/camazone-catalog/noma-router-wifi-pro-router-wifi-pro.jpg',0),
('I0000031','P0000031','assets/products/camazone-catalog/sony-xperia-slim-sony-xperia-slim.jpg',0),
('I0000032','P0000032','assets/products/camazone-catalog/sony-tv-bravia-55-sony-tv-bravia-55.jpg',0),
('I0000033','P0000033','assets/products/camazone-catalog/sony-wh-headset-casque-sony-wh.jpg',0),
('I0000034','P0000034','assets/products/camazone-catalog/sony-alpha-camera-camera-sony-alpha.jpg',0),
('I0000035','P0000035','assets/products/camazone-catalog/sony-watch-pro-sony-watch-pro.jpg',0),
('I0000036','P0000036','assets/products/camazone-catalog/sony-speaker-go-speaker-sony-go.jpg',0),
('I0000037','P0000037','assets/products/camazone-catalog/sony-earbuds-sense-sony-earbuds-sense.jpg',0),
('I0000038','P0000038','assets/products/camazone-catalog/sony-soundbar-cinema-sony-soundbar-cinema.jpg',0),
('I0000039','P0000039','assets/products/camazone-catalog/sony-ps5-slim-playstation-5-slim.jpg',0),
('I0000040','P0000040','assets/products/camazone-catalog/sony-dualsense-manette-dualsense.jpg',0),
('I0000041','P0000041','assets/products/camazone-catalog/sawa-basic-tee-basic-tee-coton.jpg',0),
('I0000042','P0000042','assets/products/camazone-catalog/sawa-mini-bag-mini-bag-orange.jpg',0),
('I0000043','P0000043','assets/products/camazone-catalog/sawa-airbuds-lite-airbuds-lite.jpg',0),
('I0000044','P0000044','assets/products/camazone-catalog/sawa-phone-plus-phone-plus-64.jpg',0),
('I0000045','P0000045','assets/products/camazone-catalog/sawa-speaker-go-speaker-go.jpg',0),
('I0000046','P0000046','assets/products/camazone-catalog/sawa-perfume-clear-perfume-clear.jpg',0),
('I0000047','P0000047','assets/products/camazone-catalog/sawa-red-sneaker-red-sneaker.jpg',0),
('I0000048','P0000048','assets/products/camazone-catalog/sawa-laptop-air-laptop-air-13.jpg',0),
('I0000049','P0000049','assets/products/camazone-catalog/sawa-sandale-beach-sandale-beach.jpg',0),
('I0000050','P0000050','assets/products/camazone-catalog/sawa-blender-compact-blender-compact.jpg',0),
('I0000051','P0000051','assets/products/camazone-catalog/mboa-collier-or-collier-or-mboa.jpg',0),
('I0000052','P0000052','assets/products/camazone-catalog/mboa-bague-saphir-bague-saphir.jpg',0),
('I0000053','P0000053','assets/products/camazone-catalog/mboa-bracelet-cuir-bracelet-cuir.jpg',0),
('I0000054','P0000054','assets/products/camazone-catalog/mboa-boucles-pearl-boucles-pearl.jpg',0),
('I0000055','P0000055','assets/products/camazone-catalog/mboa-montre-classic-montre-classic.jpg',0),
('I0000056','P0000056','assets/products/camazone-catalog/mboa-chaine-argent-chaine-argent.jpg',0),
('I0000057','P0000057','assets/products/camazone-catalog/mboa-parure-douce-parure-douce.jpg',0),
('I0000058','P0000058','assets/products/camazone-catalog/mboa-bague-mariage-bague-mariage.jpg',0),
('I0000059','P0000059','assets/products/camazone-catalog/mboa-broche-emeraude-broche-emeraude.jpg',0),
('I0000060','P0000060','assets/products/camazone-catalog/mboa-coffret-bijoux-coffret-bijoux.jpg',0),
('I0000061','P0000061','assets/products/camazone-catalog/oud-royal-oud-royal.jpg',0),
('I0000062','P0000062','assets/products/camazone-catalog/oud-vanille-vanille-ambree.jpg',0),
('I0000063','P0000063','assets/products/camazone-catalog/oud-musc-blanc-musc-blanc.jpg',0),
('I0000064','P0000064','assets/products/camazone-catalog/oud-coffret-luxe-coffret-luxe.jpg',0),
('I0000065','P0000065','assets/products/camazone-catalog/oud-huile-corps-huile-corps.jpg',0),
('I0000066','P0000066','assets/products/camazone-catalog/oud-brume-florale-brume-florale.jpg',0),
('I0000067','P0000067','assets/products/camazone-catalog/oud-creme-main-creme-main.jpg',0),
('I0000068','P0000068','assets/products/camazone-catalog/oud-savon-noir-savon-noir.jpg',0),
('I0000069','P0000069','assets/products/camazone-catalog/oud-encens-ambre-encens-ambre.jpg',0),
('I0000070','P0000070','assets/products/camazone-catalog/oud-diffuseur-oud-diffuseur-oud.jpg',0),
('I0000071','P0000071','assets/products/camazone-catalog/sika-marmite-alu-marmite-alu-12l.jpg',0),
('I0000072','P0000072','assets/products/camazone-catalog/sika-poele-granit-poele-granit.jpg',0),
('I0000073','P0000073','assets/products/camazone-catalog/sika-set-couteaux-set-couteaux.jpg',0),
('I0000074','P0000074','assets/products/camazone-catalog/sika-mixeur-plus-mixeur-plus.jpg',0),
('I0000075','P0000075','assets/products/camazone-catalog/sika-assiettes-ceram-assiettes-ceram.jpg',0),
('I0000076','P0000076','assets/products/camazone-catalog/sika-verres-clean-verres-clean.jpg',0),
('I0000077','P0000077','assets/products/camazone-catalog/sika-bouilloire-inoX-bouilloire-inox.jpg',0),
('I0000078','P0000078','assets/products/camazone-catalog/sika-range-epices-range-epices.jpg',0),
('I0000079','P0000079','assets/products/camazone-catalog/sika-planche-bambou-planche-bambou.jpg',0),
('I0000080','P0000080','assets/products/camazone-catalog/sika-thermos-1l-thermos-1l.jpg',0),
('I0000081','P0000081','assets/products/camazone-catalog/vision-tv-43-tv-vision-43-4k.jpg',0),
('I0000082','P0000082','assets/products/camazone-catalog/vision-tv-65-tv-vision-65-oled.jpg',0),
('I0000083','P0000083','assets/products/camazone-catalog/vision-projecteur-mini-projecteur-mini.jpg',0),
('I0000084','P0000084','assets/products/camazone-catalog/vision-soundbar-home-soundbar-home.jpg',0),
('I0000085','P0000085','assets/products/camazone-catalog/vision-support-tv-support-tv-mural.jpg',0),
('I0000086','P0000086','assets/products/camazone-catalog/vision-climatiseur-12k-climatiseur-12k.jpg',0),
('I0000087','P0000087','assets/products/camazone-catalog/vision-ventilateur-pro-ventilateur-pro.jpg',0),
('I0000088','P0000088','assets/products/camazone-catalog/vision-regulateur-regulateur-tension.jpg',0),
('I0000089','P0000089','assets/products/camazone-catalog/vision-frigo-compact-frigo-compact.jpg',0),
('I0000090','P0000090','assets/products/camazone-catalog/vision-camera-interieur-camera-interieur.jpg',0),
('I0000091','P0000091','assets/products/camazone-catalog/kids-robe-fille-robe-fille-rose.jpg',0),
('I0000092','P0000092','assets/products/camazone-catalog/kids-basket-school-basket-school.jpg',0),
('I0000093','P0000093','assets/products/camazone-catalog/kids-sac-ecole-sac-ecole-bleu.jpg',0),
('I0000094','P0000094','assets/products/camazone-catalog/kids-gourde-inox-gourde-inox.jpg',0),
('I0000095','P0000095','assets/products/camazone-catalog/kids-pyjama-coton-pyjama-coton.jpg',0),
('I0000096','P0000096','assets/products/camazone-catalog/kids-casque-mini-casque-mini.jpg',0),
('I0000097','P0000097','assets/products/camazone-catalog/kids-montre-fun-montre-fun-kids.jpg',0),
('I0000098','P0000098','assets/products/camazone-catalog/kids-parfum-doux-parfum-doux-kids.jpg',0),
('I0000099','P0000099','assets/products/camazone-catalog/kids-jeu-construction-jeu-construction.jpg',0),
('I0000100','P0000100','assets/products/camazone-catalog/kids-tablette-edu-tablette-edu.jpg',0);


INSERT INTO orders (id, buyer_id, seller_id, shop_id, product_id, gross_amount, commission_amount, seller_amount, status) VALUES
('ORD00001','ALAN0001','SONY0001','SHSON001','P0000031',350000.00,35000.00,315000.00,'PAID');
INSERT INTO payments (id, order_id, method, provider_reference, amount, sandbox_payload, status) VALUES
('PAY00001','ORD00001','CAMAZONES_WALLET','SANDBOX-CMZ-0001',350000.00,JSON_OBJECT('otp','123456','risk','low','provider','Camazones Pay Sandbox'),'SANDBOX_SUCCESS');
INSERT INTO receipts (id, payment_id, pdf_url, digital_signature, sent_to_email, sent_at) VALUES
('REC00001','PAY00001','receipts/REC00001.pdf','CMZ-SIGN-ALANSONY-001','alan.independant@camazones.demo',NOW());
INSERT INTO commission_transactions (id, order_id, seller_id, shop_id, product_id, gross_amount, commission_rate, commission_amount) VALUES
('COM00001','ORD00001','SONY0001','SHSON001','P0000031',350000.00,0.1000,35000.00);
INSERT INTO wallet_transactions (id, user_id, type, amount, label) VALUES
('WAL00001','ALAN0001','PAYMENT',-350000.00,'Achat Sony Xperia Slim'),
('WAL00002','SONY0001','PAYMENT',315000.00,'Vente Sony Xperia Slim'),
('WAL00003','ADM00001','COMMISSION',35000.00,'Commission 10% Sony Xperia Slim');
INSERT INTO messages (id, conversation_id, buyer_id, seller_id, product_id, sender_id, body, created_at) VALUES
('MSG00001','CNV00001','ALAN0001','SONY0001','P0000031','ALAN0001','Bonjour Sony, je suis Alan. Le Sony Xperia Slim est a 390 000 FCFA, possible de revoir le prix ?',NOW() - INTERVAL 40 MINUTE),
('MSG00002','CNV00001','ALAN0001','SONY0001','P0000031','SONY0001','Bonjour Alan, il est neuf avec garantie boutique. Vous proposez combien ?',NOW() - INTERVAL 35 MINUTE),
('MSG00003','CNV00001','ALAN0001','SONY0001','P0000031','ALAN0001','Je peux payer 350 000 FCFA aujourd hui via Camazones Pay.',NOW() - INTERVAL 25 MINUTE),
('MSG00004','CNV00001','ALAN0001','SONY0001','P0000031','SONY0001','Accorde. Sony accepte 350 000 FCFA si paiement aujourd hui.',NOW() - INTERVAL 18 MINUTE);
INSERT INTO game_scores (id, user_id, game_key, score, coins) VALUES
('GAM00001','ALAN0001','snake',12,8),
('GAM00002','ALAN0001','memory-coins',6,6);

SELECT * FROM users;
SELECT shop_id, COUNT(*) AS total_articles FROM (SELECT shop_id FROM products) p GROUP BY shop_id;
SELECT SUM(commission_amount) AS commissions_semaine FROM commission_transactions WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY);
