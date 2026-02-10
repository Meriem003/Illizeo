<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        $tenants = Tenant::all();

        foreach ($tenants as $tenant) {
            tenancy()->initialize($tenant);

            $users = User::all();

            if ($users->isEmpty()) {
                $this->command->warn("Aucun utilisateur trouvé pour {$tenant->company_name}");
                tenancy()->end();
                continue;
            }

            foreach ($users as $user) {
                Announcement::create([
                    'user_id' => $user->id,
                    'title' => "Annonce de {$user->name}",
                    'content' => "Ceci est une annonce de test créée par {$user->name} pour démontrer le système d'annonces multi-tenant.",
                ]);
            }

            $firstUser = $users->first();
            Announcement::create([
                'user_id' => $firstUser->id,
                'title' => 'Bienvenue dans ' . $tenant->company_name,
                'content' => 'Bienvenue dans notre espace de travail collaboratif ! Vous pouvez publier des annonces et collaborer avec votre équipe.',
            ]);

            $this->command->info(" Annonces créées pour {$tenant->company_name}");

            tenancy()->end();
        }

        $this->command->info(' Toutes les annonces de test ont été créées !');
    }
}
