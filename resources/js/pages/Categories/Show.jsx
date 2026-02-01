import { Head, Link, router } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import ProductCard from '@/Components/ProductCard';
import SearchBar from '@/Components/SearchBar';
import { useState } from 'react';

export default function Show({ auth, category, products, filters }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const user = auth.user;
    const isAdmin = user && (user.role === 'admin' || user.role === 'manager');
    const handleSearch = (searchTerm) => {
        router.get(route('category.show', category.slug), { ...filters, search: searchTerm }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSortChange = (e) => {
        const [sortBy, sortOrder] = e.target.value.split('-');
        router.get(route('category.show', category.slug), {
            ...filters,
            sort_by: sortBy,
            sort_order: sortOrder,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title={category.name} />

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
                    {/* Breadcrumb */}
                    <nav className="mb-6 flex text-sm text-gray-500">
                        <Link href={route('home')} className="hover:text-gray-700">
                            Home
                        </Link>
                        <span className="mx-2">/</span>
                        {category.parent && (
                            <>
                                <Link 
                                    href={route('category.show', category.parent.slug)} 
                                    className="hover:text-gray-700"
                                >
                                    {category.parent.name}
                                </Link>
                                <span className="mx-2">/</span>
                            </>
                        )}
                        <span className="text-gray-900">{category.name}</span>
                    </nav>

                    {/* Category Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
                        {category.description && (
                            <p className="mt-2 text-gray-600">{category.description}</p>
                        )}
                    </div>

                    {/* Subcategories */}
                    {category.children && category.children.length > 0 && (
                        <div className="mb-8">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">Subcategories</h2>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                {category.children.map((child) => (
                                    <Link
                                        key={child.id}
                                        href={route('category.show', child.slug)}
                                        className="rounded-lg border border-gray-200 bg-white p-4 text-center transition hover:border-indigo-500 hover:shadow-md"
                                    >
                                        <h3 className="font-medium text-gray-900">{child.name}</h3>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Search and Sort */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                            <SearchBar 
                                initialValue={filters.search || ''} 
                                onSearch={handleSearch}
                                placeholder="Search in this category..."
                            />
                        </div>
                        <div className="sm:w-48">
                            <select
                                onChange={handleSortChange}
                                value={`${filters.sort_by || 'created_at'}-${filters.sort_order || 'desc'}`}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="created_at-desc">Newest First</option>
                                <option value="created_at-asc">Oldest First</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="name-asc">Name: A to Z</option>
                                <option value="name-desc">Name: Z to A</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {products.data && products.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {products.data.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
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
                        <div className="rounded-lg bg-white p-12 text-center shadow">
                            <p className="text-gray-500">No products found in this category</p>
                        </div>
                    )}
                </div>
            </div>
            </main>
        </div>
    );
}
