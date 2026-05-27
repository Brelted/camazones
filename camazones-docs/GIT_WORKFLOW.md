# Git Workflow - Camazones

Guide pour travailler efficacement en équipe sur les 3 repos.

## 📊 Structure des Branches

```
main (production)
  ↑
  └─ develop (intégration - BASE pour tout)
      ↑
      ├─ feature/auth-login (Dev A)
      ├─ feature/products-list (Dev B)
      ├─ feature/wallet-topup (Dev C)
      └─ feature/negotiation-chat (Dev D)
```

**Règles:**
- `main` = Code stable, production-ready
- `develop` = Base pour toutes les features
- Jamais push directement sur `main` ou `develop`
- Toujours créer une feature branch pour chaque tâche

## 🚀 Workflow Standard

### 1. Cloner un repo

```bash
# Clone le repo (une fois)
git clone https://github.com/camazones/camazones-backend.git
cd camazones-backend

# Configure Git (une fois par repo)
git config user.name "Ton Nom"
git config user.email "ton@email.com"
```

### 2. Créer une feature branch

```bash
# Toujours partir de develop
git checkout develop
git pull origin develop

# Créer une nouvelle branch feature
git checkout -b feature/nom-descriptif

# Exemples:
# feature/user-authentication
# feature/product-listing
# feature/wallet-integration
# feature/price-negotiation
```

### 3. Commiter et pusher

```bash
# Vérifier les changements
git status

# Ajouter les fichiers
git add .

# Commiter avec message clair
git commit -m "feat: add JWT authentication"
# ou
git commit -m "fix: handle null pointer in products query"
# ou
git commit -m "docs: update API spec"

# Types de commit acceptés:
# - feat:  Nouvelle feature
# - fix:   Bug fix
# - refactor: Code refactor
# - docs:  Documentation
# - test:  Tests
# - chore: Configuration, dépendances

# Pusher vers origin
git push origin feature/nom-descriptif
```

### 4. Créer une Pull Request (PR)

Sur GitHub:
1. Aller sur le repo
2. Cliquer "Compare & pull request"
3. Remplir le template:
   - **Title**: Titre court et clair
   - **Description**: Explique ce que tu as fait et pourquoi
   - **Screenshots/Logs**: Si pertinent

Exemple:
```
## Description
Implémentation du système d'authentification JWT

## Changes
- Ajouté endpoint POST /auth/login
- Ajouté endpoint POST /auth/register
- Créé JwtAuthenticationFilter

## Testing
- ✅ Tests unitaires pour JwtProvider
- ✅ Testé avec Postman

## Checklist
- [x] Code fonctionne localement
- [x] Tests passent
- [x] Documentation mise à jour
```

### 5. Review & Merge

**Reviewer (autre Dev ou Chef):**
- Lire le code
- Tester localement si nécessaire
- Approver ou demander des changements

**Après approbation:**
- Cliquer "Merge pull request"
- Supprimer la feature branch
- Tirer la dernière version de `develop`

```bash
git checkout develop
git pull origin develop
```

## 🔄 Situation: Tu veux intégrer les changements d'autres

```bash
# Si tu es sur ta feature branch
git pull origin develop  # Récupérer les changements

# Ou merge manuellement
git merge develop

# S'il y a des conflits, les résoudre puis:
git add .
git commit -m "merge: resolved conflicts from develop"
git push origin feature/ton-feature
```

## 🚨 Erreurs Courantes & Solutions

### ❌ "Permission denied (publickey)"
```bash
# Vérifier la clé SSH
ssh -T git@github.com

# Ajouter la clé
ssh-add ~/.ssh/id_rsa
```

### ❌ "Conflict in index.js"
```bash
# Ouvrir le fichier et régler manuellement
# Puis:
git add index.js
git commit -m "resolve: merge conflicts"
git push
```

### ❌ "Cannot push to main"
```bash
# main est protégée, crée une PR depuis develop instead
git checkout develop
git push origin develop
# Puis PR sur GitHub
```

## 📋 Checklist avant Pull Request

- [ ] Code compilé/exécuté localement ✅
- [ ] Tests écrits et passent ✅
- [ ] Pas de console.log/debug code ✅
- [ ] Documentation mise à jour ✅
- [ ] Commits ont des messages clairs ✅
- [ ] Pas de merge de `main` ou `develop` directement ✅

## 🎯 Communication Inter-Équipes

**Backend API change?**
→ Notifier le Dev Frontend avec la spec API mis à jour

**Frontend a besoin d'un nouveau endpoint?**
→ Créer une issue GitHub et décrire le besoin

**Bug trouvé en prod?**
→ Créer une branche `hotfix/nom-bug` depuis `main`, réparer, merger sur `main` ET `develop`

---

## 👥 Rôles et Permissions

| Rôle | Repos | Permissions |
|------|-------|------------|
| **Chef** | Tous | Admin, peut merger sur main |
| **Dev 1** | backend/* | Push sur features, PR review |
| **Dev 2** | backend/* | Push sur features, PR review |
| **Dev 3** | backend/* | Push sur features, PR review |
| **Dev 4** | frontend/* | Push sur features, PR review |

---

**Questions? Demande au Chef du projet!**
