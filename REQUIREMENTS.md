# Requirements - Camazones

## Global

- Git
- Windows PowerShell
- Node.js 18+
- Java 17+
- Maven 3.8+
- Expo Go SDK 54
- Android 9+

## Frontend

- Expo `~54.0.33`
- React `19.1.0`
- React Native `0.81.5`
- React Native Web `~0.21.2`
- Redux Toolkit
- React Redux
- Axios
- AsyncStorage
- NetInfo
- Expo Image Picker
- Expo Image Manipulator
- Expo Print
- Expo Sharing

## Backend

- Spring Boot `3.3.5`
- Spring Web
- Spring Security
- Spring Data JPA
- Spring Validation
- JJWT `0.12.3`
- H2 en developpement
- PostgreSQL driver pour production

## Variables

Frontend optionnel :

```powershell
$env:EXPO_PUBLIC_API_BASE_URL="http://IP_DU_PC:8080/api"
```

Backend recommande :

```powershell
$env:JWT_SECRET="cle-secrete-production-256-bits-minimum"
```

## Compatibilite

- Expo Go SDK 54.
- Android 9, 10 et plus.
- Backend local sur `0.0.0.0:8080`.
- Mobile vers backend via IP LAN detectee automatiquement ou variable `EXPO_PUBLIC_API_BASE_URL`.
- Ne pas combiner `--offline` avec `--lan`, `--tunnel` ou `--localhost`.

## Fonctionnel

- Auth JWT.
- API connectee a la base H2 dev.
- Cache offline cote app.
- Vitrines boutiques.
- Produits boutiques et vendeurs independants.
- Recherche globale.
- Badges AP et premium.
- DM vendeur.
- Profil editable avec photo locale compressee.
- Mode sombre optionnel persistant.
- Langue FR/EN persistante.
- Portefeuille rechargeable.
- Paiement simule realiste.
- Facture PDF partageable.
