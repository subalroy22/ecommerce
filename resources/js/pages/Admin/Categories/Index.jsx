import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import AdminSearchBar from '@/Components/AdminSearchBar';

export default function Index({ categories, filters }) {
    const handleDelete = (category) => {
        if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
            router.delete(route('admin.categories.destroy', category.id), {
                preserveScroll: true,
            });
        }
    };

    const handleSearch = (searchTerm) => {
        if (searchTerm) {
            router.get(route('admin.categories.index'), { search: searchTerm }, {
                preserveScroll: true,
            });
        } else {
            router.get(route('admin.categories.index'), {}, {
                preserveScroll: true,
            });
        }
    };

    const handleSort = (field, order) => {
        router.get(route('admin.categories.index'), {
            ...filters,
            sort_by: field,
            sort_order: order
        }, {
            preserveScroll: true,
        });
    };

    const columns = [
        {
            label: 'Name',
            field: 'name',
            sortable: true,
            render: (category) => (
                <div>
                    <div className="font-medium text-gray-900">{category.name}</div>
                    <div className="text-xs text-gray-500">Slug: {category.slug}</div>
                </div>
            ),
        },
        {
            label: 'Parent',
            field: 'parent_id',
            sortable: true,
            render: (category) => category.parent?.name || '-',
        },
        {
            label: 'Products',
            field: 'products_count',
            sortable: true,
            render: (category) => category.products_count || 0,
        },
        {
            label: 'Status',
            field: 'is_active',
            sortable: true,
            field: 'is_active',
            render: (category) => (
                <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${category.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}
                >
                    {category.is_active ? 'Active' : 'Inactive'}
                </span>
            ),
        },
    ];

    const actions = (category) => (
        <>
            <Link
                href={route('admin.categories.edit', category.id)}
                className="text-indigo-600 hover:text-indigo-900"
            >
                Edit
            </Link>
            <button
                onClick={() => handleDelete(category)}
                className="text-red-600 hover:text-red-900"
            >
                Delete
            </button>
        </>
    );

    return (
        <AdminLayout
            header="Category Management"
        >
            <Head title="Category Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div className="w-80">
                            <AdminSearchBar
                                initialValue={filters.search || ''}
                                onSearch={handleSearch}
                                placeholder="Search categories..."
                            />
                        </div>
                        <Link href={route('admin.categories.create')}>
                            <PrimaryButton>Add Category</PrimaryButton>
                        </Link>
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <DataTable
                                columns={columns}
                                data={categories.data}
                                actions={actions}
                                onSort={handleSort}
                                sortBy={filters.sort_by}
                                sortOrder={filters.sort_order}
                            />

                            {/* Pagination */}
                            {categories.links && categories.links.length > 3 && (
                                <div className="mt-6 flex justify-center">
                                    <nav className="inline-flex rounded-md shadow-sm">
                                        {categories.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`
                                                    relative inline-flex items-center px-4 py-2 text-sm font-medium
                                                    ${index === 0 ? 'rounded-l-md' : ''}
                                                    ${index === categories.links.length - 1 ? 'rounded-r-md' : ''}
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
        </AdminLayout>
    );
}
