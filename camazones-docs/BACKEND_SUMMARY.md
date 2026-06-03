# Resume Backend - Camazones

## Role

Le backend est une API REST Spring Boot destinee a servir les donnees de Camazones : authentification, utilisateurs, boutiques, produits, paiements et services associes.

## Stack

- Java 17
- Spring Boot 3.3.5
- Maven
- Spring Web
- Spring Security
- Spring Data JPA
- Spring Validation
- JWT avec JJWT
- MySQL/MariaDB WAMP uniquement

## Etat actuel

Le backend contient le socle technique :

- Application Spring Boot principale.
- Configuration des proprietes JWT.
- Base URL configuree sous `/api`.
- Endpoint de sante : `GET /api/health`.
- Configuration WAMP locale.
- Dependances pretes pour auth, JPA, security, validation et MySQL.
- Base autorisee uniquement : WAMP MySQL/MariaDB.
- Le seed ne tourne que si la table `users` WAMP est vide.

## Organisation

```text
camazones-backend/
|-- pom.xml
|-- src/main/java/com/camazones/
|   |-- CamazonesBackendApplication.java
|   |-- auth/config/JwtProperties.java
|   |-- core/controller/HealthController.java
|-- src/main/resources/
|   |-- application.properties
```

## Endpoint disponible

```http
GET http://localhost:8080/api/health
```

Reponse attendue :

```text
Camazones Backend is running
```

## Modules prevus

- Auth : register, login, JWT, profil utilisateur.
- Products : produits, categories, recherche.
- Shops : creation et consultation de boutiques.
- Payments : wallet, mobile money, escrow.
- Social : DM, videos, negociation.

## Lancement

```powershell
cd C:\Users\Alan\Documents\KEYCE\B2\S2\PT\P4\camazones\camazones-backend
mvn clean install
mvn spring-boot:run
```

## Configuration importante

- Port : `8080`
- Bind LAN : `0.0.0.0`
- Context path : `/api`
- WAMP : `jdbc:mysql://localhost:3306/camazones`
- Variable production recommandee : `JWT_SECRET`
