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
    const user = auth.user;
    const isAdmin = user && (user.role === 'admin' || user.role === 'manager');

    const handleFilterChange = (newFilters) => {
        router.get(route('home'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearch = (searchTerm) => {
        router.get(route('home'), { ...filters, search: searchTerm }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Welcome to Our Store" />

            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {user ? (
                                    <>
                                        <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                            Dashboard
                                        </NavLink>
                                        <NavLink href={route('home')} active={route().current('home')}>
                                            Store
                                        </NavLink>
                                        {isAdmin && (
                                            <>
                                                <NavLink href={route('admin.products.index')} active={route().current('admin.products.*')}>
                                                    Manage Products
                                                </NavLink>
                                                <NavLink href={route('admin.categories.index')} active={route().current('admin.categories.*')}>
                                                    Manage Categories
                                                </NavLink>
                                                <NavLink href={route('admin.brands.index')} active={route().current('admin.brands.*')}>
                                                    Manage Brands
                                                </NavLink>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <NavLink href={route('home')} active={route().current('home')}>
                                        Store
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            {user ? (
                                <div className="relative ms-3">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                                >
                                                    {user.name}
                                                    <svg className="-me-0.5 ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link href={route('login')} className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                                        Log in
                                    </Link>
                                    <Link href={route('register')} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500">
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="space-y-1 pb-3 pt-2">
                        {user ? (
                            <>
                                <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('home')} active={route().current('home')}>
                                    Store
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
                        ) : (
                            <ResponsiveNavLink href={route('home')} active={route().current('home')}>
                                Store
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        {user ? (
                            <>
                                <div className="px-4">
                                    <div className="text-base font-medium text-gray-800">{user.name}</div>
                                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                                </div>
                                <div className="mt-3 space-y-1">
                                    <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                                    <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                        Log Out
                                    </ResponsiveNavLink>
                                </div>
                            </>
                        ) : (
                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route('login')}>Log in</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('register')}>Sign up</ResponsiveNavLink>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <main>
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <SearchBar 
                            initialValue={filters.search || ''} 
                            onSearch={handleSearch}
                            placeholder="Search products..."
                        />

                        <div className="mt-6 lg:grid lg:grid-cols-4 lg:gap-8">
                            <div className="lg:col-span-1">
                                <ProductFilter
                                    categories={categories}
                                    brands={brands}
                                    filters={filters}
                                    onFilterChange={handleFilterChange}
                                />
                            </div>

                            <div className="mt-6 lg:col-span-3 lg:mt-0">
                                {products.data && products.data.length > 0 ? (
                                    <>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                            {products.data.map((product) => (
                                                <ProductCard key={product.id} product={product} />
                                            ))}
                                        </div>

                                        {products.links && products.links.length > 3 && (
                                            <div className="mt-8 flex justify-center">
                                                <nav className="inline-flex rounded-md shadow-sm">
                                                    {products.links.map((link, index) => (
                                                        <Link
                                                            key={index}
                                                            href={link.url || '#'}
                                                            className={`
                                                                relative inline-flex items-center px-4 py-2 text-sm font-medium
                                                                ${index === 0 ? 'rounded-l-md' : ''}
                                                                ${index === products.links.length - 1 ? 'rounded-r-md' : ''}
                                                                ${link.active ? 'z-10 bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}
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
                                    <div className="rounded-lg bg-white p-12 text-center shadow">
                                        <p className="text-gray-500">No products found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
