import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function UserShow({ user }) {
    const [isEditingRole, setIsEditingRole] = useState(false);
    const [selectedRole, setSelectedRole] = useState(user.role);
    const [loading, setLoading] = useState(false);

    const handleRoleUpdate = () => {
        setLoading(true);
        router.patch(
            route('admin.users.updateRole', user.id),
            { role: selectedRole },
            {
                onSuccess: () => {
                    setIsEditingRole(false);
                    setLoading(false);
                },
                onError: () => setLoading(false),
            }
        );
    };

    const handleStatusToggle = () => {
        setLoading(true);
        router.patch(
            route('admin.users.updateStatus', user.id),
            { is_active: !user.is_active },
            {
                onFinish: () => setLoading(false),
            }
        );
    };

    const getRoleBadgeColor = (role) => {
        const colors = {
            admin: 'bg-red-100 text-red-800',
            manager: 'bg-blue-100 text-blue-800',
            support: 'bg-green-100 text-green-800',
            customer: 'bg-gray-100 text-gray-800',
        };
        return colors[role] || colors.customer;
    };

    return (
        <AdminLayout header="User Details">
            <Head title={`User: ${user.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <Link href={route('admin.users.index')} className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2 inline-block">
                                ← Back to Users
                            </Link>
                            <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
                            <p className="mt-2 text-gray-600">{user.email}</p>
                        </div>
                    </div>

                    {/* User Information */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
                        {/* Main Info */}
                        <div className="lg:col-span-2 overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h3>

                                <div className="space-y-6">
                                    {/* Name */}
                                    <div className="border-l-4 border-blue-500 pl-4">
                                        <p className="text-sm text-gray-600 font-medium">Full Name</p>
                                        <p className="text-lg font-semibold text-gray-900 mt-1">{user.name}</p>
                                    </div>

                                    {/* Email */}
                                    <div className="border-l-4 border-green-500 pl-4">
                                        <p className="text-sm text-gray-600 font-medium">Email Address</p>
                                        <p className="text-lg font-semibold text-gray-900 mt-1">{user.email}</p>
                                    </div>

                                    {/* Phone */}
                                    {user.phone && (
                                        <div className="border-l-4 border-purple-500 pl-4">
                                            <p className="text-sm text-gray-600 font-medium">Phone Number</p>
                                            <p className="text-lg font-semibold text-gray-900 mt-1">{user.phone}</p>
                                        </div>
                                    )}

                                    {/* Member Since */}
                                    <div className="border-l-4 border-orange-500 pl-4">
                                        <p className="text-sm text-gray-600 font-medium">Member Since</p>
                                        <p className="text-lg font-semibold text-gray-900 mt-1">
                                            {new Date(user.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status and Role */}
                        <div className="space-y-6">
                            {/* Status Card */}
                            <div className="overflow-hidden rounded-lg bg-white shadow">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${user.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {user.is_active ? 'ACTIVE' : 'INACTIVE'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleStatusToggle}
                                        disabled={loading}
                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition"
                                    >
                                        {user.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                </div>
                            </div>

                            {/* Role Card */}
                            <div className="overflow-hidden rounded-lg bg-white shadow">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Role</h3>
                                    <div className="mb-4">
                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getRoleBadgeColor(user.role)}`}>
                                            {user.role.toUpperCase()}
                                        </span>
                                    </div>

                                    {isEditingRole ? (
                                        <div className="space-y-3">
                                            <select
                                                value={selectedRole}
                                                onChange={(e) => setSelectedRole(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="customer">Customer</option>
                                                <option value="support">Support</option>
                                                <option value="manager">Manager</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleRoleUpdate}
                                                    disabled={loading}
                                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-medium transition"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsEditingRole(false);
                                                        setSelectedRole(user.role);
                                                    }}
                                                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-medium transition"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditingRole(true)}
                                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
                                        >
                                            Change Role
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Additional Information</h3>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Account Created</p>
                                    <p className="text-base font-semibold text-gray-900 mt-1">
                                        {new Date(user.created_at).toLocaleString()}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Last Updated</p>
                                    <p className="text-base font-semibold text-gray-900 mt-1">
                                        {new Date(user.updated_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
