# Camazones

Camazones est une marketplace mobile Expo + Spring Boot qui connecte acheteurs, vendeurs independants et boutiques professionnelles avec vitrines, recherche, DM vendeur, portefeuille et paiement.

## Structure

```text
camazones/
|-- camazones-frontend/   App mobile Expo SDK 54
|-- camazones-backend/    API Spring Boot + JWT + H2 dev
|-- camazones-docs/       Documentation projet
|-- Lean-Canva/           Lean canvas HTML
|-- REQUIREMENTS.md       Prerequis et dependances
```

## Lancer le backend

```powershell
cd C:\Users\Alan\Documents\KEYCE\B2\S2\PT\P4\camazones\camazones-backend
$env:JAVA_HOME="C:\Users\Alan\AppData\Local\Programs\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
$env:Path="$env:JAVA_HOME\bin;C:\ProgramData\chocolatey\lib\maven\apache-maven-3.9.16\bin;$env:Path"
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
- Donnees seedees en base H2 au demarrage: boutiques, produits, comptes demo.
- Zone Boutiques dediee aux vitrines professionnelles uniquement.
- Recherche globale avec boutiques et produits correspondants.
- Carousel horizontal de produits tendance.
- Profil modifiable avec photo depuis le telephone, compression image et historique.
- Mode sombre optionnel dans le Profil, persistant.
- Langue FR/EN dans le Profil, persistante.
- Pay deplace dans le Profil.
- Portefeuille Camazone rechargeable avec historique.
- Paiement Orange Money, MTN MoMo, carte, wallet.
- Export de facture en PDF et partage mobile.
- Badges AP, premium et etoile visible pour boutiques premium.

## Identifiants demo

Tous les comptes seedes utilisent :

```text
Mot de passe: Camazones2026!
```

Comptes utiles :

```text
admin@camazones.demo
koa@camazones.demo
talia@camazones.demo
noma@camazones.demo
sawa@camazones.demo
mila@camazones.demo
```

## Branches attendues

- `main` : projet complet.
- `front` : frontend uniquement.
- `back` : backend uniquement.
