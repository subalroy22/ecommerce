import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import DataTable from '@/components/DataTable';
import AdminSearchBar from '@/components/AdminSearchBar';

export default function UserIndex({ users, filters }) {
    const { auth } = usePage().props;
    const [loading, setLoading] = useState(false);

    const handleSearch = (searchTerm) => {
        router.get(route('admin.users.index'), { search: searchTerm }, { preserveScroll: true });
    };

    const handleStatusChange = (userId, newStatus) => {
        setLoading(true);
        router.patch(
            route('admin.users.updateStatus', userId),
            { is_active: newStatus },
            {
                onFinish: () => setLoading(false),
            }
        );
    };

    const handleRoleChange = (userId, newRole) => {
        setLoading(true);
        router.patch(
            route('admin.users.updateRole', userId),
            { role: newRole },
            {
                onFinish: () => setLoading(false),
            }
        );
    };

    const handleDelete = (userId) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setLoading(true);
            router.delete(route('admin.users.destroy', userId), {
                onFinish: () => setLoading(false),
            });
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            render: (user) => (
                <Link href={route('admin.users.show', user.id)} className="text-blue-600 hover:text-blue-800 font-medium">
                    {user.name}
                </Link>
            ),
        },
        {
            key: 'email',
            label: 'Email',
            sortable: true,
        },
        {
            key: 'role',
            label: 'Role',
            render: (user) => (
                <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={auth.user.id === user.id}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium"
                >
                    <option value="customer">Customer</option>
                    <option value="support">Support</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                </select>
            ),
        },
        {
            key: 'is_active',
            label: 'Status',
            render: (user) => (
                <button
                    onClick={() => handleStatusChange(user.id, !user.is_active)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${user.is_active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                >
                    {user.is_active ? 'Active' : 'Inactive'}
                </button>
            ),
        },
        {
            key: 'created_at',
            label: 'Joined',
            sortable: true,
            render: (user) => new Date(user.created_at).toLocaleDateString(),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (user) => (
                <div className="flex gap-2">
                    <Link
                        href={route('admin.users.show', user.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        View
                    </Link>
                    {auth.user.id !== user.id && (
                        <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                            Delete
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <AdminLayout header="User Management">
            <Head title="User Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Users</h2>
                            <p className="mt-2 text-gray-600">Manage customer and admin accounts</p>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="mb-6 overflow-hidden rounded-lg bg-white shadow">
                        <div className="p-6">
                            <AdminSearchBar
                                placeholder="Search users by name or email..."
                                onSearch={handleSearch}
                                defaultValue={filters.search}
                            />

                            {/* Filter Options */}
                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                    <select
                                        value={filters.role || ''}
                                        onChange={(e) =>
                                            router.get(route('admin.users.index'), {
                                                ...filters,
                                                role: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Roles</option>
                                        <option value="customer">Customer</option>
                                        <option value="support">Support</option>
                                        <option value="manager">Manager</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={filters.status || ''}
                                        onChange={(e) =>
                                            router.get(route('admin.users.index'), {
                                                ...filters,
                                                status: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                                    <select
                                        value={filters.sort_by || 'created_at'}
                                        onChange={(e) =>
                                            router.get(route('admin.users.index'), {
                                                ...filters,
                                                sort_by: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="created_at">Newest</option>
                                        <option value="name">Name</option>
                                        <option value="email">Email</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <DataTable
                            columns={columns}
                            data={users.data}
                            loading={loading}
                        />

                        {/* Pagination */}
                        {users.links && (
                            <div className="border-t border-gray-200 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        Showing {users.from} to {users.to} of {users.total} users
                                    </div>
                                    <div className="flex gap-2">
                                        {users.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium ${link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : link.url
                                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
