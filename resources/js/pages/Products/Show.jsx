import { Head, Link, router } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import ProductCard from '@/Components/ProductCard';
import ProductImageCarousel from '@/Components/ProductImageCarousel';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState } from 'react';

export default function Show({ auth, product, relatedProducts, cartItemIds = [], wishlistItemIds = [] }) {
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
    const [isInCart, setIsInCart] = useState(cartItemIds.includes(product.id));
    const [isInWishlist, setIsInWishlist] = useState(wishlistItemIds.includes(product.id));
    const user = auth.user;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'BDT',
        }).format(price);
    };

    const handleAddToCart = () => {
        if (!user) {
            window.location.href = route('login');
            return;
        }

        setIsAddingToCart(true);
        router.post(route('cart.store'), {
            product_id: product.id,
            quantity: quantity,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setIsAddingToCart(false);
                setIsInCart(true);
            },
        });
    };

    const handleAddToWishlist = () => {
        if (!user) {
            window.location.href = route('login');
            return;
        }

        setIsAddingToWishlist(true);
        router.post(route('wishlist.store'), {
            product_id: product.id,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setIsAddingToWishlist(false);
                setIsInWishlist(true);
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title={product.name} />

            <Navbar />

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
                                            <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800 ring-1 ring-red-300/60 backdrop-blur">
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
                                        {product.inventory_quantity > 0 && (
                                            <div className="mb-4 flex items-center gap-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Quantity:
                                                </label>
                                                <button
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    disabled={isAddingToCart}
                                                    className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                                                >
                                                    −
                                                </button>
                                                <input
                                                    type="number"
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), product.inventory_quantity))}
                                                    disabled={isAddingToCart}
                                                    className="w-16 rounded border border-gray-300 px-2 py-1 text-center"
                                                />
                                                <button
                                                    onClick={() => setQuantity(Math.min(quantity + 1, product.inventory_quantity))}
                                                    disabled={isAddingToCart || quantity >= product.inventory_quantity}
                                                    className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}

                                        {user ? (
                                            <div className="flex gap-3">
                                                <PrimaryButton
                                                    onClick={handleAddToCart}
                                                    disabled={product.inventory_quantity === 0 || isAddingToCart}
                                                    className="flex-1 justify-center"
                                                >
                                                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                                                </PrimaryButton>
                                                <button
                                                    onClick={handleAddToWishlist}
                                                    disabled={isAddingToWishlist}
                                                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                                >
                                                    {isAddingToWishlist ? '...' : '♡'}
                                                </button>
                                            </div>
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
