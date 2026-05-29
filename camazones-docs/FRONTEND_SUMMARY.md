# Resume Frontend - Camazones

## Role

Le frontend est une application mobile Expo / React Native qui presente Camazones comme une marketplace mobile entre acheteurs, boutiques professionnelles et vendeurs independants.

## Stack

- Expo SDK 54
- React Native 0.81.5
- React 19.1.0
- Redux Toolkit + React Redux
- Axios
- AsyncStorage

## Fonctionnalites principales

- Authentification avec ecrans Login et Register.
- Persistance du token JWT via AsyncStorage.
- Restauration automatique de session au lancement.
- Deconnexion depuis le profil.
- Gestion automatique du logout sur erreur API 401.
- Accueil marketplace inspire du prototype mobile : header orange, recherche, categories, banner et grille produit.
- Boutiques professionnelles avec vitrine et catalogue.
- Produits avec images locales embarquees pour Expo Go.
- Recherche globale hors boutique.
- Badges boutique pro, reconnu AP et premium.
- Messagerie directe entre acheteur et vendeur.
- Paiement simule : Orange Money, MTN MoMo, carte bancaire et solde Camazones.
- Profil avec modification d'informations, photo de profil et mode sombre.

## Organisation

```text
camazones-frontend/
|-- App.js
|-- index.js
|-- app.json
|-- package.json
|-- assets/
|   |-- products/
|   |-- profiles/
|-- src/
|   |-- components/
|   |-- data/
|   |-- navigation/
|   |-- screens/
|   |-- services/
|   |-- store/
|   |-- theme/
```

## Ecrans

- `AuthScreen` : connexion et inscription.
- `HomeScreen` : accueil marketplace, categories, produits et boutiques.
- `ProductsScreen` : recherche globale.
- `SellerScreen` : profil utilisateur, vendeur independant et boutique.
- `MessagesScreen` : DM vendeur.
- `WalletScreen` : paiement.

## Lancement

```powershell
cd C:\Users\Alan\Documents\KEYCE\B2\S2\PT\P4\camazones\camazones-frontend
npm install
npx expo start --go --clear --lan
```

L'URL API est auto-detectee depuis l'IP LAN Expo. `EXPO_PUBLIC_API_BASE_URL` reste disponible pour forcer une adresse.

## Compatibilite mobile

- Expo Go SDK 54.
- Android 9 ou plus.
- Le telephone et le PC doivent etre sur le meme reseau Wi-Fi en mode LAN.
- L'API ne doit pas etre appelee avec `localhost` depuis un telephone physique.
