# Camazones Backend

API REST pour la plateforme Camazones - Le marché africain dans votre poche 🌍

## Stack Technique

- **Framework**: Spring Boot 3.1.5
- **Language**: Java 17
- **Build**: Maven
- **Database**: H2 (dev) / PostgreSQL (prod)
- **Auth**: JWT
- **API**: RESTful

## Architecture Modulaire

```
src/main/java/com/camazones/
├── core/              # Configurations, health check, utils
├── auth/              # Authentication & Authorization
├── products/          # Produits & Boutiques
├── payments/          # Portefeuille, Mobile Money, Escrow
├── social/            # Vidéos, Reels, Négociation de prix
└── shared/            # Entités partagées, exceptions, constants
```

## Setup Local

### Prérequis
- Java 17+
- Maven 3.8+

### Installation

```bash
# Clone le repo
git clone <repo-url>
cd camazones-backend

# Build
mvn clean install

# Run
mvn spring-boot:run
```

Server démarre sur `http://localhost:8080/api`

## API Endpoints (À définir par module)

Voir `../camazones-docs/API.md` pour la spec complète

## Branching Strategy

- `main` → Production (protégée, PR required)
- `develop` → Intégration (base pour features)
- `feature/*` → Nouvelles features (de `develop`)
- `fix/*` → Bug fixes (de `develop`)

## Git Workflow

```bash
# 1. Clone & create feature branch
git clone <repo>
git checkout -b feature/auth-login

# 2. Commit & push
git add .
git commit -m "feat: add JWT login endpoint"
git push origin feature/auth-login

# 3. Create Pull Request on GitHub

# 4. Review + Merge to develop
```

## Modules & Responsables

| Module | Dev | Tâches |
|--------|-----|--------|
| **Auth** | Chef | User registration, Login, JWT |
| **Products** | Dev 1 | Products CRUD, Shops, Categories |
| **Payments** | Dev 2 | Wallet, Mobile Money, Escrow |
| **Social** | Dev 3 | Videos, Reels, Price Negotiation |

## Documentation

- [API Specification](../camazones-docs/API.md)
- [Database Schema](../camazones-docs/SCHEMA.md)
- [Architecture](../camazones-docs/ARCHITECTURE.md)

## Questions?

Contact le chef du projet pour clarifications sur l'API ou l'architecture.
