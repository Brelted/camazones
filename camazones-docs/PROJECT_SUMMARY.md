# Resume Projet - Camazones

## Vision

Camazones est une marketplace mobile qui met en relation des acheteurs, des vendeurs independants et des boutiques professionnelles. L'application permet de decouvrir des vitrines, rechercher des produits, discuter avec un vendeur et preparer un paiement fluide.

## Objectif utilisateur

- Voir rapidement des boutiques et leurs produits.
- Rechercher un produit hors boutique.
- Identifier les boutiques premium ou reconnues AP.
- Contacter un vendeur en DM.
- Finaliser un achat avec un parcours paiement simple.
- Gerer son profil, sa photo et son mode d'affichage.

## Parties du projet

```text
camazones/
|-- camazones-frontend/   Application mobile Expo / React Native
|-- camazones-backend/    API REST Spring Boot
|-- camazones-docs/       Documentation projet
|-- Lean-Canva/           Lean canvas et support visuel
```

## Parcours principal

1. L'utilisateur ouvre l'application.
2. Il voit une interface marketplace avec categories, promotion et produits.
3. Il entre dans une boutique pour voir uniquement les articles de cette boutique.
4. Il recherche globalement un produit si besoin.
5. Il contacte le vendeur en DM.
6. Il choisit un moyen de paiement.
7. Il gere son profil et peut se deconnecter.

## Identite visuelle

- Style mobile marketplace vivant.
- Header orange.
- Fond beige/kaki sans blanc pur.
- Bannieres bleu/violet.
- Badges verts et orange.
- Grille produit deux colonnes.
- Photos locales de vetements et gadgets.

## Etat technique

- Frontend fonctionnel sous Expo Go SDK 54.
- Backend initial fonctionnel avec health check.
- Auth frontend prete avec stockage JWT.
- API auth backend encore a implementer completement.
- Paiement simule cote front en attente d'un provider reel.

## Commandes rapides

Frontend :

```powershell
cd camazones-frontend
npm install
npx expo start --go --clear --lan
```

Backend :

```powershell
cd camazones-backend
mvn clean install
mvn spring-boot:run
```
