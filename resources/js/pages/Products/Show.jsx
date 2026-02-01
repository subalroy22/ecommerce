import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ProductCard from '@/Components/ProductCard';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Show({ product, relatedProducts }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    return (
        <AuthenticatedLayout>
            <Head title={product.name} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="mb-6 flex text-sm text-gray-500">
                        <Link href={route('products.index')} className="hover:text-gray-700">
                            Products
                        </Link>
                        <span className="mx-2">/</span>
                        {product.category && (
                            <>
                                <Link 
                                    href={route('categories.show', product.category.slug)} 
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
                            {/* Product Images */}
                            <div>
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={product.images[0].image_url}
                                        alt={product.name}
                                        className="h-96 w-full rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="flex h-96 items-center justify-center rounded-lg bg-gray-200">
                                        <span className="text-gray-400">No image available</span>
                                    </div>
                                )}
                            </div>

                            {/* Product Details */}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                                
                                {product.brand && (
                                    <Link 
                                        href={route('brands.show', product.brand.slug)}
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
                                    {product.stock_quantity > 0 ? (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                                            In Stock ({product.stock_quantity} available)
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
                                    <PrimaryButton
                                        disabled={product.stock_quantity === 0}
                                        className="w-full justify-center"
                                    >
                                        Add to Cart
                                    </PrimaryButton>
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
                                                        href={route('categories.show', product.category.slug)}
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
        </AuthenticatedLayout>
    );
}
