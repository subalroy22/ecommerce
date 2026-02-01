import { Head, Link, router } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import ProductCard from '@/Components/ProductCard';
import ProductFilter from '@/Components/ProductFilter';
import SearchBar from '@/Components/SearchBar';
import { useState } from 'react';

export default function Home({ auth, products, categories, brands, filters }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const user = auth.user;
    const isAdmin = user && (user.role === 'admin' || user.role === 'manager');

    const handleFilterChange = (newFilters) => {
        router.get(route('home'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
        setShowMobileFilters(false);
    };

    const handleSearch = (searchTerm) => {
        router.get(route('home'), { ...filters, search: searchTerm }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Head title="Welcome to Our Store" />

            {/* Modern Navigation */}
            <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="flex items-center space-x-2">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-indigo-600" />
                                    <span className="hidden text-xl font-bold text-gray-900 sm:block">Store</span>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {user && (
                                    <>
                                        <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                            Dashboard
                                        </NavLink>
                                        {isAdmin && (
                                            <>
                                                <NavLink href={route('admin.products.index')} active={route().current('admin.products.*')}>
                                                    Products
                                                </NavLink>
                                                <NavLink href={route('admin.categories.index')} active={route().current('admin.categories.*')}>
                                                    Categories
                                                </NavLink>
                                                <NavLink href={route('admin.brands.index')} active={route().current('admin.brands.*')}>
                                                    Brands
                                                </NavLink>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center sm:space-x-4">
                            {user ? (
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span>{user.name}</span>
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Link href={route('login')} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                                        Log in
                                    </Link>
                                    <Link href={route('register')} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700">
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-500"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' border-t border-gray-200 sm:hidden'}>
                    <div className="space-y-1 pb-3 pt-2">
                        {user && (
                            <>
                                <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </ResponsiveNavLink>
                                {isAdmin && (
                                    <>
                                        <ResponsiveNavLink href={route('admin.products.index')} active={route().current('admin.products.*')}>
                                            Manage Products
                                        </ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('admin.categories.index')} active={route().current('admin.categories.*')}>
                                            Manage Categories
                                        </ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('admin.brands.index')} active={route().current('admin.brands.*')}>
                                            Manage Brands
                                        </ResponsiveNavLink>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pb-3 pt-4">
                        {user ? (
                            <>
                                <div className="px-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white font-medium">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-base font-medium text-gray-800">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 space-y-1">
                                    <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                                    <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                        Log Out
                                    </ResponsiveNavLink>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-1 px-4">
                                <Link href={route('login')} className="block rounded-lg bg-gray-100 px-4 py-2 text-center text-sm font-medium text-gray-700">
                                    Log in
                                </Link>
                                <Link href={route('register')} className="block rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white">
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <main className="pb-12">
                {/* Hero Section with Search */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-8 sm:py-12">
                    <div className="mx-auto max-w-7xl">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                                Discover Amazing Products
                            </h1>
                            <p className="mx-auto mt-3 max-w-md text-base text-indigo-100 sm:text-lg md:mt-5 md:max-w-3xl">
                                Browse our collection of quality products at great prices
                            </p>
                        </div>
                        <div className="mx-auto mt-8 max-w-2xl">
                            <SearchBar 
                                initialValue={filters.search || ''} 
                                onSearch={handleSearch}
                                placeholder="Search for products..."
                            />
                        </div>
                    </div>
                </div>

                {/* Products Section */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mt-8 lg:grid lg:grid-cols-4 lg:gap-8">
                        {/* Desktop Filters */}
                        <div className="hidden lg:block">
                            <div className="sticky top-20">
                                <ProductFilter
                                    categories={categories}
                                    brands={brands}
                                    filters={filters}
                                    onFilterChange={handleFilterChange}
                                />
                            </div>
                        </div>

                        {/* Mobile Filter Button */}
                        <div className="mb-4 lg:hidden">
                            <button
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                className="flex w-full items-center justify-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                <span>Filters</span>
                            </button>
                        </div>

                        {/* Mobile Filters Modal */}
                        {showMobileFilters && (
                            <div className="fixed inset-0 z-50 lg:hidden">
                                <div className="fixed inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
                                <div className="fixed inset-y-0 right-0 w-[85vw] max-w-md bg-white shadow-xl overflow-hidden">
                                    <div className="flex h-full flex-col">
                                        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
                                            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                                            <button
                                                onClick={() => setShowMobileFilters(false)}
                                                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                                            >
                                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
                                            <ProductFilter
                                                categories={categories}
                                                brands={brands}
                                                filters={filters}
                                                onFilterChange={handleFilterChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Products Grid */}
                        <div className="lg:col-span-3">
                            {products.data && products.data.length > 0 ? (
                                <>
                                    <div className="mb-4 flex items-center justify-between">
                                        <p className="text-sm text-gray-600">
                                            Showing <span className="font-medium">{products.data.length}</span> products
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                                        {products.data.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {products.links && products.links.length > 3 && (
                                        <div className="mt-8 flex justify-center">
                                            <nav className="inline-flex rounded-lg shadow-sm">
                                                {products.links.map((link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`
                                                            relative inline-flex items-center px-3 py-2 text-sm font-medium transition sm:px-4
                                                            ${index === 0 ? 'rounded-l-lg' : ''}
                                                            ${index === products.links.length - 1 ? 'rounded-r-lg' : ''}
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
                                <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
                                    <p className="mt-2 text-sm text-gray-500">Try adjusting your search or filters</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
