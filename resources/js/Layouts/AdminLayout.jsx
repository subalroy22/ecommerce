import { Link } from '@inertiajs/react';
import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ header, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Top bar */}
                <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="flex-1 px-4 flex justify-between items-center">
                        <div className="flex-1">
                            {header && (
                                <h1 className="text-2xl font-semibold text-gray-900">{header}</h1>
                            )}
                        </div>
                        <div className="ml-4 flex items-center md:ml-6 space-x-4">
                            <Link
                                href={route('home')}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                View Store
                            </Link>
                            <Link
                                href={route('profile.edit')}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                Profile
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    {children}
                </main>
            </div>
        </div>
    );
}
