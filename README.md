# 🏢 Illizeo - Multi-Tenant Team Board

Plateforme SaaS multi-tenant permettant aux entreprises de créer des espaces de travail privés pour leurs équipes.

## 🎯 Fonctionnalités

- **Multi-Tenancy:** Isolation physique des données (1 BDD par entreprise)
- **Gestion d'équipe:** Administrateurs peuvent ajouter des employés
- **Annonces collaboratives:** Partage d'informations avec contrôle d'accès
- **Autorisation granulaire:** Seul l'auteur peut modifier/supprimer ses annonces

## 🛠️ Stack Technique

- **Backend:** Laravel 11 + stancl/tenancy + Laravel Sanctum
- **Frontend:** React 19 + Vite 7 + TailwindCSS
- **Base de données:** MySQL (multi-tenant, database per tenant)

## 🚀 Installation Rapide

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve --port=8000
```

### Frontend

```bash
cd frontend-React
npm install
npm run dev
```

## 🔑 Identifiants de Test

| Entreprise | URL | Email | Mot de passe | Rôle |
|-----------|-----|-------|--------------|------|
| **Acme Corp** | http://acme.localhost:8000 | alice@acme.com | password123 | Admin |
| Acme Corp | http://acme.localhost:8000 | charlie@acme.com | password123 | Employé |
| **TechCorp** | http://techcorp.localhost:8000 | bob@techcorp.com | password123 | Admin |
| TechCorp | http://techcorp.localhost:8000 | eve@techcorp.com | password123 | Employé |

## 📁 Structure du Projet

```
Illizeo/
├── backend/              # API Laravel + Multi-Tenancy
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── Api/      # Controllers centraux (registration)
│   │   │   └── Tenant/   # Controllers tenant (auth, users, announcements)
│   │   ├── Models/
│   │   └── Policies/     # Autorisations (AnnouncementPolicy)
│   ├── routes/
│   │   ├── api.php       # Routes centrales
│   │   └── tenant.php    # Routes tenant
│   └── database/
│       ├── migrations/
│       └── seeders/
│
└── frontend-React/       # Application React
    ├── src/
    │   ├── components/   # Composants réutilisables
    │   ├── contexts/     # Context React (Auth)
    │   ├── hooks/        # Custom hooks
    │   ├── layouts/      # Layouts (Dashboard, Auth)
    │   ├── pages/        # Pages (Login, Dashboard, Users)
    │   ├── services/     # API services
    │   └── utils/        # Utilitaires, constantes
    └── public/
```

## 🔗 Routes API

### Central (http://localhost:8000/api)
- `POST /register-tenant` - Créer un nouveau tenant

### Tenant (http://acme.localhost:8000/api)

**Authentification:**
- `POST /auth/login` - Connexion
- `POST /auth/logout` - Déconnexion
- `GET /auth/user` - Utilisateur connecté

**Utilisateurs (Admin only):**
- `GET /users` - Liste des employés
- `POST /users` - Créer un employé
- `DELETE /users/{id}` - Supprimer un employé

**Annonces:**
- `GET /announcements` - Toutes les annonces
- `POST /announcements` - Créer (authentifié)
- `PUT /announcements/{id}` - Modifier (auteur uniquement)
- `DELETE /announcements/{id}` - Supprimer (auteur uniquement)

## 🔐 Politique d'Autorisation

### Règles Implémentées

1. **Utilisateurs:**
   - Seuls les **administrateurs** peuvent créer/supprimer des utilisateurs
   - Un admin ne peut pas se supprimer lui-même

2. **Annonces:**
   - Tous les utilisateurs peuvent **voir** toutes les annonces
   - Tous les utilisateurs peuvent **créer** des annonces
   - Seul l'**auteur** peut **modifier** ou **supprimer** sa propre annonce

## 🎨 Interface Utilisateur

- **Login:** Authentification avec gestion d'erreurs
- **Dashboard:** Flux d'annonces avec création/édition/suppression
- **Users (Admin):** Gestion des employés avec modal d'ajout
- **UI Conditionnelle:** Boutons Modifier/Supprimer visibles uniquement pour l'auteur

Test technique réalisé pour **Illizeo**