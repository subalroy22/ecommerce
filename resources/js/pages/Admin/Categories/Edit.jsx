import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Checkbox from '@/Components/Checkbox';

export default function Edit({ category, categories }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name || '',
        description: category.description || '',
        parent_id: category.parent_id || '',
        is_active: category.is_active || false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.categories.update', category.id));
    };

    // Filter out current category and its children from parent options
    const availableParents = categories.filter(c => c.id !== category.id);

    return (
        <AdminLayout header={`Edit Category: ${category.name}`}>
            <Head title={`Edit ${category.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-6">
                                {/* Name */}
                                <div>
                                    <InputLabel htmlFor="name" value="Category Name *" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                {/* Description */}
                                <div>
                                    <InputLabel htmlFor="description" value="Description" />
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows="4"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                {/* Parent Category */}
                                <div>
                                    <InputLabel htmlFor="parent_id" value="Parent Category" />
                                    <select
                                        id="parent_id"
                                        value={data.parent_id}
                                        onChange={(e) => setData('parent_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">None (Root Category)</option>
                                        {availableParents.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.parent_id} className="mt-2" />
                                </div>

                                {/* Active Checkbox */}
                                <div className="flex items-center">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                    />
                                    <InputLabel htmlFor="is_active" value="Active" className="ml-2" />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex items-center justify-end gap-4">
                                <Link href={route('admin.categories.index')}>
                                    <SecondaryButton>Cancel</SecondaryButton>
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    Update Category
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
