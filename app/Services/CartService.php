<?php

namespace App\Services;

use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use App\Repositories\CartRepository;
use Illuminate\Database\Eloquent\Collection;

class CartService
{
    public function __construct(
        protected CartRepository $cartRepository,
        protected ProductService $productService
    ) {}

    /**
     * Get all cart items for a user.
     */
    public function getCart(User $user): Collection
    {
        return $this->cartRepository->getByUser($user);
    }

    /**
     * Add a product to cart.
     */
    public function addItem(User $user, int $productId, int $quantity = 1): CartItem
    {
        $product = $this->productService->getProductById($productId);

        if (!$product) {
            throw new \Exception('Product not found');
        }

        if (!$this->productService->checkAvailability($product, $quantity)) {
            throw new \Exception('Insufficient inventory');
        }

        return $this->cartRepository->addOrUpdate($user, $product, $quantity);
    }

    /**
     * Update cart item quantity.
     */
    public function updateQuantity(User $user, int $cartItemId, int $quantity): CartItem
    {
        $cartItem = $this->cartRepository->findById($cartItemId);

        if (!$cartItem || $cartItem->user_id !== $user->id) {
            throw new \Exception('Cart item not found');
        }

        if ($quantity <= 0) {
            throw new \Exception('Quantity must be greater than 0');
        }

        if (!$this->productService->checkAvailability($cartItem->product, $quantity)) {
            throw new \Exception('Insufficient inventory');
        }

        return $this->cartRepository->updateQuantity($cartItem, $quantity);
    }

    /**
     * Remove a cart item.
     */
    public function removeItem(User $user, int $cartItemId): bool
    {
        $cartItem = $this->cartRepository->findById($cartItemId);

        if (!$cartItem || $cartItem->user_id !== $user->id) {
            throw new \Exception('Cart item not found');
        }

        return $this->cartRepository->delete($cartItem);
    }

    /**
     * Clear the entire cart.
     */
    public function clearCart(User $user): void
    {
        $this->cartRepository->clearByUser($user);
    }

    /**
     * Calculate cart total.
     */
    public function calculateTotal(User $user): float
    {
        return $this->cartRepository->calculateTotal($user);
    }

    /**
     * Get cart item count.
     */
    public function getCount(User $user): int
    {
        return $this->cartRepository->getCount($user);
    }

    /**
     * Validate all cart items are available.
     */
    public function validateAvailability(User $user): array
    {
        $cartItems = $this->getCart($user);
        $unavailable = [];

        foreach ($cartItems as $item) {
            if (!$this->productService->checkAvailability($item->product, $item->quantity)) {
                $unavailable[] = [
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'requested_quantity' => $item->quantity,
                    'available_quantity' => $item->product->inventory_quantity,
                ];
            }
        }

        return $unavailable;
    }

    /**
     * Get cart with formatted data for frontend.
     */
    public function getFormattedCart(User $user): array
    {
        $cartItems = $this->getCart($user);
        $total = $this->calculateTotal($user);

        return [
            'items' => $cartItems->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'product_slug' => $item->product->slug,
                    'price' => $item->product->price,
                    'quantity' => $item->quantity,
                    'subtotal' => $item->product->price * $item->quantity,
                    'image' => $item->product->images->first()?->image_url,
                    'in_stock' => $item->product->inventory_quantity > 0,
                    'available_quantity' => $item->product->inventory_quantity,
                ];
            })->toArray(),
            'total' => $total,
            'count' => count($cartItems),
        ];
    }

    /**
     * Toggle a product in cart (add or remove).
     */
    public function toggleItem(User $user, int $productId, int $quantity = 1): array
    {
        $product = $this->productService->getProductById($productId);

        if (!$product) {
            throw new \Exception('Product not found');
        }

        $cartItem = $this->cartRepository->findByUserAndProduct($user, $product);

        if ($cartItem) {
            // Remove from cart
            $this->cartRepository->delete($cartItem);
            return [
                'added' => false,
                'message' => 'Product removed from cart',
            ];
        } else {
            // Add to cart
            if (!$this->productService->checkAvailability($product, $quantity)) {
                throw new \Exception('Insufficient inventory');
            }
            $this->cartRepository->addOrUpdate($user, $product, $quantity);
            return [
                'added' => true,
                'message' => 'Product added to cart',
            ];
        }
    }
}
