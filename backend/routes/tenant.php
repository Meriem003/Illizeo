<?php

declare(strict_types=1);

use App\Http\Controllers\Tenant\AuthController;
use App\Http\Controllers\Tenant\UserController;
use App\Http\Controllers\Tenant\AnnouncementController;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;


Route::middleware([
    'api',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->prefix('api')->group(function () {
    
    Route::get('/health', function () {
        return response()->json([
            'status' => 'ok',
            'tenant_id' => tenant('id'),
            'company' => tenant('company_name'),
        ]);
    });

    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
        Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');
    });

    Route::middleware('auth:sanctum')->group(function () {
        
        Route::apiResource('users', UserController::class)->except(['update']);        
        Route::apiResource('announcements', AnnouncementController::class);
    });
});