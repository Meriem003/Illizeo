<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TenantUserSeeder extends Seeder
{
    public function run(): void
    {
        $tenants = Tenant::all();

        foreach ($tenants as $tenant) {
            tenancy()->initialize($tenant);

            if ($tenant->id === 'acme') {
                User::create([
                    'name' => 'Charlie Employee',
                    'email' => 'charlie@acme.com',
                    'password' => Hash::make('password123'),
                    'is_admin' => false,
                ]);

                User::create([
                    'name' => 'Diana Worker',
                    'email' => 'diana@acme.com',
                    'password' => Hash::make('password123'),
                    'is_admin' => false,
                ]);

                $this->command->info("Utilisateurs créés pour {$tenant->company_name}");
            } elseif ($tenant->id === 'techcorp') {
                User::create([
                    'name' => 'Eve Developer',
                    'email' => 'eve@techcorp.com',
                    'password' => Hash::make('password123'),
                    'is_admin' => false,
                ]);

                User::create([
                    'name' => 'Frank Designer',
                    'email' => 'frank@techcorp.com',
                    'password' => Hash::make('password123'),
                    'is_admin' => false,
                ]);

                $this->command->info("Utilisateurs créés pour {$tenant->company_name}");
            }

            tenancy()->end();
        }

        $this->command->info('Tous les utilisateurs de test ont été créés !');
    }
}
