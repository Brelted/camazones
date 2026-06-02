# Camazones

Camazones est une marketplace mobile Expo + Spring Boot qui connecte acheteurs, vendeurs independants et boutiques professionnelles avec vitrines, recherche, DM vendeur, portefeuille et paiement.

## Structure

```text
camazones/
|-- camazones-frontend/   App mobile Expo SDK 54
|-- camazones-backend/    API Spring Boot + JWT + WAMP MySQL
|-- camazones-docs/       Documentation projet
|-- Lean-Canva/           Lean canvas HTML
|-- REQUIREMENTS.md       Prerequis et dependances
```

## Lancer le backend

```powershell
cd C:\Users\Alan\Documents\KEYCE\B2\S2\PT\P4\camazones\camazones-backend
$env:JAVA_HOME="C:\Users\Alan\AppData\Local\Programs\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
$env:Path="$env:JAVA_HOME\bin;C:\ProgramData\chocolatey\lib\maven\apache-maven-3.9.16\bin;$env:Path"
$env:WAMP_DB_USER="root"
Remove-Item Env:WAMP_DB_PASSWORD -ErrorAction SilentlyContinue
mvn spring-boot:run
```

Health check :

```text
http://localhost:8080/api/health
```

## Lancer le frontend Expo Go

```powershell
cd C:\Users\Alan\Documents\KEYCE\B2\S2\PT\P4\camazones\camazones-frontend
npm install
Remove-Item Env:EXPO_PUBLIC_API_BASE_URL -ErrorAction SilentlyContinue
npx expo start --go --clear --lan
```

L'application detecte automatiquement l'IP LAN Expo pour joindre `http://IP_DU_PC:8080/api`.

## Fonctionnalites principales

- Authentification JWT login/register avec restauration de session.
- Frontend connecte a l'API backend avec cache local et fallback offline.
- Donnees seedees en base WAMP MySQL au demarrage: boutiques, produits, comptes demo.
- Les nouvelles inscriptions passent par `/auth/register` et sont enregistrees dans la table `users`.
- Zone Boutiques dediee aux vitrines professionnelles uniquement.
- Recherche globale avec filtre deroulant par categorie et produits correspondants.
- Carousel horizontal de produits tendance.
- Profil modifiable avec photo, publication article avec image televersee et historique.
- Mode sombre optionnel dans le Profil, persistant.
- Langue FR/EN dans le Profil, persistante.
- Pay deplace dans le Profil.
- Portefeuille Camazone rechargeable avec historique.
- Paiement Orange Money, MTN MoMo, carte, wallet avec emojis discrets.
- Export de facture en PDF et partage mobile.
- Badges AP, premium et etoile visible pour boutiques premium.
- Console admin pour clients, boutiques, produits, blocages et commissions hebdomadaires.
- Espace mini-jeux mobile avec Snake et Fruit Slash.
- Logo Camazone rond avec carte du Cameroun visible au centre.

## Fichiers principaux

```text
camazones-frontend/src/App.js
Point d'entree React Native, Provider Redux, theme global et navigation.

camazones-frontend/src/navigation/RootNavigator.js
Controle la navigation selon auth, onglets, admin, jeux, messages et paiement.

camazones-frontend/src/screens/auth/AuthScreen.js
Ecran connexion/inscription, restauration JWT et choix type compte.

camazones-frontend/src/data/marketplace.js
Catalogue local: boutiques, produits, categories emoji, moyens de paiement et comptes.

camazones-frontend/src/services/marketplaceService.js
Connexion API marketplace, cache offline, merge des produits publies et upload image local.

camazones-frontend/src/screens/home/HomeScreen.js
Accueil avec vitrines, carousel automatique et produits mis en avant.

camazones-frontend/src/screens/products/ProductsScreen.js
Recherche globale, filtre deroulant categorie, boutiques et produits trouves.

camazones-frontend/src/screens/seller/SellerScreen.js
Profil, photo utilisateur, mode sombre, publication article avec image et historique achats.

camazones-frontend/src/screens/wallet/WalletScreen.js
Paiement, recharge wallet, methodes Orange Money/MTN/carte/wallet et historique.

camazones-frontend/src/services/pdfService.js
Generation et partage des factures PDF signees.

camazones-frontend/src/components/MarketplaceCards.js
Cartes boutiques, produits, badges, boutons message/mail/payer.

camazones-frontend/assets/brand/
Logo rond, logo large et marque Camazone utilises par l'application.

camazones-backend/src/main/java/com/camazones/core/config/DataSeeder.java
Seed backend: users demo, boutiques, produits, conversations et commissions.

camazones-backend/src/main/resources/db/wamp/camazones_wamp_schema.sql
Script SQL WAMP/MySQL avec schema, donnees demo et prix synchronises.

camazones-docs/COMPTES_DEMO.md
Liste complete des comptes demo et leurs mots de passe.
```

## Identifiants demo

Tous les comptes seedes utilisent :

```text
Mot de passe: Camazones2026!
```

Comptes utiles :

```text
admin@camazones.demo
alan.independant@camazones.demo
sony@camazones.demo
koa@camazones.demo
talia@camazones.demo
noma@camazones.demo
sawa@camazones.demo
mila@camazones.demo
```

## Branches attendues

- `main` : projet complet.
- `alan-dev` : copie de travail finale synchronisee avec `main`.
- `front` : frontend uniquement.
- `back` : backend uniquement.
