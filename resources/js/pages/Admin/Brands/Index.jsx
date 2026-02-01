import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ brands, filters }) {
    const handleDelete = (brand) => {
        if (confirm(`Are you sure you want to delete "${brand.name}"?`)) {
            router.delete(route('admin.brands.destroy', brand.id), {
                preserveScroll: true,
            });
        }
    };

    const columns = [
        {
            label: 'Name',
            field: 'name',
            render: (brand) => (
                <div>
                    <div className="font-medium text-gray-900">{brand.name}</div>
                    <div className="text-xs text-gray-500">Slug: {brand.slug}</div>
                </div>
            ),
        },
        {
            label: 'Products',
            field: 'products_count',
            render: (brand) => brand.products_count || 0,
        },
        {
            label: 'Status',
            field: 'is_active',
            render: (brand) => (
                <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        brand.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}
                >
                    {brand.is_active ? 'Active' : 'Inactive'}
                </span>
            ),
        },
    ];

    const actions = (brand) => (
        <>
            <Link
                href={route('admin.brands.edit', brand.id)}
                className="text-indigo-600 hover:text-indigo-900"
            >
                Edit
            </Link>
            <button
                onClick={() => handleDelete(brand)}
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
                        Brand Management
                    </h2>
                    <Link href={route('admin.brands.create')}>
                        <PrimaryButton>Add Brand</PrimaryButton>
                    </Link>
                </div>
            }
        >
            <Head title="Brand Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <DataTable
                                columns={columns}
                                data={brands.data}
                                actions={actions}
                            />

                            {/* Pagination */}
                            {brands.links && brands.links.length > 3 && (
                                <div className="mt-6 flex justify-center">
                                    <nav className="inline-flex rounded-md shadow-sm">
                                        {brands.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`
                                                    relative inline-flex items-center px-4 py-2 text-sm font-medium
                                                    ${index === 0 ? 'rounded-l-md' : ''}
                                                    ${index === brands.links.length - 1 ? 'rounded-r-md' : ''}
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
