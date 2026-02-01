import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import ProductCard from '@/Components/ProductCard';
import ProductImageCarousel from '@/Components/ProductImageCarousel';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState } from 'react';

export default function Show({ auth, product, relatedProducts }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const user = auth.user;
    const isAdmin = user && (user.role === 'admin' || user.role === 'manager');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title={product.name} />

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
                        {product.category && (
                            <>
                                <Link 
                                    href={route('category.show', product.category.slug)} 
                                    className="hover:text-gray-700"
                                >
                                    {product.category.name}
                                </Link>
                                <span className="mx-2">/</span>
                            </>
                        )}
                        <span className="text-gray-900">{product.name}</span>
                    </nav>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 lg:grid lg:grid-cols-2 lg:gap-8">
                            {/* Product Images Carousel */}
                            <div>
                                <ProductImageCarousel 
                                    images={product.images || []} 
                                    productName={product.name}
                                />
                            </div>

                            {/* Product Details */}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                                
                                {product.brand && (
                                    <Link 
                                        href={route('brand.show', product.brand.slug)}
                                        className="mt-2 inline-block text-sm text-indigo-600 hover:text-indigo-800"
                                    >
                                        {product.brand.name}
                                    </Link>
                                )}

                                <div className="mt-4">
                                    <span className="text-3xl font-bold text-gray-900">
                                        {formatPrice(product.price)}
                                    </span>
                                    {product.compare_price && (
                                        <span className="ml-3 text-xl text-gray-500 line-through">
                                            {formatPrice(product.compare_price)}
                                        </span>
                                    )}
                                </div>

                                {/* Stock Status */}
                                <div className="mt-4">
                                    {product.inventory_quantity > 0 ? (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                                            In Stock ({product.inventory_quantity} available)
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
                                            Out of Stock
                                        </span>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-gray-900">Description</h3>
                                    <p className="mt-2 text-gray-600">{product.description}</p>
                                </div>

                                {/* Add to Cart Button */}
                                <div className="mt-8">
                                    {user ? (
                                        <PrimaryButton
                                            disabled={product.stock_quantity === 0}
                                            className="w-full justify-center"
                                        >
                                            Add to Cart
                                        </PrimaryButton>
                                    ) : (
                                        <Link
                                            href={route('login')}
                                            className="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Log in to Add to Cart
                                        </Link>
                                    )}
                                </div>

                                {/* Product Meta */}
                                <div className="mt-8 border-t border-gray-200 pt-6">
                                    <dl className="space-y-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">SKU</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{product.sku}</dd>
                                        </div>
                                        {product.category && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Category</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    <Link 
                                                        href={route('category.show', product.category.slug)}
                                                        className="text-indigo-600 hover:text-indigo-800"
                                                    >
                                                        {product.category.name}
                                                    </Link>
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts && relatedProducts.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
                            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {relatedProducts.map((relatedProduct) => (
                                    <ProductCard key={relatedProduct.id} product={relatedProduct} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            </main>
        </div>
    );
}
