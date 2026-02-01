import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard({ stats }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const isAdmin = user && (user.role === 'admin' || user.role === 'manager');

    const getRoleBadgeColor = (role) => {
        const colors = {
            admin: 'bg-red-100 text-red-800',
            manager: 'bg-blue-100 text-blue-800',
            support: 'bg-green-100 text-green-800',
            customer: 'bg-gray-100 text-gray-800',
        };
        return colors[role] || colors.customer;
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    const dashboardContent = (
        <>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h2>
                        <p className="mt-2 text-gray-600">Here's what's happening with your store today.</p>
                    </div>

                    {isAdmin && stats ? (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                                {/* Total Products */}
                                <div className="overflow-hidden rounded-lg bg-white shadow">
                                    <div className="p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 rounded-md bg-indigo-500 p-3">
                                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="truncate text-sm font-medium text-gray-500">Total Products</dt>
                                                    <dd className="flex items-baseline">
                                                        <div className="text-2xl font-semibold text-gray-900">{stats.total_products}</div>
                                                        <div className="ml-2 text-sm text-gray-600">({stats.active_products} active)</div>
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-6 py-3">
                                        <Link href={route('admin.products.index')} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                            View all →
                                        </Link>
                                    </div>
                                </div>

                                {/* Inventory Status */}
                                <div className="overflow-hidden rounded-lg bg-white shadow">
                                    <div className="p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 rounded-md bg-yellow-500 p-3">
                                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="truncate text-sm font-medium text-gray-500">Low Stock</dt>
                                                    <dd className="flex items-baseline">
                                                        <div className="text-2xl font-semibold text-gray-900">{stats.low_stock_products}</div>
                                                        <div className="ml-2 text-sm text-red-600">({stats.out_of_stock_products} out)</div>
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-6 py-3">
                                        <Link href={route('admin.products.index')} className="text-sm font-medium text-yellow-600 hover:text-yellow-500">
                                            Check inventory →
                                        </Link>
                                    </div>
                                </div>

                                {/* Categories */}
                                <div className="overflow-hidden rounded-lg bg-white shadow">
                                    <div className="p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 rounded-md bg-green-500 p-3">
                                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                </svg>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="truncate text-sm font-medium text-gray-500">Categories</dt>
                                                    <dd className="flex items-baseline">
                                                        <div className="text-2xl font-semibold text-gray-900">{stats.total_categories}</div>
                                                        <div className="ml-2 text-sm text-gray-600">({stats.active_categories} active)</div>
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-6 py-3">
                                        <Link href={route('admin.categories.index')} className="text-sm font-medium text-green-600 hover:text-green-500">
                                            Manage →
                                        </Link>
                                    </div>
                                </div>

                                {/* Brands */}
                                <div className="overflow-hidden rounded-lg bg-white shadow">
                                    <div className="p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 rounded-md bg-purple-500 p-3">
                                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                </svg>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="truncate text-sm font-medium text-gray-500">Brands</dt>
                                                    <dd className="flex items-baseline">
                                                        <div className="text-2xl font-semibold text-gray-900">{stats.total_brands}</div>
                                                        <div className="ml-2 text-sm text-gray-600">({stats.active_brands} active)</div>
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-6 py-3">
                                        <Link href={route('admin.brands.index')} className="text-sm font-medium text-purple-600 hover:text-purple-500">
                                            Manage →
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Stats Row */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-8">
                                {/* Total Inventory Value */}
                                <div className="overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                                    <div className="p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 rounded-md bg-white bg-opacity-30 p-3">
                                                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="truncate text-sm font-medium text-blue-100">Total Inventory Value</dt>
                                                    <dd className="text-3xl font-bold text-white">{formatCurrency(stats.total_value)}</dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Total Users */}
                                <div className="overflow-hidden rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 shadow-lg">
                                    <div className="p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 rounded-md bg-white bg-opacity-30 p-3">
                                                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="truncate text-sm font-medium text-pink-100">Total Users</dt>
                                                    <dd className="text-3xl font-bold text-white">{stats.total_users}</dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="rounded-lg bg-white shadow">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                        <Link
                                            href={route('admin.products.create')}
                                            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-indigo-500 hover:bg-indigo-50 transition"
                                        >
                                            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            <span className="mt-2 text-sm font-medium text-gray-900">Add Product</span>
                                        </Link>
                                        <Link
                                            href={route('admin.categories.create')}
                                            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-green-500 hover:bg-green-50 transition"
                                        >
                                            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                            <span className="mt-2 text-sm font-medium text-gray-900">Add Category</span>
                                        </Link>
                                        <Link
                                            href={route('admin.brands.create')}
                                            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-purple-500 hover:bg-purple-50 transition"
                                        >
                                            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                            </svg>
                                            <span className="mt-2 text-sm font-medium text-gray-900">Add Brand</span>
                                        </Link>
                                        <Link
                                            href={route('home')}
                                            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-blue-500 hover:bg-blue-50 transition"
                                        >
                                            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            <span className="mt-2 text-sm font-medium text-gray-900">View Store</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Customer Dashboard */
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <h3 className="text-lg font-semibold mb-4">Your Account</h3>
                                <div className="space-y-3">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Email:</span> {user.email}
                                    </p>
                                    {user.phone && (
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Phone:</span> {user.phone}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-600">Role:</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                                            {user.role.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-600">Status:</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.is_active ? 'ACTIVE' : 'INACTIVE'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );

    // Use AdminLayout for admin/manager, AuthenticatedLayout for others
    if (isAdmin) {
        return (
            <AdminLayout header="Dashboard">
                {dashboardContent}
            </AdminLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            {dashboardContent}
        </AuthenticatedLayout>
    );
}
