import { Link, router, usePage } from '@inertiajs/react';
import PrimaryButton from './PrimaryButton';
import { useState, useEffect } from 'react';

export default function ProductCard({ product }) {
    const { auth, cartItemIds = [], wishlistItemIds = [] } = usePage().props;
    const user = auth.user;
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
    const [isInCart, setIsInCart] = useState(cartItemIds.includes(product.id));
    const [isInWishlist, setIsInWishlist] = useState(wishlistItemIds.includes(product.id));

    useEffect(() => {
        // Update state when props change (on page load or refresh)
        setIsInCart(cartItemIds.includes(product.id));
        setIsInWishlist(wishlistItemIds.includes(product.id));
    }, [product.id, cartItemIds, wishlistItemIds]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'BDT',
        }).format(price);
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            window.location.href = route('login');
            return;
        }

        setIsAddingToCart(true);
        try {
            const response = await fetch(route('cart.toggle'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify({
                    product_id: product.id,
                    quantity: 1,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // Toggle the state
                setIsInCart(!isInCart);
                // Reload the page to update navbar cart count
                router.reload();
            } else {
                console.error('Failed to toggle cart');
            }
        } catch (error) {
            console.error('Error toggling cart:', error);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleAddToWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            window.location.href = route('login');
            return;
        }

        setIsAddingToWishlist(true);
        try {
            const response = await fetch(route('wishlist.toggle'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify({
                    product_id: product.id,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // Toggle the state
                setIsInWishlist(!isInWishlist);
                // Reload the page to update navbar wishlist count
                router.reload();
            } else {
                console.error('Failed to toggle wishlist');
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        } finally {
            setIsAddingToWishlist(false);
        }
    };

    return (
        <div className="group block overflow-hidden rounded-lg bg-white shadow transition hover:shadow-lg">
            <Link href={route('product.show', product.slug)}>
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-200">
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={product.images[0].image_url}
                            alt={product.name}
                            className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <span className="text-gray-400">No image</span>
                        </div>
                    )}

                    {/* Out of Stock Badge */}
                    {product.inventory_quantity === 0 ? (
                        <span className="absolute left-2 top-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800 ring-1 ring-red-300/60 backdrop-blur">
                            Out of Stock
                        </span>
                    ) : product.inventory_quantity <= 10 ? (
                        <span className="absolute left-2 top-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-300/60 backdrop-blur">
                            Only {product.inventory_quantity} left
                        </span>
                    ) : null}

                    {/* Wishlist Button */}
                    {user && (
                        <button
                            onClick={handleAddToWishlist}
                            disabled={isAddingToWishlist}
                            className="absolute right-2 top-2 rounded-full bg-white p-2 shadow hover:bg-gray-100 disabled:opacity-50"
                            title={isInWishlist ? "In wishlist" : "Add to wishlist"}
                        >
                            <i className={`fas fa-heart text-lg ${isInWishlist ? 'text-red-500' : 'text-gray-400'}`}></i>
                        </button>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                        {product.name}
                    </h3>

                    {product.brand && (
                        <p className="mt-1 text-sm text-gray-500">{product.brand.name}</p>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                        <div>
                            <span className="text-xl font-bold text-gray-900">
                                {formatPrice(product.price)}
                            </span>
                            {product.compare_price && (
                                <span className="ml-2 text-sm text-gray-500 line-through">
                                    {formatPrice(product.compare_price)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>

            {/* Add to Cart Button */}
            <div className="p-4 pt-0">
                {user ? (
                    <PrimaryButton
                        onClick={handleAddToCart}
                        disabled={product.inventory_quantity === 0 || isAddingToCart}
                        className="w-full justify-center"
                    >
                        {isAddingToCart ? (isInCart ? 'Removing...' : 'Adding...') : (isInCart ? 'Remove from Cart' : 'Add to Cart')}
                    </PrimaryButton>
                ) : (
                    <Link
                        href={route('login')}
                        className="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Log in to Add to Cart
                    </Link>
                )}
            </div>
        </div>
    );
}
