import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user;

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
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-semibold mb-4">Welcome, {user.name}!</h3>
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
