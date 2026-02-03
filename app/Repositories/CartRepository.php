<?php

namespace App\Repositories;

use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class CartRepository
{
    /**
     * Get all cart items for a user.
     */
    public function getByUser(User $user): Collection
    {
        return CartItem::where('user_id', $user->id)
            ->with(['product' => function ($query) {
                $query->with('images');
            }])
            ->get();
    }

    /**
     * Find a specific cart item for a user and product.
     */
    public function findByUserAndProduct(User $user, Product $product): ?CartItem
    {
        return CartItem::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();
    }

    /**
     * Add or update a cart item.
     */
    public function addOrUpdate(User $user, Product $product, int $quantity): CartItem
    {
        $cartItem = $this->findByUserAndProduct($user, $product);

        if ($cartItem) {
            $cartItem->update(['quantity' => $quantity]);
            return $cartItem;
        }

        return CartItem::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => $quantity,
        ]);
    }

    /**
     * Update cart item quantity.
     */
    public function updateQuantity(CartItem $cartItem, int $quantity): CartItem
    {
        $cartItem->update(['quantity' => $quantity]);
        return $cartItem->fresh();
    }

    /**
     * Remove a cart item.
     */
    public function delete(CartItem $cartItem): bool
    {
        return $cartItem->delete();
    }

    /**
     * Clear all cart items for a user.
     */
    public function clearByUser(User $user): void
    {
        CartItem::where('user_id', $user->id)->delete();
    }

    /**
     * Get cart item by ID.
     */
    public function findById(int $id): ?CartItem
    {
        return CartItem::with(['product' => function ($query) {
            $query->with('images');
        }])->find($id);
    }

    /**
     * Calculate total for user's cart.
     */
    public function calculateTotal(User $user): float
    {
        return CartItem::where('user_id', $user->id)
            ->with('product')
            ->get()
            ->sum(function ($item) {
                return $item->product->price * $item->quantity;
            });
    }

    /**
     * Get cart item count for user.
     */
    public function getCount(User $user): int
    {
        return CartItem::where('user_id', $user->id)->count();
    }
}
