import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/DataTable';
import AdminSearchBar from '@/Components/AdminSearchBar';

export default function Index({ orders, filters }) {
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
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            refunded: 'bg-gray-100 text-gray-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPaymentColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            refunded: 'bg-gray-100 text-gray-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const handleSearch = (searchTerm) => {
        if (searchTerm) {
            router.get(route('admin.orders.index'), { search: searchTerm }, {
                preserveScroll: true,
            });
        } else {
            router.get(route('admin.orders.index'), {}, {
                preserveScroll: true,
            });
        }
    };

    const handleSort = (field, order) => {
        router.get(route('admin.orders.index'), {
            ...filters,
            sort_by: field,
            sort_order: order
        }, {
            preserveScroll: true,
        });
    };

    const columns = [
        {
            label: 'Order Number',
            field: 'order_number',
            sortable: true,
            render: (order) => (
                <div className="font-medium text-gray-900">{order.order_number}</div>
            ),
        },
        {
            label: 'Customer',
            field: 'user_id',
            sortable: false,
            render: (order) => (
                <div>
                    <div className="font-medium text-gray-900">{order.user.name}</div>
                    <div className="text-xs text-gray-500">{order.user.email}</div>
                </div>
            ),
        },
        {
            label: 'Date',
            field: 'created_at',
            sortable: true,
            render: (order) => formatDate(order.created_at),
        },
        {
            label: 'Total',
            field: 'total',
            sortable: true,
            render: (order) => (
                <span className="font-semibold text-gray-900">{formatPrice(order.total)}</span>
            ),
        },
        {
            label: 'Status',
            field: 'status',
            sortable: true,
            render: (order) => (
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
            ),
        },
        {
            label: 'Payment',
            field: 'payment_status',
            sortable: true,
            render: (order) => (
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPaymentColor(order.payment_status)}`}>
                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                </span>
            ),
        },
        {
            label: 'Items',
            field: 'items',
            sortable: false,
            render: (order) => (
                <span className="text-gray-600">{order.items ? order.items.length : 0}</span>
            ),
        },
    ];

    const actions = (order) => (
        <Link href={route('admin.orders.show', order.order_number)}>
            <button className="text-indigo-600 hover:text-indigo-900 font-medium">
                View
            </button>
        </Link>
    );

    return (
        <AdminLayout header="Order Management">
            <Head title="Order Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div className="w-80">
                            <AdminSearchBar
                                initialValue={filters.search || ''}
                                onSearch={handleSearch}
                                placeholder="Search by order number, customer name, or email..."
                            />
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {orders.data && orders.data.length > 0 ? (
                                <>
                                    <DataTable
                                        columns={columns}
                                        data={orders.data}
                                        actions={actions}
                                        onSort={handleSort}
                                        sortBy={filters.sort_by}
                                        sortOrder={filters.sort_order}
                                    />

                                    {/* Pagination */}
                                    {orders.links && orders.links.length > 3 && (
                                        <div className="mt-6 flex justify-center">
                                            <nav className="inline-flex rounded-md shadow-sm">
                                                {orders.links.map((link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`
                                                            relative inline-flex items-center px-4 py-2 text-sm font-medium
                                                            ${index === 0 ? 'rounded-l-md' : ''}
                                                            ${index === orders.links.length - 1 ? 'rounded-r-md' : ''}
                                                            ${link.active
                                                                ? 'z-10 bg-indigo-600 text-white'
                                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                                            }
                                                            ${!link.url ? 'cursor-not-allowed opacity-50' : ''}
                                                            border border-gray-300
                                                        `}
                                                        preserveScroll
                                                        preserveState
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </nav>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="rounded-lg bg-white p-12 text-center">
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
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    <p className="mt-4 text-lg text-gray-600">No orders found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
