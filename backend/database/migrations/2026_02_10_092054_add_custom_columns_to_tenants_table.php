<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            // Ajouter company_name si elle n'existe pas
            if (!Schema::hasColumn('tenants', 'company_name')) {
                $table->string('company_name')->after('id');
            }
            
            // Ajouter domain si elle n'existe pas
            if (!Schema::hasColumn('tenants', 'domain')) {
                $table->string('domain')->unique()->after('company_name');
            }
        });
    }

    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropColumn(['company_name', 'domain']);
        });
    }
};