<?php

use App\Http\Controllers\BrandController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WishlistController;
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

    // Cart routes
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::post('/cart/toggle', [CartController::class, 'toggle'])->name('cart.toggle');
    Route::put('/cart/{cartItemId}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cartItemId}', [CartController::class, 'destroy'])->name('cart.destroy');
    Route::post('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');

    // Wishlist routes
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
    Route::post('/wishlist', [WishlistController::class, 'store'])->name('wishlist.store');
    Route::post('/wishlist/toggle', [WishlistController::class, 'toggle'])->name('wishlist.toggle');
    Route::delete('/wishlist/{wishlistItemId}', [WishlistController::class, 'destroy'])->name('wishlist.destroy');
    Route::post('/wishlist/{wishlistItemId}/move-to-cart', [WishlistController::class, 'moveToCart'])->name('wishlist.moveToCart');
    Route::post('/wishlist/clear', [WishlistController::class, 'clear'])->name('wishlist.clear');
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
