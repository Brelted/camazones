# API Specification - Camazones Backend

Base URL: `http://localhost:8080/api`

## 🔐 Auth Module (Chef)

### POST /auth/register
Créer un nouvel utilisateur

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+237123456789"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "token": "jwt_token_here"
}
```

### POST /auth/login
Se connecter

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response (200):**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "BUYER|SELLER"
  }
}
```

### GET /auth/me
Récupérer profil utilisateur (protégé)

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "role": "BUYER",
  "createdAt": "2026-05-27T10:00:00Z"
}
```

---

## 📦 Products Module (Dev 1)

### GET /products
Lister tous les produits avec filtrage

**Query Params:**
- `category` - Filtrer par catégorie
- `city` - Filtrer par ville
- `search` - Rechercher par nom
- `page` - Pagination (défaut: 1)
- `limit` - Items par page (défaut: 20)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "iPhone 13",
      "price": 500000,
      "negotiable": true,
      "seller": { "id": "uuid", "name": "John Shop" },
      "image": "url",
      "category": "electronics",
      "city": "Yaoundé"
    }
  ],
  "total": 100,
  "page": 1
}
```

### POST /products (protégé)
Créer un nouveau produit

**Request:**
```json
{
  "title": "iPhone 13",
  "description": "...",
  "price": 500000,
  "negotiable": true,
  "category": "electronics",
  "city": "Yaoundé",
  "images": ["url1", "url2"]
}
```

### GET /products/:id
Détails d'un produit

### PUT /products/:id (protégé)
Modifier un produit

### DELETE /products/:id (protégé)
Supprimer un produit

---

## 🏪 Shops Module (Dev 1)

### POST /shops (protégé)
Créer une boutique

**Request:**
```json
{
  "name": "John Shop",
  "description": "Best electronics",
  "category": "electronics",
  "city": "Yaoundé"
}
```

### GET /shops/:shopId
Voir une boutique

### GET /shops/:shopId/products
Lister produits d'une boutique

---

## 💰 Wallet Module (Dev 2)

### GET /wallet (protégé)
Consulter balance du portefeuille

**Response:**
```json
{
  "balance": 1500000,
  "currency": "XAF",
  "lastUpdated": "2026-05-27T10:00:00Z"
}
```

### POST /wallet/topup (protégé)
Recharger le portefeuille (Mobile Money)

**Request:**
```json
{
  "amount": 100000,
  "provider": "MTN_MOMO|ORANGE_MONEY",
  "phoneNumber": "+237123456789"
}
```

### POST /wallet/withdraw (protégé)
Retirer de l'argent

**Request:**
```json
{
  "amount": 50000,
  "provider": "MTN_MOMO",
  "phoneNumber": "+237123456789"
}
```

### GET /wallet/transactions (protégé)
Historique des transactions

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "TOPUP|WITHDRAW|PAYMENT|REFUND",
      "amount": 100000,
      "status": "SUCCESS|PENDING|FAILED",
      "createdAt": "2026-05-27T10:00:00Z"
    }
  ]
}
```

---

## 🛡️ Escrow Module (Dev 2)

### POST /escrow/hold
Bloquer l'argent pour une commande

**Request:**
```json
{
  "orderId": "uuid",
  "amount": 500000,
  "buyerId": "uuid",
  "sellerId": "uuid"
}
```

### POST /escrow/:escrowId/release
Débloquer l'argent (après validation acheteur)

### POST /escrow/:escrowId/refund
Rembouser l'acheteur (si litige)

---

## 💬 Negotiation Module (Dev 3)

### POST /negotiate/start (protégé)
Commencer négociation sur un produit

**Request:**
```json
{
  "productId": "uuid",
  "proposedPrice": 450000
}
```

**Response:**
```json
{
  "negotiationId": "uuid",
  "status": "OPEN",
  "messages": []
}
```

### GET /negotiate/:negotiationId
Récupérer les messages d'une négociation

### POST /negotiate/:negotiationId/message (protégé)
Envoyer un message de négociation

**Request:**
```json
{
  "message": "Je peux faire 450000 au minimum",
  "proposedPrice": 450000
}
```

### POST /negotiate/:negotiationId/accept (protégé)
Accepter l'offre et procéder au paiement

---

## 🎥 Social Module (Dev 3)

### POST /reels (protégé)
Poster une vidéo reel de produit

**Request:**
```json
{
  "videoUrl": "url",
  "productId": "uuid",
  "caption": "Check out this amazing product!"
}
```

### GET /reels
Lister les reels (feed)

**Query Params:**
- `city` - Filtrer par ville
- `page` - Pagination

### POST /reels/:reelId/like (protégé)
Liker une reel

### POST /reels/:reelId/comment (protégé)
Commenter sur une reel

---

## 🏥 Health Check

### GET /health
Status de l'API

**Response:**
```
Camazones Backend is running ✅
```

---

## 🔒 Authentication

Tous les endpoints `(protégé)` nécessitent un header:

```
Authorization: Bearer <JWT_TOKEN>
```

---

**À completer par chaque Dev selon les tâches spécifiques**
