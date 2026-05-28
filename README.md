# Camazones

Camazones est une marketplace mobile qui connecte acheteurs, vendeurs independants et boutiques professionnelles. Le projet contient une application mobile Expo / React Native, une API Spring Boot et une documentation partagee.

## Structure

```text
camazones/
|-- camazones-frontend/   Application mobile Expo / React Native
|-- camazones-backend/    API REST Spring Boot
|-- camazones-docs/       Documentation technique et fonctionnelle
|-- Lean-Canva/           Lean canvas HTML et supports visuels
|-- REQUIREMENTS.md       Pre-requis techniques et fonctionnels
```

## Frontend

Application mobile Expo SDK 54 avec :

- Auth Login / Register.
- JWT persiste avec AsyncStorage.
- Marketplace avec categories, produits et boutiques.
- Recherche globale.
- Badges premium et reconnu AP.
- DM vendeur.
- Paiement simule.
- Profil modifiable, photo et deconnexion.

Lancement :

```powershell
cd C:\Users\Alan\Documents\KEYCE\B2\S2\PT\P4\camazones\camazones-frontend
npm install
$env:EXPO_PUBLIC_API_BASE_URL="http://ADRESSE_IP_DU_PC:8080/api"
npx expo start --go --clear --lan
```

## Backend

API Spring Boot avec socle Java 17, Maven, Security, JPA, JWT et H2.

Lancement :

```powershell
cd C:\Users\Alan\Documents\KEYCE\B2\S2\PT\P4\camazones\camazones-backend
mvn clean install
mvn spring-boot:run
```

Health check :

```text
http://localhost:8080/api/health
```

## Documentation

- `camazones-docs/FRONTEND_SUMMARY.md`
- `camazones-docs/BACKEND_SUMMARY.md`
- `camazones-docs/PROJECT_SUMMARY.md`
- `camazones-docs/API.md`
- `camazones-docs/SCHEMA.md`
- `REQUIREMENTS.md`

## Branches

- `main` : branche principale.
- `alan-dev` : branche de travail recente.

## Notes importantes

- Sur telephone physique, ne pas utiliser `localhost` pour l'API.
- Utiliser l'adresse IP du PC dans `EXPO_PUBLIC_API_BASE_URL`.
- Android 9+ est vise avec Expo Go SDK 54.
