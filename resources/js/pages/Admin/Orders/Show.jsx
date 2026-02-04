import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SecondaryButton from '@/Components/SecondaryButton';
import OrderStatusTimeline from '@/Components/OrderStatusTimeline';
import { useState } from 'react';

export default function Show({ order }) {
    const [newStatus, setNewStatus] = useState(order.status);
    const [newPaymentStatus, setNewPaymentStatus] = useState(order.payment_status);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [updatingPayment, setUpdatingPayment] = useState(false);
    const [refunding, setRefunding] = useState(false);

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

    const handleStatusUpdate = () => {
        if (newStatus === order.status) return;

        setUpdatingStatus(true);
        router.patch(route('admin.orders.updateStatus', order.order_number),
            { status: newStatus },
            {
                onFinish: () => setUpdatingStatus(false),
            }
        );
    };

    const handlePaymentStatusUpdate = () => {
        if (newPaymentStatus === order.payment_status) return;

        setUpdatingPayment(true);
        router.patch(route('admin.orders.updatePaymentStatus', order.order_number),
            { payment_status: newPaymentStatus },
            {
                onFinish: () => setUpdatingPayment(false),
            }
        );
    };

    const handleRefund = () => {
        if (!confirm('Are you sure you want to refund this order? This will restore inventory.')) return;

        setRefunding(true);
        router.post(route('admin.orders.refund', order.order_number), {}, {
            onFinish: () => setRefunding(false),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Order ${order.order_number}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">Order {order.order_number}</h1>
                            <p className="mt-2 text-gray-600">Customer: <span className="font-semibold">{order.user.name}</span> ({order.user.email})</p>
                        </div>
                        <Link href={route('admin.orders.index')}>
                            <SecondaryButton>Back to Orders</SecondaryButton>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Order Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Status Management */}
                            <div className="rounded-lg bg-white p-8 shadow border border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Order Status Management</h2>

                                <OrderStatusTimeline status={order.status} />

                                {/* Status Update Controls */}
                                <div className="border-t border-gray-200 pt-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Update Order Status</label>
                                    <div className="flex gap-3">
                                        <select
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            disabled={updatingStatus}
                                            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                        <button
                                            onClick={handleStatusUpdate}
                                            disabled={updatingStatus || newStatus === order.status}
                                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {updatingStatus ? 'Updating...' : 'Update Status'}
                                        </button>
                                    </div>
                                </div>

                                {/* Payment Status Management */}
                                <div className="mt-6 border-t border-gray-200 pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Payment Method</p>
                                            <p className="mt-1 text-gray-900 font-semibold">{order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method.toUpperCase()}</p>
                                        </div>
                                        <span className={`inline-block rounded-full px-4 py-2 text-sm font-semibold ${order.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                                            order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                order.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                        </span>
                                    </div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Update Payment Status</label>
                                    <div className="flex gap-3">
                                        <select
                                            value={newPaymentStatus}
                                            onChange={(e) => setNewPaymentStatus(e.target.value)}
                                            disabled={updatingPayment}
                                            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="completed">Completed</option>
                                            <option value="failed">Failed</option>
                                            <option value="refunded">Refunded</option>
                                        </select>
                                        <button
                                            onClick={handlePaymentStatusUpdate}
                                            disabled={updatingPayment || newPaymentStatus === order.payment_status}
                                            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {updatingPayment ? 'Updating...' : 'Update Payment'}
                                        </button>
                                    </div>
                                </div>

                                {/* Refund Button */}
                                {order.status !== 'refunded' && (
                                    <div className="mt-6 border-t border-gray-200 pt-6">
                                        <button
                                            onClick={handleRefund}
                                            disabled={refunding}
                                            className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {refunding ? 'Processing...' : 'Refund Order'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Order Items */}
                            <div className="rounded-lg bg-white p-8 shadow border border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Order Items</h2>
                                <div className="space-y-4">
                                    {order.items.map((item, index) => (
                                        <div key={item.id} className={`flex gap-4 pb-4 ${index !== order.items.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                            {/* Product Image */}
                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                                                {item.product.images && item.product.images.length > 0 ? (
                                                    <img
                                                        src={item.product.images[0].image_url}
                                                        alt={item.product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center bg-gray-100">
                                                        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 text-base">{item.product.name}</h3>
                                                <p className="text-sm text-gray-600 mt-1">SKU: {item.product.sku || 'N/A'}</p>
                                                <div className="mt-3 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div>
                                                            <p className="text-xs text-gray-600">Quantity</p>
                                                            <p className="text-lg font-bold text-gray-900">{item.quantity}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-600">Unit Price</p>
                                                            <p className="text-lg font-bold text-gray-900">{formatPrice(item.price)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-600">Total</p>
                                                        <p className="text-xl font-bold text-indigo-600">{formatPrice(item.total)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="rounded-lg bg-white p-8 shadow border border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Shipping Address</h2>
                                <div className="text-gray-700 space-y-2">
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
                            <div className="rounded-lg bg-white p-8 shadow border border-gray-200 sticky top-24">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

                                <div className="space-y-4 pb-6 border-b border-gray-200">
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

                                <div className="mt-6 flex justify-between items-center">
                                    <span className="text-base font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-indigo-600">
                                        {formatPrice(order.total)}
                                    </span>
                                </div>

                                {/* Order Info */}
                                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-600 uppercase tracking-wide">Order Date</p>
                                        <p className="text-sm font-semibold text-gray-900">{formatDate(order.created_at)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 uppercase tracking-wide">Payment Method</p>
                                        <p className="text-sm font-semibold text-gray-900 capitalize">
                                            {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}
                                        </p>
                                    </div>
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