<?php

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

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Central API is running'
    ]);
});

Route::post('/tenants', function (Request $request) {
    return response()->json([
        'message' => 'Tenant registration endpoint - to be implemented'
    ]);
});

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
