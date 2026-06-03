# README Review Camazones

## Résumé

Cette revue regroupe les changements appliqués au projet Camazones pour stabiliser le démarrage mobile, corriger la transcription vocale, fiabiliser la messagerie, sécuriser le paiement négocié, documenter l'UML et clarifier l'état réel du système d'e-mail.

## Fonctionnalités ajoutées

- Offre négociée dans le chat: le vendeur peut envoyer une offre de paiement officielle au client.
- Paiement négocié sécurisé: le backend relit le prix négocié depuis la base via `conversationId` et ne fait plus confiance au montant envoyé par le téléphone.
- Transcription vocale Google Gemini: l'audio mobile est envoyé au backend puis transcrit via Gemini avec `inline_data`.
- Recherche vocale utile: après transcription, l'application cherche les produits similaires dans la base.
- Démarrage mobile plus rapide: le timeout de bootstrap front est réduit et l'écran ne reste plus bloqué inutilement.
- Splash corrigé: `SplashAnimation` utilise `assets/splash.png` et l'import Metro est explicite.
- Cycle Redux/API corrigé: `apiClient` n'importe plus directement le store.
- Email d'inscription et facture: le service backend existe pour envoyer un mail de bienvenue et des reçus/factures.
- UML généré: architecture, base de données, classes principales et séquences.
- Suppression de l'avertissement `SafeAreaView`: les écrans utilisent maintenant `View` au lieu de l'ancien composant déprécié.

## Fichiers principaux modifiés

### Frontend

- `camazones-frontend/App.js`: accélération du bootstrap à 900 ms.
- `camazones-frontend/src/navigation/RootNavigator.js`: correction de l'import `SplashAnimation`, emojis propres, retour lisible, bienvenue vocale à l'ouverture.
- `camazones-frontend/src/services/apiClient.js`: suppression du cycle Redux/API, gestion 401 via callback.
- `camazones-frontend/src/store/index.js`: configuration du token API et logout auto.
- `camazones-frontend/src/services/authService.js`: timeout auth réduit.
- `camazones-frontend/src/services/speechService.js`: audio envoyé en `audio/mp4`.
- `camazones-frontend/src/screens/products/ProductsScreen.js`: recherche vocale avec appui maintenu puis recherche en base.
- `camazones-frontend/src/services/messageService.js`: ajout de l'envoi d'offre négociée.
- `camazones-frontend/src/screens/messages/MessagesScreen.js`: interface chat avec offre vendeur officielle.
- `camazones-frontend/src/services/paymentService.js`: envoi du `conversationId` au backend Stripe.
- `camazones-frontend/src/screens/wallet/WalletScreen.js`: paiement de l'offre négociée, textes corrigés, facture PDF conservée.
- `camazones-frontend/src/screens/home/HomeScreen.js`: remplacement `SafeAreaView`.
- `camazones-frontend/src/screens/admin/AdminScreen.js`: remplacement `SafeAreaView`.
- `camazones-frontend/src/screens/games/GamesScreen.js`: remplacement `SafeAreaView`.
- `camazones-frontend/src/screens/seller/SellerScreen.js`: remplacement `SafeAreaView`.
- `camazones-frontend/src/screens/shops/ShopsScreen.js`: remplacement `SafeAreaView`.

### Backend

- `camazones-backend/src/main/java/com/camazones/speech/service/OpenAiTranscriptionService.java`: intégration Gemini correcte avec `x-goog-api-key` et `inline_data`.
- `camazones-backend/src/main/resources/application.properties`: configuration SMTP, Stripe et Gemini mise à jour.
- `camazones-backend/.env.example`: modèle Gemini mis à jour.
- `camazones-backend/.env.local.example`: modèle Gemini mis à jour.
- `camazones-backend/scripts/check-local-config.ps1`: diagnostic local SMTP/WAMP/Stripe/Gemini corrigé.
- `camazones-backend/src/main/java/com/camazones/notifications/service/EmailService.java`: service mail d'inscription et de facture corrigé.
- `camazones-backend/src/main/java/com/camazones/messages/entity/ChatConversation.java`: champs d'offre négociée ajoutés.
- `camazones-backend/src/main/java/com/camazones/messages/dto/NegotiatedOfferRequest.java`: DTO de création d'offre.
- `camazones-backend/src/main/java/com/camazones/messages/dto/ConversationResponse.java`: retour API enrichi avec l'offre.
- `camazones-backend/src/main/java/com/camazones/messages/controller/MessageController.java`: endpoint `POST /messages/conversations/{id}/offer`.
- `camazones-backend/src/main/java/com/camazones/messages/service/MessageService.java`: logique vendeur/admin pour créer une offre officielle.
- `camazones-backend/src/main/java/com/camazones/payments/dto/CheckoutSessionRequest.java`: ajout de `conversationId`.
- `camazones-backend/src/main/java/com/camazones/payments/service/StripeCheckoutService.java`: prix négocié imposé côté serveur.
- `camazones-backend/src/main/java/com/camazones/core/config/MessageDataSeeder.java`: conversation Alan/Sony synchronisée avec une vraie offre vendeur.
- `camazones-backend/src/main/resources/db/wamp/camazones_wamp_schema.sql`: colonnes d'offre négociée ajoutées au dump WAMP.

### Documentation

- `camazones-docs/UML_DIAGRAMS.md`: diagrammes Mermaid du projet, de la base de données et des flux principaux.
- `README-REVIEW.md`: résumé de revue globale.

## Fonctionnement du paiement négocié

Avant, le prix négocié était déduit du texte de la conversation, ce qui pouvait être manipulé côté téléphone.

Maintenant:

1. Le client discute le prix avec le vendeur dans le chat.
2. Le vendeur envoie une offre officielle avec un montant.
3. Le backend stocke `negotiated_price`, `negotiated_offer_status`, `negotiated_by_email` et `negotiated_at`.
4. Le client appuie sur `Payer l'offre`.
5. Le téléphone envoie `conversationId` à `/payments/checkout-session`.
6. Le backend relit le montant dans MySQL/WAMP.
7. Stripe reçoit le montant serveur, pas un montant inventé côté mobile.

Pour l'exemple Alan/Sony:

- Produit: Sony Xperia Slim.
- Prix initial: 390 000 FCFA.
- Offre vendeur: 350 000 FCFA.
- Paiement carte: backend impose 350 000 FCFA + livraison/frais.

## Etat réel du mail

Le système d'e-mail backend est codé et branché sur l'inscription:

- `AuthService.register()` sauvegarde l'utilisateur.
- `EmailService.sendWelcomeEmailAsync()` est appelé juste après.
- `NotificationController` permet aussi d'envoyer un mail de bienvenue ou une facture.

Test réel SMTP effectué:

- Résultat: échec.
- Cause retournée par Gmail: `Authentication Required`.
- Conclusion: le code est prêt, mais Gmail refuse le mot de passe actuel pour SMTP.

## Ce qu'il faut fournir pour que le mail fonctionne

Gmail n'accepte généralement pas le mot de passe normal du compte pour SMTP. Il faut fournir un mot de passe d'application Gmail.

Etapes:

1. Activer la validation en deux étapes sur le compte `codex.ess237@gmail.com`.
2. Ouvrir `https://myaccount.google.com/apppasswords`.
3. Générer un mot de passe d'application pour `Mail`.
4. Copier le code de 16 caractères.
5. Mettre ce code dans `camazones-backend/.env.local`:

```properties
CAMAZONES_MAIL_PASSWORD=le_mot_de_passe_application_16_caracteres
```

6. Relancer le backend.
7. Tester:

```powershell
cd C:\Users\Alan\Documents\KEYCE\B2\S2\PT\P4\camazones\camazones-backend
powershell -ExecutionPolicy Bypass -File .\scripts\check-local-config.ps1
```

Le champ attendu doit rester:

```text
MailPasswordConfigured=True
```

Puis créer un compte dans l'application pour déclencher l'e-mail de bienvenue.

## Commandes pour lancer

### 1. Lancer WAMP

Ouvre WAMP et vérifie que MySQL/MariaDB est vert.

### 2. Lancer le backend

```powershell
cd C:\Users\Alan\Documents\KEYCE\B2\S2\PT\P4\camazones\camazones-backend
powershell -ExecutionPolicy Bypass -File .\scripts\check-local-config.ps1
mvn spring-boot:run
```

Backend attendu:

```text
http://localhost:8080/api
```

### 3. Lancer le frontend sur téléphone avec Expo Go

Dans un autre terminal:

```powershell
cd C:\Users\Alan\Documents\KEYCE\B2\S2\PT\P4\camazones\camazones-frontend
Remove-Item Env:EXPO_PUBLIC_API_BASE_URL -ErrorAction SilentlyContinue
npm install
npx expo start --go --clear --lan
```

Ensuite scanner le QR Code avec Expo Go.

### 4. Lancer sur Android Studio / émulateur

```powershell
cd C:\Users\Alan\Documents\KEYCE\B2\S2\PT\P4\camazones\camazones-frontend
Remove-Item Env:EXPO_PUBLIC_API_BASE_URL -ErrorAction SilentlyContinue
npx expo start --go --clear --localhost
```

Puis appuyer sur:

```text
a
```

## Validations effectuées

```powershell
mvn -q test
```

Résultat: OK.

```powershell
npx expo export --platform android --output-dir .tmp-export-final
```

Résultat: OK.

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\check-local-config.ps1
```

Résultat constaté:

```text
EnvLocal=True
WampMysql3306=True
MailUser=True
MailPasswordConfigured=True
StripeSecretConfigured=True
OpenAiKeyConfigured=False
GoogleSpeechKeyConfigured=True
```

## Points importants

- La base autorisée reste WAMP MySQL/MariaDB.
- Le fichier `.env.local` contient les secrets locaux et ne doit pas être poussé.
- Le mail ne partira pas tant que Gmail refusera le mot de passe SMTP.
- Le paiement négocié est maintenant contrôlé par le backend.
- Le crash `Unable to resolve ../components/SplashAnimation` est corrigé.
- Le warning `Require cycle` Redux/API est corrigé.
- Le warning `SafeAreaView deprecated` est corrigé dans les écrans touchés.
