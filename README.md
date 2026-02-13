# Illizeo - Plateforme Multi-Tenant SaaS

Application SaaS collaborative permettant à chaque entreprise de créer son espace de travail isolé avec gestion d'équipe et d'annonces.

## Vue d'ensemble

**Illizeo** est une plateforme multi-tenant où chaque entreprise dispose de :
- Sa propre base de données isolée (isolation physique)
- Son propre domaine (ex: `Illizeo.localhost`)
- Ses utilisateurs (administrateurs et employés)
- Son espace d'annonces collaboratives

## Architecture

### Backend - Laravel 11
- **Framework:** Laravel 11 avec architecture API REST
- **Multi-tenancy:** `stancl/tenancy` pour l'isolation par base de données
- **Authentification:** Laravel Sanctum (tokens API)
- **Authorization:** Laravel Policies pour les permissions granulaires
- **Documentation:** Swagger (L5-Swagger)

**Fonctionnement:**
- Routes **centrales** (api.php) : inscription tenant
- Routes **tenant** (tenant.php) : auth, users, annonces
- Middleware `InitializeTenancyByDomain` pour détecter le tenant

### Frontend - React 19
- **Framework:** React 
- **Routing:** React Router v7
- **Styling:** TailwindCSS avec design system personnalisé
- **HTTP Client:** Axios avec intercepteurs
- **State Management:** Context API (AuthContext)

**Architecture:**
- `AuthPage` : Formulaire combiné login/register
- `Dashboard` : Flux d'annonces avec CRUD
- `Users` : Gestion d'équipe (admin seulement)
- `AuthContext` : Gestion de l'état d'authentification

## Fonctionnalités Principales

### Multi-tenancy
- **Isolation physique** : Chaque tenant = 1 base de données MySQL
- **Domaines uniques** : `entreprise.localhost`
- **Détection automatique** : Middleware résout le tenant via le domaine

### Gestion Utilisateurs
- **Rôles** : Admin (full access) / Employé (lecture + création)
- **CRUD Utilisateurs** : Réservé aux administrateurs
- **Protection** : Un admin ne peut pas se supprimer

### Système d'Annonces
- **Création** : Tous les utilisateurs authentifiés
- **Lecture** : Toutes les annonces visibles par tous
- **Modification/Suppression** : Réservée à l'auteur uniquement
- **Policies Laravel** : `AnnouncementPolicy` applique les règles

## Installation

### Prérequis
- PHP 8.2+, Composer
- Node.js 18+, npm
- MySQL
- Git

### 1. Backend

```bash
cd backend
composer install
cp .env.example .env
# Configurer DB_* dans .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve --port=8000
```

### 2. Frontend

```bash
cd frontend-React
npm install
npm run dev
# Démarre sur http://localhost:5174
```

## �️ Structure

```
Illizeo/
├── backend/                    # API Laravel
│   ├── app/Http/Controllers/
│   │   ├── Api/               # Routes centrales (tenant registration)
│   │   └── Tenant/            # Routes tenant (auth, users, announcements)
│   ├── app/Models/            # Tenant, User, Announcement
│   ├── app/Policies/          # AnnouncementPolicy
│   ├── routes/
│   │   ├── api.php           # Routes centrales
│   │   └── tenant.php        # Routes tenant-specific
│   └── database/migrations/  # Migrations central + tenant
│
└── frontend-React/            # SPA React
    ├── src/
    │   ├── components/       # Navbar, Sidebar, ProtectedRoute
    │   ├── contexts/         # AuthContext
    │   ├── pages/           # AuthPage, Dashboard, Users
    │   ├── services/        # authService, announcementService
    │   └── utils/           # Helpers, constantes
    └── tailwind.config.js   # Design system
```

## API Endpoints

### Central (`localhost:8000/api`)
- `POST /register-tenant` - Créer nouveau tenant + admin

### Tenant (`{tenant}.localhost:8000/api`)
**Auth:** `POST /auth/login`, `POST /auth/logout`, `GET /auth/user`  
**Users (Admin):** `GET /users`, `POST /users`, `DELETE /users/{id}`  
**Announcements:** `GET`, `POST`, `PUT /{id}`, `DELETE /{id}`

## Sécurité

- **Multi-tenancy:** Isolation base de données + middleware `InitializeTenancyByDomain`
- **Auth:** Laravel Sanctum avec tokens stateless
- **Policies:** `AnnouncementPolicy` - seul l'auteur modifie/supprime
- **Validation:** Admin ne peut pas se supprimer

---

**Développé par** meryem salhi | **Projet** Illizeo Multi-Tenant Test technique 
