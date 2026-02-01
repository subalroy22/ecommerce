import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ products, filters }) {
    const handleDelete = (product) => {
        if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
            router.delete(route('admin.products.destroy', product.id), {
                preserveScroll: true,
            });
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const columns = [
        {
            label: 'Image',
            field: 'image',
            render: (product) => (
                <div className="h-12 w-12 overflow-hidden rounded">
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={product.images[0].image_url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xs text-gray-400">
                            No img
                        </div>
                    )}
                </div>
            ),
        },
        {
            label: 'Name',
            field: 'name',
            render: (product) => (
                <div>
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">SKU: {product.sku}</div>
                </div>
            ),
        },
        {
            label: 'Category',
            field: 'category',
            render: (product) => product.category?.name || '-',
        },
        {
            label: 'Brand',
            field: 'brand',
            render: (product) => product.brand?.name || '-',
        },
        {
            label: 'Price',
            field: 'price',
            render: (product) => formatPrice(product.price),
        },
        {
            label: 'Stock',
            field: 'stock_quantity',
            render: (product) => (
                <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        product.stock_quantity > 10
                            ? 'bg-green-100 text-green-800'
                            : product.stock_quantity > 0
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                    }`}
                >
                    {product.stock_quantity}
                </span>
            ),
        },
        {
            label: 'Status',
            field: 'is_active',
            render: (product) => (
                <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        product.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}
                >
                    {product.is_active ? 'Active' : 'Inactive'}
                </span>
            ),
        },
    ];

    const actions = (product) => (
        <>
            <Link
                href={route('admin.products.edit', product.id)}
                className="text-indigo-600 hover:text-indigo-900"
            >
                Edit
            </Link>
            <button
                onClick={() => handleDelete(product)}
                className="text-red-600 hover:text-red-900"
            >
                Delete
            </button>
        </>
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Product Management
                    </h2>
                    <Link href={route('admin.products.create')}>
                        <PrimaryButton>Add Product</PrimaryButton>
                    </Link>
                </div>
            }
        >
            <Head title="Product Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <DataTable
                                columns={columns}
                                data={products.data}
                                actions={actions}
                            />

                            {/* Pagination */}
                            {products.links && products.links.length > 3 && (
                                <div className="mt-6 flex justify-center">
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
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
