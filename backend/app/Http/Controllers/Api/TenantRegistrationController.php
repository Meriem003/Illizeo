<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class TenantRegistrationController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'domain' => [
                'required', 
                'string', 
                'max:255', 
                'alpha_dash',
                'unique:tenants,domain',
                'unique:domains,domain'
            ],
            'admin_name' => ['required', 'string', 'max:255'],
            'admin_email' => ['required', 'string', 'email', 'max:255'],
            'admin_password' => ['required', 'confirmed', Password::defaults()],
        ]);

        if ($this->emailExistsInAnyTenant($validated['admin_email'])) {
            throw ValidationException::withMessages([
                'admin_email' => ['This email address is already registered.']
            ]);
        }
        
        try {
            $tenant = Tenant::create([
                'id' => $validated['domain'], 
                'company_name' => $validated['company_name'],
                'domain' => $validated['domain'],
            ]);

            $tenant->domains()->create([
                'domain' => $validated['domain'] . '.localhost'
            ]);

            tenancy()->initialize($tenant);
            
            $adminUser = \App\Models\User::create([
                'name' => $validated['admin_name'],
                'email' => $validated['admin_email'],
                'password' => Hash::make($validated['admin_password']),
                'is_admin' => true,
            ]);

            tenancy()->end();

            return response()->json([
                'message' => 'Tenant registered successfully',
                'tenant' => [
                    'id' => $tenant->id,
                    'company_name' => $tenant->company_name,
                    'domain' => $validated['domain'] . '.localhost',
                ],
                'admin' => [
                    'name' => $adminUser->name,
                    'email' => $adminUser->email,
                ],
            ], 201);

        } catch (\Exception $e) {
            tenancy()->end();
            
            if (isset($tenant)) {
                try {
                    $tenant->delete();
                } catch (\Exception $deleteException) {
                    // Ignore cleanup errors
                }
            }

            return response()->json([
                'message' => 'Failed to register tenant',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred during registration'
            ], 500);
        }
    }

    private function emailExistsInAnyTenant(string $email): bool
    {
        $tenants = Tenant::all();
        
        foreach ($tenants as $tenant) {
            tenancy()->initialize($tenant);
            
            $exists = \App\Models\User::where('email', $email)->exists();
            
            tenancy()->end();
            
            if ($exists) {
                return true;
            }
        }
        
        return false;
    }
}
