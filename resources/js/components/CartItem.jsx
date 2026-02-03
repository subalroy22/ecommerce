import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function CartItem({ item, onRemove, onQuantityChange, processing = false }) {
    const [quantity, setQuantity] = useState(item.quantity);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'BDT',
        }).format(price);
    };

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1) return;
        if (newQuantity > item.available_quantity) return;

        setQuantity(newQuantity);
        onQuantityChange(item.id, newQuantity);
    };

    const handleRemove = () => {
        if (confirm('Are you sure you want to remove this item?')) {
            onRemove(item.id);
        }
    };

    return (
        <div className="flex gap-4 rounded-lg bg-white p-4 shadow">
            {/* Product Image */}
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.product_name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <span className="text-xs text-gray-400">No image</span>
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="flex-1">
                <Link
                    href={route('product.show', item.product_slug)}
                    className="text-lg font-semibold text-gray-900 hover:text-indigo-600"
                >
                    {item.product_name}
                </Link>

                <p className="mt-1 text-sm text-gray-600">
                    Price: {formatPrice(item.price)}
                </p>

                {!item.in_stock && (
                    <p className="mt-1 text-sm text-red-600 font-medium">
                        Out of Stock
                    </p>
                )}

                {item.in_stock && item.available_quantity <= 5 && (
                    <p className="mt-1 text-sm text-amber-600 font-medium">
                        Only {item.available_quantity} left in stock
                    </p>
                )}

                {/* Quantity Controls */}
                <div className="mt-3 flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">
                        Qty:
                    </label>
                    <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={processing || quantity <= 1}
                        className="rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-100 disabled:opacity-50"
                    >
                        −
                    </button>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                        disabled={processing}
                        className="w-12 rounded border border-gray-300 px-2 py-1 text-center text-sm"
                    />
                    <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={processing || quantity >= item.available_quantity}
                        className="rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-100 disabled:opacity-50"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Price and Actions */}
            <div className="flex flex-col items-end justify-between">
                <div className="text-right">
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-xl font-bold text-gray-900">
                        {formatPrice(item.subtotal)}
                    </p>
                </div>

                <button
                    onClick={handleRemove}
                    disabled={processing}
                    className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                    Remove
                </button>
            </div>
        </div>
    );
}
