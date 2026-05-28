# Camazones Frontend

Application mobile Expo / React Native pour connecter acheteurs, vendeurs indépendants et boutiques professionnelles.

## Stack

- React Native 0.81.5
- Expo SDK 54
- React 19.1
- Redux Toolkit
- React Navigation
- React Native Paper
- Axios
- AsyncStorage

## Architecture

```text
src/
├── components/       # Logo, badges, cartes boutique/produit
├── data/             # Données marketplace de démonstration
├── navigation/       # RootNavigator + Tabs
├── screens/
│   ├── auth/         # Login / Register
│   ├── home/         # Boutiques et vitrines
│   ├── messages/     # DM vendeur
│   ├── products/     # Recherche globale
│   ├── seller/       # Types de profils
│   └── wallet/       # Paiement
├── services/         # API, auth, client axios
├── store/            # Redux slices
└── theme/            # Palette premium
```

## Lancement Expo Go

```powershell
cd C:\Users\Alan\Documents\KEYCE\B2\S2\PT\P4\camazones\camazones-frontend
npm install
$env:EXPO_PUBLIC_API_BASE_URL="http://ADRESSE_IP_DU_PC:8080/api"
npx expo start --go --clear --lan
```

## Notes mobile

- Ne pas utiliser `localhost` sur téléphone physique.
- Le téléphone et le PC doivent être sur le même Wi-Fi.
- Android 9+ est couvert par Expo Go SDK 54.
- Le point d’entrée Expo est `index.js`.

## API

La base API est lue depuis `EXPO_PUBLIC_API_BASE_URL`.

Fallback local : `http://localhost:8080/api`.

## Palette

- Fond : `#F6F1EA`
- Texte : `#1F1F1F`
- Principal : `#2F3A56`
- Accent : `#B98C5A`
