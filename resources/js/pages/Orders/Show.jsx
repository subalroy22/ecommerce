import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SecondaryButton from '@/Components/SecondaryButton';
import OrderStatusTimeline from '@/Components/OrderStatusTimeline';

export default function Show({ order }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'BDT',
        }).format(price);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const shippingAddress = order.shipping_address ? JSON.parse(order.shipping_address) : {};

    return (
        <AuthenticatedLayout>
            <Head title={`Order ${order.order_number}`} />

            <div className="py-6 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Order {order.order_number}</h1>
                            <p className="mt-2 text-sm sm:text-base text-gray-600">Placed on {formatDate(order.created_at)}</p>
                        </div>
                        <Link href={route('order.index')}>
                            <SecondaryButton>Back to Orders</SecondaryButton>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
                        {/* Order Details */}
                        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                            {/* Order Tracking Timeline */}
                            <div className="rounded-lg bg-white p-4 sm:p-8 shadow border border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 sm:mb-8">Order Tracking</h2>

                                <OrderStatusTimeline status={order.status} />

                                {/* Payment Status */}
                                <div className="mt-6 sm:mt-8 border-t border-gray-200 pt-4 sm:pt-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div>
                                            <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Payment Status</p>
                                            <p className="mt-1 text-sm sm:text-base text-gray-900 font-semibold">{order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method.toUpperCase()}</p>
                                        </div>
                                        <span className={`inline-block rounded-full px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-semibold self-start sm:self-auto ${order.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                                                order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }`}>
                                            {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="rounded-lg bg-white p-4 sm:p-8 shadow border border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 sm:mb-6">Order Items</h2>
                                <div className="space-y-4">
                                    {order.items.map((item, index) => (
                                        <div key={item.id} className={`flex flex-col sm:flex-row gap-4 pb-4 ${index !== order.items.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                            {/* Product Image */}
                                            <div className="h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200 mx-auto sm:mx-0">
                                                {item.product.images && item.product.images.length > 0 ? (
                                                    <img
                                                        src={item.product.images[0].image_url}
                                                        alt={item.product.name}
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center bg-gray-100">
                                                        <svg className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 text-center sm:text-left">
                                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{item.product.name}</h3>
                                                <p className="text-xs sm:text-sm text-gray-600 mt-1">SKU: {item.product.sku || 'N/A'}</p>
                                                <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                    <div className="flex justify-center sm:justify-start items-center gap-4 sm:gap-6">
                                                        <div className="text-center">
                                                            <p className="text-xs text-gray-600">Quantity</p>
                                                            <p className="text-sm sm:text-lg font-bold text-gray-900">{item.quantity}</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-xs text-gray-600">Unit Price</p>
                                                            <p className="text-sm sm:text-lg font-bold text-gray-900">{formatPrice(item.price)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-center sm:text-right">
                                                        <p className="text-xs text-gray-600">Total</p>
                                                        <p className="text-lg sm:text-xl font-bold text-indigo-600">{formatPrice(item.total)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="rounded-lg bg-white p-4 sm:p-8 shadow border border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 sm:mb-6">Shipping Address</h2>
                                <div className="text-gray-700 space-y-2 text-sm sm:text-base">
                                    <p className="font-semibold text-gray-900">{shippingAddress.name}</p>
                                    <p>{shippingAddress.address}</p>
                                    <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}</p>
                                    <p>{shippingAddress.country}</p>
                                    <div className="pt-4 border-t border-gray-200 mt-4">
                                        <p className="text-sm"><span className="font-semibold">Phone:</span> {shippingAddress.phone}</p>
                                        <p className="text-sm"><span className="font-semibold">Email:</span> {shippingAddress.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="rounded-lg bg-white p-4 sm:p-8 shadow border border-gray-200 lg:sticky lg:top-24">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>

                                <div className="space-y-3 sm:space-y-4 pb-4 sm:pb-6 border-b border-gray-200 text-sm sm:text-base">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-semibold text-gray-900">
                                            {formatPrice(order.subtotal)}
                                        </span>
                                    </div>

                                    {order.shipping > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="font-semibold text-gray-900">
                                                {formatPrice(order.shipping)}
                                            </span>
                                        </div>
                                    )}

                                    {order.tax > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Tax</span>
                                            <span className="font-semibold text-gray-900">
                                                {formatPrice(order.tax)}
                                            </span>
                                        </div>
                                    )}

                                    {order.discount > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Discount</span>
                                            <span className="font-semibold text-green-600">
                                                -{formatPrice(order.discount)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 sm:mt-6 flex justify-between items-center">
                                    <span className="text-sm sm:text-base font-bold text-gray-900">Total</span>
                                    <span className="text-xl sm:text-2xl font-bold text-indigo-600">
                                        {formatPrice(order.total)}
                                    </span>
                                </div>

                                {/* Order Notes */}
                                {order.notes && (
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <h3 className="font-semibold text-gray-900 mb-2 text-sm">Order Notes</h3>
                                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{order.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
