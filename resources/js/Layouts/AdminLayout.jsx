import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        {
            name: 'Dashboard',
            href: route('dashboard'),
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            current: route().current('dashboard'),
        },
        {
            name: 'Products',
            href: route('admin.products.index'),
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            current: route().current('admin.products.*'),
        },
        {
            name: 'Categories',
            href: route('admin.categories.index'),
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
            ),
            current: route().current('admin.categories.*'),
        },
        {
            name: 'Orders',
            href: route('admin.orders.index'),
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            current: route().current('admin.orders.*'),
        },
        ...(user.role === 'admin' ? [{
            name: 'Users',
            href: route('admin.users.index'),
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            current: route().current('admin.users.*'),
        }] : []),
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar for desktop */}
            <div className="hidden md:flex md:w-64 md:flex-col">
                <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-indigo-700">
                    <div className="flex items-center flex-shrink-0 px-4">
                        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                    </div>
                    <div className="mt-8 flex-1 flex flex-col">
                        <nav className="flex-1 px-2 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                                        group flex items-center px-2 py-2 text-sm font-medium rounded-md
                                        ${item.current
                                            ? 'bg-indigo-800 text-white'
                                            : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
                                        }
                                    `}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-white">{user.name}</p>
                                <p className="text-xs font-medium text-indigo-200 capitalize">{user.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile sidebar */}
            <div className={`md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 flex z-40">
                    <div className="fixed inset-0" onClick={() => setSidebarOpen(false)}>
                        <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
                    </div>
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-indigo-700">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            >
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                            <div className="flex-shrink-0 flex items-center px-4">
                                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                            </div>
                            <nav className="mt-5 px-2 space-y-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`
                                            group flex items-center px-2 py-2 text-base font-medium rounded-md
                                            ${item.current
                                                ? 'bg-indigo-800 text-white'
                                                : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
                                            }
                                        `}
                                    >
                                        <span className="mr-4">{item.icon}</span>
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-base font-medium text-white">{user.name}</p>
                                    <p className="text-sm font-medium text-indigo-200 capitalize">{user.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
