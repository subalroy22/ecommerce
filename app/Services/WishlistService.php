<?php

namespace App\Services;

use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use App\Models\WishlistItem;
use App\Repositories\CartRepository;
use App\Repositories\WishlistRepository;
use Illuminate\Database\Eloquent\Collection;

class WishlistService
{
    public function __construct(
        protected WishlistRepository $wishlistRepository,
        protected CartRepository $cartRepository,
        protected ProductService $productService
    ) {}

    /**
     * Get all wishlist items for a user.
     */
    public function getWishlist(User $user): Collection
    {
        return $this->wishlistRepository->getByUser($user);
    }

    /**
     * Add a product to wishlist.
     */
    public function addItem(User $user, int $productId): WishlistItem
    {
        $product = $this->productService->getProductById($productId);

        if (!$product) {
            throw new \Exception('Product not found');
        }

        if ($this->wishlistRepository->isInWishlist($user, $product)) {
            throw new \Exception('Product already in wishlist');
        }

        return $this->wishlistRepository->add($user, $product);
    }

    /**
     * Remove a wishlist item.
     */
    public function removeItem(User $user, int $wishlistItemId): bool
    {
        $wishlistItem = $this->wishlistRepository->findById($wishlistItemId);

        if (!$wishlistItem || $wishlistItem->user_id !== $user->id) {
            throw new \Exception('Wishlist item not found');
        }

        return $this->wishlistRepository->delete($wishlistItem);
    }

    /**
     * Move a wishlist item to cart.
     */
    public function moveToCart(User $user, int $wishlistItemId, int $quantity = 1): CartItem
    {
        $wishlistItem = $this->wishlistRepository->findById($wishlistItemId);

        if (!$wishlistItem || $wishlistItem->user_id !== $user->id) {
            throw new \Exception('Wishlist item not found');
        }

        $product = $wishlistItem->product;

        if (!$this->productService->checkAvailability($product, $quantity)) {
            throw new \Exception('Insufficient inventory');
        }

        // Add to cart
        $cartItem = $this->cartRepository->addOrUpdate($user, $product, $quantity);

        // Remove from wishlist
        $this->wishlistRepository->delete($wishlistItem);

        return $cartItem;
    }

    /**
     * Clear the entire wishlist.
     */
    public function clearWishlist(User $user): void
    {
        $this->wishlistRepository->clearByUser($user);
    }

    /**
     * Get wishlist item count.
     */
    public function getCount(User $user): int
    {
        return $this->wishlistRepository->getCount($user);
    }

    /**
     * Check if product is in wishlist.
     */
    public function isInWishlist(User $user, int $productId): bool
    {
        $product = $this->productService->getProductById($productId);
        if (!$product) {
            return false;
        }
        return $this->wishlistRepository->isInWishlist($user, $product);
    }

    /**
     * Toggle a product in wishlist (add if not present, remove if present).
     */
    public function toggleItem(User $user, int $productId): array
    {
        $product = $this->productService->getProductById($productId);

        if (!$product) {
            throw new \Exception('Product not found');
        }

        $wishlistItem = $this->wishlistRepository->findByUserAndProduct($user, $product);

        if ($wishlistItem) {
            // Remove from wishlist
            $this->wishlistRepository->delete($wishlistItem);
            return [
                'added' => false,
                'message' => 'Product removed from wishlist',
            ];
        } else {
            // Add to wishlist
            $this->wishlistRepository->add($user, $product);
            return [
                'added' => true,
                'message' => 'Product added to wishlist',
            ];
        }
    }

    /**
     * Get wishlist with formatted data for frontend.
     */
    public function getFormattedWishlist(User $user): array
    {
        $wishlistItems = $this->getWishlist($user);

        return [
            'items' => $wishlistItems->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'product_slug' => $item->product->slug,
                    'price' => $item->product->price,
                    'image' => $item->product->images->first()?->image_url,
                    'in_stock' => $item->product->inventory_quantity > 0,
                    'available_quantity' => $item->product->inventory_quantity,
                ];
            })->toArray(),
            'count' => count($wishlistItems),
        ];
    }
}
