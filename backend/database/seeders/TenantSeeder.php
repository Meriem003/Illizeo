<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TenantSeeder extends Seeder
{
    public function run(): void
    {
        $tenant1 = Tenant::create([
            'id' => 'acme',
            'company_name' => 'Acme Corporation',
            'domain' => 'acme',
        ]);

        $tenant1->domains()->create([
            'domain' => 'acme.localhost'
        ]);

        tenancy()->initialize($tenant1);
        
        User::create([
            'name' => 'Alice Admin',
            'email' => 'alice@acme.com',
            'password' => Hash::make('password123'),
            'is_admin' => true,
        ]);

        tenancy()->end();

        $tenant2 = Tenant::create([
            'id' => 'techcorp',
            'company_name' => 'Tech Corp',
            'domain' => 'techcorp',
        ]);

        $tenant2->domains()->create([
            'domain' => 'techcorp.localhost'
        ]);

        tenancy()->initialize($tenant2);
        
        User::create([
            'name' => 'Bob Manager',
            'email' => 'bob@techcorp.com',
            'password' => Hash::make('password123'),
            'is_admin' => true,
        ]);

        tenancy()->end();

        $this->command->info('Tenants créés avec succès !');
        $this->command->info('Acme: acme.localhost - alice@acme.com / password123');
        $this->command->info('TechCorp: techcorp.localhost - bob@techcorp.com / password123');
    }
}
