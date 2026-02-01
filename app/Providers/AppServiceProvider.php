<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Define authorization gates
        Gate::define('manage-products', fn(User $user) => 
            in_array($user->role, ['admin', 'manager'])
        );

        Gate::define('manage-categories', fn(User $user) => 
            in_array($user->role, ['admin', 'manager'])
        );

        Gate::define('manage-brands', fn(User $user) => 
            in_array($user->role, ['admin', 'manager'])
        );

        Gate::define('manage-orders', fn(User $user) => 
            in_array($user->role, ['admin', 'manager', 'support'])
        );

        Gate::define('manage-users', fn(User $user) => 
            $user->role === 'admin'
        );

        Gate::define('manage-coupons', fn(User $user) => 
            in_array($user->role, ['admin', 'manager'])
        );

        Gate::define('manage-content', fn(User $user) => 
            in_array($user->role, ['admin', 'manager'])
        );

        Gate::define('view-analytics', fn(User $user) => 
            in_array($user->role, ['admin', 'manager'])
        );
    }
}
