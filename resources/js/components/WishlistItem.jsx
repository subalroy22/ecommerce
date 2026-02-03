import { Link } from '@inertiajs/react';
import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function WishlistItem({ item, onRemove, onMoveToCart, processing = false }) {
    const [quantity, setQuantity] = useState(1);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'BDT',
        }).format(price);
    };

    const handleRemove = () => {
        if (confirm('Are you sure you want to remove this item?')) {
            onRemove(item.id);
        }
    };

    const handleMoveToCart = () => {
        onMoveToCart(item.id, quantity);
        setQuantity(1);
    };

    return (
        <div className="overflow-hidden rounded-lg bg-white shadow transition hover:shadow-lg">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-200">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.product_name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <span className="text-gray-400">No image</span>
                    </div>
                )}

                {/* Stock Badge */}
                {!item.in_stock && (
                    <span className="absolute right-2 top-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                        Out of Stock
                    </span>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4">
                <Link
                    href={route('product.show', item.product_slug)}
                    className="text-lg font-semibold text-gray-900 hover:text-indigo-600"
                >
                    {item.product_name}
                </Link>

                <p className="mt-2 text-xl font-bold text-gray-900">
                    {formatPrice(item.price)}
                </p>

                {item.in_stock && item.available_quantity <= 5 && (
                    <p className="mt-1 text-sm text-amber-600 font-medium">
                        Only {item.available_quantity} left
                    </p>
                )}

                {/* Quantity Input */}
                {item.in_stock && (
                    <div className="mt-3 flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">
                            Qty:
                        </label>
                        <input
                            type="number"
                            min="1"
                            max={item.available_quantity}
                            value={quantity}
                            onChange={(e) => setQuantity(Math.min(
                                Math.max(1, parseInt(e.target.value) || 1),
                                item.available_quantity
                            ))}
                            disabled={processing}
                            className="w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm"
                        />
                    </div>
                )}

                {/* Actions */}
                <div className="mt-4 space-y-2">
                    {item.in_stock ? (
                        <PrimaryButton
                            onClick={handleMoveToCart}
                            disabled={processing}
                            className="w-full justify-center"
                        >
                            Move to Cart
                        </PrimaryButton>
                    ) : (
                        <button
                            disabled
                            className="w-full rounded-md bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 cursor-not-allowed"
                        >
                            Out of Stock
                        </button>
                    )}

                    <button
                        onClick={handleRemove}
                        disabled={processing}
                        className="w-full rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}
