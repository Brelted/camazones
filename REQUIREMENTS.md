# Requirements - Camazones

## Environnement global

- Git
- Windows PowerShell ou terminal compatible
- Connexion Internet pour installer les dependances

## Frontend

- Node.js 18 ou plus
- npm
- Expo Go compatible SDK 54
- Android 9 ou plus pour telephone physique
- Reseau Wi-Fi commun entre PC et telephone en mode LAN

### Dependances principales

- Expo `~54.0.33`
- React `19.1.0`
- React Native `0.81.5`
- Redux Toolkit
- React Redux
- Axios
- AsyncStorage

### Variable d'environnement

```powershell
$env:EXPO_PUBLIC_API_BASE_URL="http://ADRESSE_IP_DU_PC:8080/api"
```

## Backend

- Java 17 ou plus
- Maven 3.8 ou plus
- H2 pour developpement local
- PostgreSQL pour production

### Dependances principales

- Spring Boot `3.1.5`
- Spring Web
- Spring Security
- Spring Data JPA
- Spring Validation
- JJWT `0.12.3`
- H2
- PostgreSQL driver
- Lombok

### Variables recommandees

```powershell
$env:JWT_SECRET="cle-secrete-production-256-bits-minimum"
```

## Fonctionnel attendu

- Authentification login/register.
- Persistance JWT.
- Vitrines boutiques.
- Produits avec images.
- Recherche globale.
- Badges premium et reconnu AP.
- Messagerie directe vendeur.
- Paiement mobile money, carte et wallet.
- Profil modifiable avec photo et deconnexion.

## Compatibilite

- Expo Go SDK 54.
- Android 9+.
- Backend local sur `http://localhost:8080/api`.
- Frontend mobile vers API via l'adresse IP du PC, pas `localhost`.
