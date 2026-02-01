import { Link } from '@inertiajs/react';

export default function ProductCard({ product }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    return (
        <Link
            href={route('product.show', product.slug)}
            className="group block overflow-hidden rounded-lg bg-white shadow transition hover:shadow-lg"
        >
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
                
                {/* Featured Badge */}
                {product.is_featured && (
                    <span className="absolute left-2 top-2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                        Featured
                    </span>
                )}

                {/* Out of Stock Badge */}
                {product.stock_quantity === 0 && (
                    <span className="absolute right-2 top-2 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                        Out of Stock
                    </span>
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

                {/* Stock Indicator */}
                {product.stock_quantity > 0 && product.stock_quantity <= 10 && (
                    <p className="mt-2 text-xs text-orange-600">
                        Only {product.stock_quantity} left!
                    </p>
                )}
            </div>
        </Link>
    );
}
