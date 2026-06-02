# Camazones Backend

API REST Spring Boot pour la plateforme Camazones.

## Stack

- Spring Boot 3.1.5
- Java 17
- Maven
- Spring Web
- Spring Security
- Spring Data JPA
- Spring Validation
- JWT avec JJWT
- MySQL Connector/J
- WAMP MySQL

## Architecture actuelle

```text
src/main/java/com/camazones/
|-- CamazonesBackendApplication.java
|-- auth/
|   |-- config/JwtProperties.java
|-- core/
|   |-- controller/HealthController.java
src/main/resources/
|-- application.properties
```

## Etat actuel

- Application Spring Boot initialisee.
- Base URL configuree sous `/api`.
- Endpoint de sante disponible.
- Configuration JWT externalisable.
- WAMP MySQL configure par defaut.
- Les inscriptions `/auth/register` sont persistees dans la table `users`.
- Dependances pretes pour l'auth, les produits, les boutiques et le paiement.

## Endpoint disponible

```http
GET http://localhost:8080/api/health
```

## Setup local

### Prerequis

- Java 17+
- Maven 3.8+

### Installation

```powershell
cd C:\Users\Alan\Documents\KEYCE\B2\S2\PT\P4\camazones\camazones-backend
mvn clean install
$env:WAMP_DB_USER="root"
Remove-Item Env:WAMP_DB_PASSWORD -ErrorAction SilentlyContinue
mvn spring-boot:run
```

Le serveur demarre sur :

```text
http://localhost:8080/api
```

## Configuration

```properties
server.port=8080
server.address=0.0.0.0
server.servlet.context-path=/api
spring.datasource.url=jdbc:mysql://localhost:3306/camazones
jwt.secret=${JWT_SECRET:local-dev-only-secret-minimum-256bits-camazones-2026}
```

### Email factures

```powershell
$env:CAMAZONES_MAIL_ENABLED="true"
$env:CAMAZONES_MAIL_USERNAME="codex.ess237@gmail.com"
$env:CAMAZONES_MAIL_FROM="codex.ess237@gmail.com"
$env:CAMAZONES_MAIL_PASSWORD="<mot_de_passe_ou_app_password_gmail>"
mvn spring-boot:run
```

## Modules prevus

- Auth : inscription, connexion, JWT, profil utilisateur.
- Products : produits, categories, recherche.
- Shops : boutiques, vitrines, produits de boutique.
- Payments : wallet, mobile money, escrow.
- Social : DM, videos, negociation.

## Documentation

- `../camazones-docs/BACKEND_SUMMARY.md`
- `../camazones-docs/API.md`
- `../camazones-docs/SCHEMA.md`
- `../REQUIREMENTS.md`
