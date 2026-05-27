# 📋 Tâches de l'équipe — Camazones

> Document de référence pour chaque développeur.  
> **Dernière mise à jour** : 2026-05-27

---

## 🧑‍💼 Chef du projet — Auth + Architecture

### Backend (`camazones-backend`)
**Branch à créer** : `feature/auth-backend`

| # | Tâche | Priorité |
|---|-------|----------|
| 1 | Créer l'entité `User` (JPA) avec tous les champs du SCHEMA.md | 🔴 Critique |
| 2 | Créer `UserRepository` (Spring Data JPA) | 🔴 Critique |
| 3 | Configurer `SecurityConfig` (Spring Security) | 🔴 Critique |
| 4 | Créer `JwtProvider` (générer/valider les tokens JWT) | 🔴 Critique |
| 5 | Créer `JwtAuthenticationFilter` (intercepteur) | 🔴 Critique |
| 6 | Implémenter `POST /auth/register` | 🔴 Critique |
| 7 | Implémenter `POST /auth/login` | 🔴 Critique |
| 8 | Implémenter `GET /auth/me` (endpoint protégé) | 🟠 Important |
| 9 | Externaliser `jwt.secret` en variable d'environnement | 🔴 Critique |
| 10 | Écrire les tests unitaires pour `JwtProvider` | 🟡 Normal |

### Frontend (`camazones-frontend`)
**Branch à créer** : `feature/auth-frontend`

| # | Tâche | Priorité |
|---|-------|----------|
| 1 | Corriger les packages dans `package.json` (voir section Bugs) | 🔴 Critique |
| 2 | Implémenter `AuthScreen` (formulaires Login + Register) | 🔴 Critique |
| 3 | Connecter `isAuthenticated` au Redux store dans `RootNavigator` | 🔴 Critique |
| 4 | Créer les thunk actions Redux pour `login` et `register` | 🔴 Critique |
| 5 | Implémenter le handler 401 dans `apiClient.js` (logout auto) | 🟠 Important |
| 6 | Persister le token JWT (AsyncStorage) | 🟠 Important |

---

## 👨‍💻 Dev 1 — Products & Shops

### Backend (`camazones-backend`)
**Branch à créer** : `feature/products-backend`

> ⚠️ **Prérequis** : Attendre que le Chef ait mergé l'entité `User` sur `develop`

| # | Tâche | Priorité |
|---|-------|----------|
| 1 | Créer entité `Product` (JPA) + `ProductRepository` | 🔴 Critique |
| 2 | Créer entité `Shop` (JPA) + `ShopRepository` | 🔴 Critique |
| 3 | Créer entité `ProductImage` (JPA) | 🟠 Important |
| 4 | Implémenter `GET /products` avec filtres (category, city, search, pagination) | 🔴 Critique |
| 5 | Implémenter `POST /products` (protégé) | 🔴 Critique |
| 6 | Implémenter `GET /products/:id` | 🔴 Critique |
| 7 | Implémenter `PUT /products/:id` (protégé) | 🟠 Important |
| 8 | Implémenter `DELETE /products/:id` (protégé, soft delete) | 🟠 Important |
| 9 | Implémenter `POST /shops` (protégé) | 🟠 Important |
| 10 | Implémenter `GET /shops/:id` + `GET /shops/:id/products` | 🟠 Important |
| 11 | Ajouter les coordonnées GPS (latitude/longitude) sur `Product` | 🟡 Normal |

### Frontend (`camazones-frontend`)
**Branch à créer** : `feature/products-frontend`

> ⚠️ **Prérequis** : Backend produits disponible (ou utiliser des données mockées)

| # | Tâche | Priorité |
|---|-------|----------|
| 1 | Implémenter `ProductsScreen` (liste avec scroll) | 🔴 Critique |
| 2 | Créer le composant `ProductCard` (image, titre, prix, vendeur) | 🔴 Critique |
| 3 | Créer l'écran `ProductDetailScreen` | 🔴 Critique |
| 4 | Créer le formulaire `PublishProductScreen` | 🟠 Important |
| 5 | Implémenter les filtres de recherche (catégorie, ville) | 🟠 Important |
| 6 | Créer `SellerScreen` (boutique du vendeur) | 🟠 Important |
| 7 | Brancher les actions Redux `productsSlice` sur l'API | 🟠 Important |

---

## 👨‍💻 Dev 2 — Wallet & Paiements

### Backend (`camazones-backend`)
**Branch à créer** : `feature/wallet-backend`

> ⚠️ **Prérequis** : Entité `User` mergée sur `develop`

| # | Tâche | Priorité |
|---|-------|----------|
| 1 | Créer entité `Wallet` (JPA) + `WalletRepository` | 🔴 Critique |
| 2 | Créer entité `WalletTransaction` + `WalletTransactionRepository` | 🔴 Critique |
| 3 | Créer entité `Order` + `Escrow` (JPA) | 🔴 Critique |
| 4 | Implémenter `GET /wallet` (solde) | 🔴 Critique |
| 5 | Implémenter `POST /wallet/topup` (recharge Mobile Money) | 🔴 Critique |
| 6 | Implémenter `POST /wallet/withdraw` | 🟠 Important |
| 7 | Implémenter `GET /wallet/transactions` | 🟠 Important |
| 8 | Implémenter `POST /escrow/hold` | 🔴 Critique |
| 9 | Implémenter `POST /escrow/:id/release` | 🔴 Critique |
| 10 | Implémenter `POST /escrow/:id/refund` | 🟠 Important |
| 11 | Intégration MTN MoMo API (sandbox) | 🟡 Normal |
| 12 | Intégration Orange Money API (sandbox) | 🟡 Normal |

### Frontend (`camazones-frontend`)
**Branch à créer** : `feature/wallet-frontend`

| # | Tâche | Priorité |
|---|-------|----------|
| 1 | Implémenter `WalletScreen` (solde + historique) | 🔴 Critique |
| 2 | Créer l'interface de recharge Mobile Money | 🔴 Critique |
| 3 | Créer l'interface de retrait | 🟠 Important |
| 4 | Afficher l'historique des transactions | 🟠 Important |
| 5 | Brancher `walletSlice` Redux sur l'API | 🟠 Important |

---

## 👨‍💻 Dev 3 — Social (Reels) & Négociation

### Backend (`camazones-backend`)
**Branch à créer** : `feature/social-backend`

> ⚠️ **Prérequis** : Entités `User` + `Product` mergées sur `develop`

| # | Tâche | Priorité |
|---|-------|----------|
| 1 | Créer entité `Reel` (JPA) + `ReelRepository` | 🔴 Critique |
| 2 | Créer entité `ReelComment` | 🟠 Important |
| 3 | Créer entité `Negotiation` + `NegotiationMessage` | 🔴 Critique |
| 4 | Implémenter `GET /reels` (feed) | 🔴 Critique |
| 5 | Implémenter `POST /reels` (publier une vidéo) | 🔴 Critique |
| 6 | Implémenter `POST /reels/:id/like` | 🟠 Important |
| 7 | Implémenter `POST /reels/:id/comment` | 🟠 Important |
| 8 | Implémenter `POST /negotiate/start` | 🔴 Critique |
| 9 | Implémenter `GET /negotiate/:id` (messages) | 🔴 Critique |
| 10 | Implémenter `POST /negotiate/:id/message` | 🔴 Critique |
| 11 | Implémenter `POST /negotiate/:id/accept` | 🟠 Important |

### Frontend (`camazones-frontend`)
**Branch à créer** : `feature/social-frontend`

| # | Tâche | Priorité |
|---|-------|----------|
| 1 | Créer le feed de Reels (scroll vertical, auto-play) | 🔴 Critique |
| 2 | Créer le composant player vidéo | 🔴 Critique |
| 3 | Boutons like / comment sur les reels | 🟠 Important |
| 4 | Créer la `NegotiationScreen` (dialog room) | 🔴 Critique |
| 5 | Bouton "Négocier le prix" sur un produit | 🔴 Critique |
| 6 | Interface de chat dans la négociation | 🔴 Critique |
| 7 | Bouton "Accepter l'offre → Payer" | 🟠 Important |

---

## 👨‍💻 Dev 4 — Frontend Transversal & UI

**Branch à créer** : `feature/home-ui`

> Ce dev travaille uniquement sur le frontend

| # | Tâche | Priorité |
|---|-------|----------|
| 1 | Implémenter `HomeScreen` complet (bannière, catégories, produits récents) | 🔴 Critique |
| 2 | Créer les composants UI réutilisables (Button, Card, Input, Badge) | 🔴 Critique |
| 3 | Implémenter le composant de recherche globale | 🟠 Important |
| 4 | Créer le composant `CategoryBar` (électronique, mode, etc.) | 🟠 Important |
| 5 | Créer le composant `ProductCard` (partagé avec Dev 1) | 🔴 Critique |
| 6 | Implémenter l'écran de profil utilisateur | 🟠 Important |
| 7 | Implémenter la géolocalisation (filtrer par proximité) | 🟡 Normal |
| 8 | Tester les screens sur Android (Expo Go) | 🟠 Important |
| 9 | Ajouter les splash screen + icône de l'app | 🟡 Normal |

---

## 🐛 Bugs à corriger AVANT de commencer (Chef)

### Bug 1 — Packages incorrects dans `package.json`

Remplacer dans `camazones-frontend/package.json` :
```json
// ❌ INCORRECT
"react-navigation": "^6.1.0",
"react-navigation-bottom-tabs": "^6.1.0",
"react-navigation-native": "^6.1.0",
"react-navigation-stack": "^6.3.0",

// ✅ CORRECT
"@react-navigation/native": "^6.1.0",
"@react-navigation/bottom-tabs": "^6.5.0",
"@react-navigation/native-stack": "^6.9.0",
```

### Bug 2 — Auth hardcodée
Dans `camazones-frontend/src/navigation/RootNavigator.js` ligne 62 :
```js
// ❌ INCORRECT
const [isAuthenticated] = useState(true); // TODO: Get from Redux

// ✅ CORRECT
const isAuthenticated = useSelector(state => state.auth.token !== null);
```

### Bug 3 — Secret JWT exposé
Dans `camazones-backend/src/main/resources/application.properties` :
```properties
# ❌ SUPPRIMER cette ligne
jwt.secret=your-secret-key-change-in-production-...

# ✅ REMPLACER par
jwt.secret=${JWT_SECRET:default-local-dev-secret-minimum-256-bits}
```

### Bug 4 — Handler 401 vide
Dans `camazones-frontend/src/services/apiClient.js` :
```js
if (error.response?.status === 401) {
  store.dispatch(logout()); // ✅ Ajouter ça
}
```

---

## 🚀 Commandes Git pour chaque dev

### Le Chef fait d'abord (une fois) :
```bash
# Backend
cd camazones-backend
git checkout develop
git checkout -b feature/auth-backend
# ... coder ...
git add .
git commit -m "feat: add User entity and JWT authentication"
git push origin feature/auth-backend
# → Créer une Pull Request sur GitHub vers develop

# Frontend
cd camazones-frontend
git checkout develop
git checkout -b feature/auth-frontend
# ... coder ...
git push origin feature/auth-frontend
```

### Chaque Dev ensuite :
```bash
# Cloner le repo
git clone <URL_DU_REPO>
cd camazones-backend  # ou camazones-frontend

# Se mettre sur develop
git checkout develop
git pull origin develop

# Créer sa branch
git checkout -b feature/[son-module]-backend  # ex: feature/products-backend

# Travailler... puis :
git add .
git commit -m "feat: add Product entity and CRUD endpoints"
git push origin feature/products-backend
# → Créer une PR sur GitHub
```

---

## 📅 Ordre de développement suggéré

```
Semaine 1 : Chef → Auth backend (entité User + JWT + endpoints)
Semaine 1 : Dev 4 → UI Components + HomeScreen skeleton

Semaine 2 : Dev 1 → Products CRUD backend
Semaine 2 : Dev 2 → Wallet + Escrow backend  
Semaine 2 : Dev 3 → Reels + Négociation backend

Semaine 3 : Dev 1 → Products frontend (branché sur l'API)
Semaine 3 : Dev 2 → Wallet frontend
Semaine 3 : Dev 3 → Reels + Négociation frontend

Semaine 4 : Intégration + tests + corrections de bugs
```

---

**Questions ? → Demande au Chef du projet !**
