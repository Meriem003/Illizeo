<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Début du seeding de la base de données...');
        $this->command->newLine();

        $this->command->info('Création des tenants...');
        $this->call(TenantSeeder::class);
        $this->command->newLine();

        $this->command->info('Création des utilisateurs...');
        $this->call(TenantUserSeeder::class);
        $this->command->newLine();

        $this->command->info('Création des annonces...');
        $this->call(AnnouncementSeeder::class);
        $this->command->newLine();

        $this->command->info('Seeding terminé avec succès !');
        $this->command->newLine();
        $this->command->info('Identifiants de connexion :');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('Acme Corporation (acme.localhost)');
        $this->command->info('   Admin: alice@acme.com / password123');
        $this->command->info('   Users: charlie@acme.com, diana@acme.com / password123');
        $this->command->newLine();
        $this->command->info('Tech Corp (techcorp.localhost)');
        $this->command->info('   Admin: bob@techcorp.com / password123');
        $this->command->info('   Users: eve@techcorp.com, frank@techcorp.com / password123');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
}
