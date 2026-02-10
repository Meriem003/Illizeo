<?php

use App\Http\Controllers\Api\TenantRegistrationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Central API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register central API routes for your application.
| These routes are loaded by the RouteServiceProvider and will be assigned
| to the "api" middleware group. This is for central (non-tenant) routes.
|
*/

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Central API is running'
    ]);
});

// Tenant registration endpoint (Central)
Route::post('/tenants', [TenantRegistrationController::class, 'register']);

// Authentication test endpoints (SPA)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json($request->user());
});

Route::middleware('auth:sanctum')->get('/test-auth', function (Request $request) {
    return response()->json([
        'authenticated' => true,
        'user' => $request->user(),
        'message' => 'You are authenticated!'
    ]);
});

