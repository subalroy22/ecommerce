<?php

namespace App\Repositories;

use App\Models\Product;
use App\Models\User;
use App\Models\WishlistItem;
use Illuminate\Database\Eloquent\Collection;

class WishlistRepository
{
    /**
     * Get all wishlist items for a user.
     */
    public function getByUser(User $user): Collection
    {
        return WishlistItem::where('user_id', $user->id)
            ->with(['product' => function ($query) {
                $query->with('images');
            }])
            ->get();
    }

    /**
     * Find a specific wishlist item for a user and product.
     */
    public function findByUserAndProduct(User $user, Product $product): ?WishlistItem
    {
        return WishlistItem::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();
    }

    /**
     * Add a wishlist item.
     */
    public function add(User $user, Product $product): WishlistItem
    {
        return WishlistItem::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);
    }

    /**
     * Remove a wishlist item.
     */
    public function delete(WishlistItem $wishlistItem): bool
    {
        return $wishlistItem->delete();
    }

    /**
     * Clear all wishlist items for a user.
     */
    public function clearByUser(User $user): void
    {
        WishlistItem::where('user_id', $user->id)->delete();
    }

    /**
     * Get wishlist item by ID.
     */
    public function findById(int $id): ?WishlistItem
    {
        return WishlistItem::with(['product' => function ($query) {
            $query->with('images');
        }])->find($id);
    }

    /**
     * Get wishlist item count for user.
     */
    public function getCount(User $user): int
    {
        return WishlistItem::where('user_id', $user->id)->count();
    }

    /**
     * Check if product is in user's wishlist.
     */
    public function isInWishlist(User $user, Product $product): bool
    {
        return $this->findByUserAndProduct($user, $product) !== null;
    }
}
