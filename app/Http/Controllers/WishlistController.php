<?php

namespace App\Http\Controllers;

use App\Services\WishlistService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WishlistController extends Controller
{
    public function __construct(
        protected WishlistService $wishlistService
    ) {}

    /**
     * Display the wishlist.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $wishlistData = $this->wishlistService->getFormattedWishlist($user);

        return Inertia::render('Wishlist/Index', [
            'wishlist' => $wishlistData,
        ]);
    }

    /**
     * Add a product to wishlist.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
        ]);

        try {
            $this->wishlistService->addItem(
                $request->user(),
                $validated['product_id']
            );

            return redirect()->back()
                ->with('success', 'Product added to wishlist.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Toggle a product in wishlist (add or remove).
     */
    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
        ]);

        try {
            $result = $this->wishlistService->toggleItem(
                $request->user(),
                $validated['product_id']
            );

            $wishlistCount = $this->wishlistService->getCount($request->user());

            return response()->json([
                'success' => true,
                'added' => $result['added'],
                'message' => $result['message'],
                'wishlistCount' => $wishlistCount,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Remove a wishlist item.
     */
    public function destroy(Request $request, int $wishlistItemId)
    {
        try {
            $this->wishlistService->removeItem($request->user(), $wishlistItemId);

            return redirect()->back()
                ->with('success', 'Item removed from wishlist.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Move a wishlist item to cart.
     */
    public function moveToCart(Request $request, int $wishlistItemId)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1|max:100',
        ]);

        try {
            $this->wishlistService->moveToCart(
                $request->user(),
                $wishlistItemId,
                $validated['quantity']
            );

            return redirect()->back()
                ->with('success', 'Item moved to cart.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Clear the entire wishlist.
     */
    public function clear(Request $request)
    {
        $this->wishlistService->clearWishlist($request->user());

        return redirect()->back()
            ->with('success', 'Wishlist cleared successfully.');
    }
}
