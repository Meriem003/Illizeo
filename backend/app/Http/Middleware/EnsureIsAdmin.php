<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureIsAdmin
{
    /**
     * Handle an incoming request.
     * Vérifie que l'utilisateur authentifié est un administrateur.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->is_admin) {
            return response()->json([
                'message' => 'Non autorisé. Action réservée aux administrateurs.',
            ], 403);
        }

        return $next($request);
    }
}
