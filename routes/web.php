<?php

use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [ProductController::class, 'index'])->name('home');

Route::get('/dashboard', function () {
    $user = auth()->user();
    $isAdmin = $user && ($user->role === 'admin' || $user->role === 'manager');
    
    $stats = [];
    
    if ($isAdmin) {
        // Get admin statistics
        $stats = [
            'total_products' => \App\Models\Product::count(),
            'active_products' => \App\Models\Product::where('is_active', true)->count(),
            'low_stock_products' => \App\Models\Product::where('inventory_quantity', '<=', 10)->where('inventory_quantity', '>', 0)->count(),
            'out_of_stock_products' => \App\Models\Product::where('inventory_quantity', 0)->count(),
            'total_categories' => \App\Models\Category::count(),
            'active_categories' => \App\Models\Category::where('is_active', true)->count(),
            'total_brands' => \App\Models\Brand::count(),
            'active_brands' => \App\Models\Brand::where('is_active', true)->count(),
            'total_users' => \App\Models\User::count(),
            'total_value' => \App\Models\Product::sum(\DB::raw('price * inventory_quantity')),
        ];
    }
    
    return Inertia::render('Dashboard', ['stats' => $stats]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Public product detail and category/brand pages
Route::get('/product/{product:slug}', [ProductController::class, 'show'])->name('product.show');
Route::get('/category/{category:slug}', [CategoryController::class, 'show'])->name('category.show');
Route::get('/brand/{brand:slug}', [BrandController::class, 'show'])->name('brand.show');

// Admin routes - protected by role middleware
Route::middleware(['auth', 'role:admin,manager'])->prefix('admin')->name('admin.')->group(function () {
    // Product management
    Route::resource('products', ProductController::class);
    
    // Category management
    Route::resource('categories', CategoryController::class)->except(['show']);
    
    // Brand management
    Route::resource('brands', BrandController::class)->except(['show']);
});

require __DIR__.'/auth.php';
