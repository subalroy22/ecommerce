import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ orders }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'BDT',
        }).format(price);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
            processing: 'bg-blue-50 text-blue-700 border border-blue-200',
            shipped: 'bg-purple-50 text-purple-700 border border-purple-200',
            delivered: 'bg-green-50 text-green-700 border border-green-200',
            cancelled: 'bg-red-50 text-red-700 border border-red-200',
            refunded: 'bg-gray-50 text-gray-700 border border-gray-200',
        };
        return colors[status] || 'bg-gray-50 text-gray-700 border border-gray-200';
    };

    return (
        <AuthenticatedLayout>
            <Head title="My Orders" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
                        <p className="mt-2 text-gray-600">Track and manage your orders</p>
                    </div>

                    {orders.data && orders.data.length > 0 ? (
                        <div className="space-y-4">
                            {orders.data.map((order) => (
                                <div key={order.id} className="rounded-lg bg-white border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6 items-center">
                                            {/* Order Number */}
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Order</p>
                                                <p className="mt-1 text-lg font-bold text-gray-900">{order.order_number}</p>
                                            </div>

                                            {/* Date */}
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</p>
                                                <p className="mt-1 text-sm text-gray-900">{formatDate(order.created_at)}</p>
                                            </div>

                                            {/* Total */}
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</p>
                                                <p className="mt-1 text-lg font-bold text-indigo-600">{formatPrice(order.total)}</p>
                                            </div>

                                            {/* Status */}
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</p>
                                                <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </div>

                                            {/* Payment Status */}
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment</p>
                                                <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${order.payment_status === 'completed'
                                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                                    : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                                    }`}>
                                                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                                </span>
                                            </div>

                                            {/* View Details Button */}
                                            <div className="flex justify-end">
                                                <Link href={route('order.show', order.order_number)}>
                                                    <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                                                        View Details
                                                        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Product Preview */}
                                        {order.items && order.items.length > 0 && (
                                            <div className="mt-4 border-t border-gray-100 pt-4">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Items ({order.items.length})</p>
                                                <div className="flex gap-3 flex-wrap">
                                                    {order.items.slice(0, 4).map((item) => (
                                                        <div key={item.id} className="relative group">
                                                            <div className="h-14 w-14 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden">
                                                                {item.product.images && item.product.images.length > 0 ? (
                                                                    <img
                                                                        src={item.product.images[0].image_url}
                                                                        alt={item.product.name}
                                                                        className="h-full w-full object-cover"
                                                                        title={item.product.name}
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-full items-center justify-center">
                                                                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {item.quantity > 1 && (
                                                                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                                                                    {item.quantity}
                                                                </span>
                                                            )}
                                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                                                                {item.product.name}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {order.items.length > 4 && (
                                                        <div className="h-14 w-14 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                                                            +{order.items.length - 4}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg bg-white border border-gray-200 p-12 text-center">
                            <svg
                                className="mx-auto h-16 w-16 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                            <p className="mt-4 text-lg font-semibold text-gray-900">No orders yet</p>
                            <p className="mt-1 text-gray-600">Start shopping to create your first order</p>
                            <Link href={route('home')}>
                                <PrimaryButton className="mt-6">
                                    Start Shopping
                                </PrimaryButton>
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {orders.links && orders.links.length > 0 && (
                        <div className="mt-8 flex justify-center gap-2">
                            {orders.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${link.active
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                        } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
