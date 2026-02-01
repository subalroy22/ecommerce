import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ProductCard from '@/Components/ProductCard';
import SearchBar from '@/Components/SearchBar';

export default function Show({ category, products, filters }) {
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
        <AuthenticatedLayout>
            <Head title={category.name} />

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
        </AuthenticatedLayout>
    );
}
