<?php

namespace App\Http\Controllers;

use App\Services\AnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected AnalyticsService $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Display the dashboard
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $isAdmin = $user && ($user->role === 'admin' || $user->role === 'manager');

        $stats = [];

        if ($isAdmin) {
            // Get comprehensive analytics data
            $stats = $this->analyticsService->getDashboardData();
        }

        return Inertia::render('Dashboard', ['stats' => $stats]);
    }
}
