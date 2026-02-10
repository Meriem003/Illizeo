<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class AnnouncementController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $announcements = Announcement::with('user:id,name,email')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json([
            'announcements' => $announcements,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
        ]);

        $announcement = $request->user()->announcements()->create([
            'title' => $validated['title'],
            'content' => $validated['content'],
        ]);
        $announcement->load('user:id,name,email');
        return response()->json([
            'message' => 'Annonce créée avec succès',
            'announcement' => $announcement,
        ], 201);
    }

    public function show(Announcement $announcement)
    {
        $announcement->load('user:id,name,email');
        return response()->json([
            'announcement' => $announcement,
        ]);
    }

    public function update(Request $request, Announcement $announcement)
    {
        $this->authorize('update', $announcement);
        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'content' => ['sometimes', 'string'],
        ]);

        $announcement->update($validated);
        $announcement->load('user:id,name,email');

        return response()->json([
            'message' => 'Annonce mise à jour avec succès',
            'announcement' => $announcement,
        ]);
    }

    public function destroy(Request $request, Announcement $announcement)
    {
        $this->authorize('delete', $announcement);
        $announcement->delete();
        return response()->json([
            'message' => 'Annonce supprimée avec succès',
        ]);
    }
}
