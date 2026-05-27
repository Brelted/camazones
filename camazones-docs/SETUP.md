# Setup Guide - Camazones Project

Guide complet pour démarrer le développement sur Camazones.

## 📂 Structure des Repos

Tu as 3 repos Git locaux:

```
Camazone_React/
├── camazones-backend/       (Spring Boot API)
├── camazones-frontend/      (React Native + Expo)
└── camazones-docs/          (Documentation partagée)
```

Chaque repo a:
- Branch `main` (production)
- Branch `develop` (intégration)

## 🎯 Assignment par Dev

| Dev | Repo | Modules | Branches |
|-----|------|---------|----------|
| **Chef (Toi)** | backend | auth, core setup | feature/auth-* |
| **Dev 1** | backend/products | products, shops, search | feature/products-* |
| **Dev 2** | backend/payments | wallet, mobile money, escrow | feature/payments-* |
| **Dev 3** | backend/social | reels, negotiation, chat | feature/social-* |
| **Dev 4** | frontend | ALL screens & UI | feature/*-screen |

## 🚀 Étapes pour Chaque Dev

### Step 1: Cloner les Repos

**Dev 1, 2, 3 (Backend):**
```bash
cd Camazone_React
git clone ./camazones-backend camazones-backend-dev1
cd camazones-backend-dev1
git checkout develop
npm install  # ou mvn install pour Java
```

**Dev 4 (Frontend):**
```bash
cd Camazone_React
git clone ./camazones-frontend camazones-frontend-dev4
cd camazones-frontend-dev4
git checkout develop
npm install
```

### Step 2: Créer la Feature Branch

Chacun crée sa branche depuis `develop`:

```bash
git checkout -b feature/son-module

# Exemples:
# Dev 1: git checkout -b feature/products-crud
# Dev 2: git checkout -b feature/wallet-integration
# Dev 3: git checkout -b feature/price-negotiation
# Dev 4: git checkout -b feature/home-screen
```

### Step 3: Travailler sur sa Tâche

Développer le module assigné, commit régulièrement:

```bash
git add .
git commit -m "feat: add product listing endpoint"
git push origin feature/son-module
```

### Step 4: Pull Request & Review

Une fois fini, créer une PR sur GitHub:
1. Aller sur GitHub
2. "Compare & pull request"
3. Description claire
4. Attendre review du Chef
5. Merge sur `develop`

## 📋 Backend Setup

### Prérequis:
- Java 17+
- Maven 3.8+
- PostgreSQL (ou H2 pour dev)

### Installation:
```bash
cd camazones-backend
mvn clean install
mvn spring-boot:run
```

Server tourne sur: `http://localhost:8080/api`

## 📱 Frontend Setup

### Prérequis:
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`

### Installation:
```bash
cd camazones-frontend
npm install
npm start
```

### Lancer l'app:
```bash
# Android (nécessite Android Studio/Emulator)
npm run android

# Web (pour tester rapidement)
npm run web

# iOS (Mac seulement)
npm run ios
```

## 🔗 Communication API

**Important:** Backend et Frontend doivent se coordonner!

La spec API est dans: `camazones-docs/API.md`

Avant de commencer une feature, vérifier:
1. L'endpoint existe dans API.md ✅
2. Frontend a les détails de la requête/réponse ✅
3. Authentication (JWT) est configured ✅

## 📝 Templates Utiles

### Pull Request Template
```
## Description
[Brève description de la feature]

## Changes
- Change 1
- Change 2
- Change 3

## Testing
- [x] Testé localement
- [x] Tests passent
- [x] Pas de breaking changes

## Related Issues
Fixes #123
```

### Commit Message Format
```
feat:  nouvelle feature
fix:   bug fix
docs:  documentation
refactor: refactoring
test:  tests
chore: config/dependencies
```

## 🆘 Troubleshooting

**Frontend ne se compile pas?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Backend ne démarre pas?**
```bash
mvn clean
mvn install
mvn spring-boot:run
```

**Conflits Git?**
```bash
git status  # Voir les conflits
# Éditer les fichiers manuellement
git add .
git commit -m "resolve: merge conflicts"
```

## 📞 Support

- **Questions architectures?** → Chef
- **API issues?** → Dev responsable du module
- **Git problems?** → Chef

---

**Vous êtes prêts! Commencez par cloner et checkout develop 🚀**
