import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CartItem from '@/Components/CartItem';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useState } from 'react';

export default function Index({ cart }) {
    const [processing, setProcessing] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'BDT',
        }).format(price);
    };

    const handleUpdateQuantity = (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;

        setProcessing(true);
        router.put(route('cart.update', cartItemId), { quantity: newQuantity }, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    const handleRemoveItem = (cartItemId) => {
        setProcessing(true);
        router.delete(route('cart.destroy', cartItemId), {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    const handleClearCart = () => {
        if (confirm('Are you sure you want to clear your entire cart?')) {
            setProcessing(true);
            router.post(route('cart.clear'), {}, {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Shopping Cart" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                        <p className="mt-2 text-gray-600">
                            {cart.count} {cart.count === 1 ? 'item' : 'items'} in your cart
                        </p>
                    </div>

                    {cart.items && cart.items.length > 0 ? (
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {/* Cart Items */}
                            <div className="lg:col-span-2">
                                <div className="space-y-4">
                                    {cart.items.map((item) => (
                                        <CartItem
                                            key={item.id}
                                            item={item}
                                            onRemove={handleRemoveItem}
                                            onQuantityChange={handleUpdateQuantity}
                                            processing={processing}
                                        />
                                    ))}
                                </div>

                                {/* Clear Cart Button */}
                                <div className="mt-6">
                                    <SecondaryButton
                                        onClick={handleClearCart}
                                        disabled={processing}
                                    >
                                        Clear Cart
                                    </SecondaryButton>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="rounded-lg bg-white p-6 shadow">
                                    <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>

                                    <div className="mt-6 space-y-4 border-t border-gray-200 pt-6">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium text-gray-900">
                                                {formatPrice(cart.total)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="font-medium text-gray-900">
                                                {formatPrice(0)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tax</span>
                                            <span className="font-medium text-gray-900">
                                                {formatPrice(0)}
                                            </span>
                                        </div>

                                        <div className="border-t border-gray-200 pt-4">
                                            <div className="flex justify-between">
                                                <span className="text-lg font-semibold text-gray-900">Total</span>
                                                <span className="text-lg font-bold text-indigo-600">
                                                    {formatPrice(cart.total)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Checkout button - will be implemented in Task 4 */}
                                    <button
                                        disabled
                                        className="mt-6 w-full rounded-md bg-gray-400 px-4 py-2 text-white cursor-not-allowed"
                                        title="Checkout coming soon"
                                    >
                                        Proceed to Checkout (Coming Soon)
                                    </button>

                                    <Link href={route('home')}>
                                        <SecondaryButton className="mt-3 w-full justify-center">
                                            Continue Shopping
                                        </SecondaryButton>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg bg-white p-12 text-center shadow">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                            <p className="mt-4 text-lg text-gray-600">Your cart is empty</p>
                            <Link href={route('home')}>
                                <PrimaryButton className="mt-6">
                                    Start Shopping
                                </PrimaryButton>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
