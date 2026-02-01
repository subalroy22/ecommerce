import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ProductCard from '@/Components/ProductCard';
import ProductFilter from '@/Components/ProductFilter';
import SearchBar from '@/Components/SearchBar';

export default function Index({ products, categories, brands, filters }) {
    const handleFilterChange = (newFilters) => {
        router.get(route('products.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearch = (searchTerm) => {
        router.get(route('products.index'), { ...filters, search: searchTerm }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Products" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                        <p className="mt-2 text-gray-600">Browse our collection of products</p>
                    </div>

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
                                    <p className="text-gray-500">No products found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
