<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of users (admin only)
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Search by name or email
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->filled('role')) {
            $query->where('role', $request->input('role'));
        }

        // Filter by status
        if ($request->filled('status')) {
            $status = $request->input('status');
            $query->where('is_active', $status === 'active');
        }

        // Sort
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $users = $query->paginate(15);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'status', 'sort_by', 'sort_order']),
        ]);
    }

    /**
     * Display the specified user
     */
    public function show(User $user)
    {
        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
        ]);
    }

    /**
     * Update user status (activate/deactivate)
     */
    public function updateStatus(Request $request, User $user)
    {
        $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $user->update([
            'is_active' => $request->input('is_active'),
        ]);

        return redirect()->back()->with('success', 'User status updated successfully.');
    }

    /**
     * Update user role (admin only)
     */
    public function updateRole(Request $request, User $user)
    {
        // Prevent admin from removing their own admin privileges
        if (auth()->id() === $user->id && $request->input('role') === 'customer') {
            return redirect()->back()->with('error', 'You cannot remove your own admin privileges.');
        }

        $request->validate([
            'role' => 'required|in:customer,admin,manager,support',
        ]);

        $user->update([
            'role' => $request->input('role'),
        ]);

        return redirect()->back()->with('success', 'User role updated successfully.');
    }

    /**
     * Delete user (admin only)
     */
    public function destroy(User $user)
    {
        // Prevent deleting the current user
        if (auth()->id() === $user->id) {
            return redirect()->back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
    }
}
