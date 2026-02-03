<?php

namespace App\Http\Controllers;

use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function __construct(
        protected CartService $cartService
    ) {}

    /**
     * Display the shopping cart.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $cartData = $this->cartService->getFormattedCart($user);

        return Inertia::render('Cart/Index', [
            'cart' => $cartData,
        ]);
    }

    /**
     * Add a product to cart.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'required|integer|min:1|max:100',
        ]);

        try {
            $this->cartService->addItem(
                $request->user(),
                $validated['product_id'],
                $validated['quantity']
            );

            $cartCount = $this->cartService->getCount($request->user());

            return redirect()->back()
                ->with('success', 'Product added to cart successfully.')
                ->with('cartCount', $cartCount);
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Toggle a product in cart (add or remove).
     */
    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'nullable|integer|min:1|max:100',
        ]);

        try {
            $result = $this->cartService->toggleItem(
                $request->user(),
                $validated['product_id'],
                $validated['quantity'] ?? 1
            );

            $cartCount = $this->cartService->getCount($request->user());

            return response()->json([
                'success' => true,
                'added' => $result['added'],
                'message' => $result['message'],
                'cartCount' => $cartCount,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Update cart item quantity.
     */
    public function update(Request $request, int $cartItemId)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1|max:100',
        ]);

        try {
            $this->cartService->updateQuantity(
                $request->user(),
                $cartItemId,
                $validated['quantity']
            );

            $cartCount = $this->cartService->getCount($request->user());

            return redirect()->back()
                ->with('success', 'Cart updated successfully.')
                ->with('cartCount', $cartCount);
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Remove a cart item.
     */
    public function destroy(Request $request, int $cartItemId)
    {
        try {
            $this->cartService->removeItem($request->user(), $cartItemId);

            $cartCount = $this->cartService->getCount($request->user());

            return redirect()->back()
                ->with('success', 'Item removed from cart.')
                ->with('cartCount', $cartCount);
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Clear the entire cart.
     */
    public function clear(Request $request)
    {
        $this->cartService->clearCart($request->user());

        return redirect()->back()
            ->with('success', 'Cart cleared successfully.')
            ->with('cartCount', 0);
    }
}
