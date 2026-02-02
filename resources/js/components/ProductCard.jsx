import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import PrimaryButton from './PrimaryButton';

export default function ProductCard({ product }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'BDT',
        }).format(price);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            window.location.href = route('login');
            return;
        }

        // TODO: Implement add to cart functionality
        alert('Add to cart functionality will be implemented soon!');
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
                        <span className="absolute right-2 top-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800 ring-1 ring-red-300/60 backdrop-blur">
                            Out of Stock
                        </span>
                    ) : product.inventory_quantity <= 10 ? (
                        <span className="absolute right-2 top-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-300/60 backdrop-blur">
                            Only {product.inventory_quantity} left
                        </span>
                    ) : null}
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
                        disabled={product.inventory_quantity === 0}
                        className="w-full justify-center"
                    >
                        Add to Cart
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
