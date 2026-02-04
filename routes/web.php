<?php

use App\Http\Controllers\BrandController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WishlistController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [ProductController::class, 'index'])->name('home');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

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

    // Order routes
    Route::get('/checkout', [OrderController::class, 'checkout'])->name('checkout.index');
    Route::post('/orders', [OrderController::class, 'store'])->name('order.store');
    Route::get('/orders', [OrderController::class, 'index'])->name('order.index');
    Route::get('/orders/{order:order_number}', [OrderController::class, 'show'])->name('order.show');
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

    // Order management
    Route::get('orders', [OrderController::class, 'adminIndex'])->name('orders.index');
    Route::get('orders/{order:order_number}', [OrderController::class, 'adminShow'])->name('orders.show');
    Route::patch('orders/{order:order_number}/status', [OrderController::class, 'updateStatus'])->name('orders.updateStatus');
    Route::patch('orders/{order:order_number}/payment-status', [OrderController::class, 'updatePaymentStatus'])->name('orders.updatePaymentStatus');
    Route::post('orders/{order:order_number}/refund', [OrderController::class, 'refund'])->name('orders.refund');

    // User management (admin only)
    Route::middleware('role:admin')->group(function () {
        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::get('users/{user}', [UserController::class, 'show'])->name('users.show');
        Route::patch('users/{user}/status', [UserController::class, 'updateStatus'])->name('users.updateStatus');
        Route::patch('users/{user}/role', [UserController::class, 'updateRole'])->name('users.updateRole');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });
});

require __DIR__.'/auth.php';
