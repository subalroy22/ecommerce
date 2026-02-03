import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import WishlistItem from '@/Components/WishlistItem';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useState } from 'react';

export default function Index({ wishlist }) {
    const [processing, setProcessing] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'BDT',
        }).format(price);
    };

    const handleRemoveItem = (wishlistItemId) => {
        setProcessing(true);
        router.delete(route('wishlist.destroy', wishlistItemId), {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    const handleMoveToCart = (wishlistItemId, quantity) => {
        setProcessing(true);
        router.post(route('wishlist.moveToCart', wishlistItemId), { quantity }, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    const handleClearWishlist = () => {
        if (confirm('Are you sure you want to clear your entire wishlist?')) {
            setProcessing(true);
            router.post(route('wishlist.clear'), {}, {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Wishlist" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                        <p className="mt-2 text-gray-600">
                            {wishlist.count} {wishlist.count === 1 ? 'item' : 'items'} saved
                        </p>
                    </div>

                    {wishlist.items && wishlist.items.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {wishlist.items.map((item) => (
                                    <WishlistItem
                                        key={item.id}
                                        item={item}
                                        onRemove={handleRemoveItem}
                                        onMoveToCart={handleMoveToCart}
                                        processing={processing}
                                    />
                                ))}
                            </div>

                            {/* Clear Wishlist Button */}
                            <div className="mt-8">
                                <SecondaryButton
                                    onClick={handleClearWishlist}
                                    disabled={processing}
                                >
                                    Clear Wishlist
                                </SecondaryButton>
                            </div>
                        </>
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
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                            <p className="mt-4 text-lg text-gray-600">Your wishlist is empty</p>
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
