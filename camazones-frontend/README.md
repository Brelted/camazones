# Camazones Frontend

Application mobile React Native pour Camazones - Le marché africain dans votre poche 🌍

## Stack Technique

- **Framework**: React Native 0.73
- **Runtime**: Expo 50.0
- **State Management**: Redux Toolkit
- **UI Library**: React Native Paper
- **Navigation**: React Navigation
- **API Client**: Axios
- **Maps**: Expo Location

## Architecture

```
src/
├── screens/          # Écrans de l'app
│   ├── auth/        # Login/Register
│   ├── home/        # Accueil
│   ├── products/    # Catalogue produits
│   ├── seller/      # Gestion boutique
│   └── wallet/      # Portefeuille
├── components/       # Composants réutilisables
├── services/         # API calls (axios)
├── navigation/       # Stack, Tab, Navigation
├── store/           # Redux store
├── theme/           # Design system
└── utils/           # Utilities
```

## Setup Local

### Prérequis
- Node.js 18+
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

```bash
# Clone le repo
git clone <repo-url>
cd camazones-frontend

# Install dependencies
npm install

# Start Expo
npm start
```

## Lancer l'App

```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## Branching Strategy

- `main` → Production
- `develop` → Intégration
- `feature/*` → Features
- `fix/*` → Bug fixes

## Git Workflow

```bash
# Create feature branch from develop
git checkout develop
git pull
git checkout -b feature/login-screen

# Make changes & commit
git add .
git commit -m "feat: add login screen with validation"

# Push & create PR
git push origin feature/login-screen
```

## Modules & Responsables

| Module | Dev | Focus |
|--------|-----|-------|
| **Auth Screens** | Dev 4 | Login, Register, Profile |
| **Home & Feed** | Dev 4 | Main UI, Product feed |
| **Products & Search** | Dev 4 | Browse, Filter, Details |
| **Seller Tools** | Dev 4 | Create shop, List products |
| **Wallet & Payments** | Dev 4 | Easy Wallet, Transactions |
| **Chat/Negotiation** | Dev 4 | Price negotiation rooms |

## API Integration

API Base: `http://localhost:8080/api`

See `../camazones-docs/API.md` for endpoint specs.

## Design System

Primary Color: `#FF6B35` (Orange)
Accent Color: `#F7931E`
Text: `#2C3E50`

## Testing

```bash
npm test
```

## Questions?

Contact le chef du projet.
