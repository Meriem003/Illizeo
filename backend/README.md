# Illizeo - Multi-Tenant Team Board

Plateforme SaaS multi-tenant (Laravel 11 + stancl/tenancy) avec gestion d'utilisateurs et système d'annonces.

## Installation

```bash
git clone https://github.com/Meriem003/Illizeo
cd Illizeo/backend
composer install
cp .env.example .env
php artisan key:generate
```

## Configuration

Éditez `.env` :
```env
DB_CONNECTION=mysql
DB_DATABASE=illizeo_central
DB_USERNAME=root
DB_PASSWORD=
```

Ajoutez à votre fichier hosts (`C:\Windows\System32\drivers\etc\hosts`) :
```
127.0.0.1 acme.localhost
127.0.0.1 techcorp.localhost
```

## Setup Database

```bash
php artisan migrate:fresh --seed
php artisan serve
```

## Identifiants de Test

| Tenant | Domain | Email | Password | Rôle |
|--------|--------|-------|----------|------|
| Acme | acme.localhost:8000 | alice@acme.com | password123 | Admin |
| Acme | acme.localhost:8000 | charlie@acme.com | password123 | User |
| TechCorp | techcorp.localhost:8000 | bob@techcorp.com | password123 | Admin |
| TechCorp | techcorp.localhost:8000 | eve@techcorp.com | password123 | User |

## Routes API

### Central (localhost:8000)
- `POST /api/register-tenant` - Créer un tenant

### Tenant (ex: acme.localhost:8000)
- `POST /api/auth/login` - Connexion
- `GET /api/users` - Liste utilisateurs
- `POST /api/users` - Créer utilisateur (Admin only)
- `DELETE /api/users/{id}` - Supprimer utilisateur (Admin only)
- `GET /api/announcements` - Liste annonces
- `POST /api/announcements` - Créer annonce
- `PUT /api/announcements/{id}` - Modifier annonce (Auteur only)
- `DELETE /api/announcements/{id}` - Supprimer annonce (Auteur only)

## Architecture

- **Multi-Tenant:** Database per tenant avec isolation physique
- **Auth:** Laravel Sanctum
- **Policies:** AnnouncementPolicy (un user ne peut modifier/supprimer que ses propres annonces)
