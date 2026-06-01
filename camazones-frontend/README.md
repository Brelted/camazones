# Camazones Frontend

Application mobile Expo / React Native pour connecter acheteurs, vendeurs independants et boutiques professionnelles.

## Stack

- Expo SDK 54
- React Native 0.81.5
- React 19.1.0
- Redux Toolkit
- React Redux
- Axios
- AsyncStorage

## Architecture

```text
src/
|-- components/       Logo, badges, cartes boutique/produit, UI de base
|-- data/             Donnees marketplace de demonstration
|-- navigation/       RootNavigator et navigation par onglets
|-- screens/
|   |-- auth/         Login / Register
|   |-- home/         Accueil marketplace
|   |-- messages/     DM vendeur
|   |-- products/     Recherche globale
|   |-- seller/       Profil, photo, mode sombre, deconnexion
|   |-- wallet/       Paiement
|-- services/         API, auth, stockage et client axios
|-- store/            Redux slices
|-- theme/            Palette marketplace beige/kaki/orange
```

## Fonctionnalites

- Authentification Login / Register.
- Token JWT persiste avec AsyncStorage.
- Logout automatique sur reponse API 401.
- Accueil inspire marketplace mobile : header orange, categories, banner et grille deux colonnes.
- Images locales de vetements et gadgets.
- Vitrines boutiques avec produits.
- Recherche globale.
- Badges premium et reconnu AP.
- DM vendeur.
- Paiement Orange Money, MTN MoMo, carte et wallet en parcours simule.
- Profil modifiable, photo de profil, mode sombre et deconnexion.
- Console admin si le compte connecte a le role `ADMIN`.
- Mini-jeux integres : Snake et Fruit Slash.
- Comptes demo ajoutes : `alan.independant@camazones.demo` et `sony@camazones.demo`.

## Lancement Expo Go

Lancer d'abord le backend :

```powershell
cd C:\Users\Alan\Documents\KEYCE\B2\S2\PT\P4\camazones\camazones-backend
mvn spring-boot:run
```

Puis lancer Expo :

```powershell
cd C:\Users\Alan\Documents\KEYCE\B2\S2\PT\P4\camazones\camazones-frontend
npm install
npx expo start --go --clear --lan
```

L'app detecte automatiquement l'IP LAN Expo et appelle le backend sur `http://IP_DU_PC:8080/api`.

Si besoin, forcer l'URL :

```powershell
$env:EXPO_PUBLIC_API_BASE_URL="http://ADRESSE_IP_DU_PC:8080/api"
```

## Lancement Android Studio

```powershell
cd C:\Users\Alan\Documents\KEYCE\B2\S2\PT\P4\camazones\camazones-frontend
npx expo start --go --clear
```

Puis appuyer sur :

```text
a
```

## Notes mobile

- Ne pas utiliser `localhost` sur telephone physique.
- Le telephone et le PC doivent etre sur le meme Wi-Fi.
- Android 9+ est vise avec Expo Go SDK 54.
- Le point d'entree Expo est `index.js`.

## API

La base API est lue depuis :

```text
EXPO_PUBLIC_API_BASE_URL
```

Fallback automatique :

```text
Expo LAN: http://IP_DU_PC:8080/api
Android Emulator: http://10.0.2.2:8080/api
Localhost: http://localhost:8080/api
```

## Palette

- Fond : `#E8DCC8`
- Surface : `#F1DFC0`
- Carte : `#F6E7CA`
- Orange principal : `#FF5A00`
- Vert badge : `#20C76A`
- Bleu promo : `#3478F6`
- Violet promo : `#A100FF`
