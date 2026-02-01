import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Checkbox from '@/Components/Checkbox';

export default function Edit({ product, categories, brands }) {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name || '',
        sku: product.sku || '',
        description: product.description || '',
        price: product.price || '',
        compare_price: product.compare_price || '',
        category_id: product.category_id || '',
        brand_id: product.brand_id || '',
        stock_quantity: product.stock_quantity || '',
        is_active: product.is_active || false,
        is_featured: product.is_featured || false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.products.update', product.id));
    };

    return (
        <AdminLayout
            header={`Edit Product: ${product.name}`}
        >
            <Head title={`Edit ${product.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-6">
                                {/* Name */}
                                <div>
                                    <InputLabel htmlFor="name" value="Product Name *" />
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

                                {/* SKU */}
                                <div>
                                    <InputLabel htmlFor="sku" value="SKU *" />
                                    <TextInput
                                        id="sku"
                                        type="text"
                                        value={data.sku}
                                        onChange={(e) => setData('sku', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.sku} className="mt-2" />
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

                                {/* Price and Compare Price */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="price" value="Price *" />
                                        <TextInput
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            className="mt-1 block w-full"
                                            required
                                        />
                                        <InputError message={errors.price} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="compare_price" value="Compare Price" />
                                        <TextInput
                                            id="compare_price"
                                            type="number"
                                            step="0.01"
                                            value={data.compare_price}
                                            onChange={(e) => setData('compare_price', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors.compare_price} className="mt-2" />
                                    </div>
                                </div>

                                {/* Category and Brand */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="category_id" value="Category *" />
                                        <select
                                            id="category_id"
                                            value={data.category_id}
                                            onChange={(e) => setData('category_id', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.category_id} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="brand_id" value="Brand" />
                                        <select
                                            id="brand_id"
                                            value={data.brand_id}
                                            onChange={(e) => setData('brand_id', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">Select Brand</option>
                                            {brands.map((brand) => (
                                                <option key={brand.id} value={brand.id}>
                                                    {brand.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.brand_id} className="mt-2" />
                                    </div>
                                </div>

                                {/* Stock Quantity */}
                                <div>
                                    <InputLabel htmlFor="stock_quantity" value="Stock Quantity *" />
                                    <TextInput
                                        id="stock_quantity"
                                        type="number"
                                        value={data.stock_quantity}
                                        onChange={(e) => setData('stock_quantity', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.stock_quantity} className="mt-2" />
                                </div>

                                {/* Checkboxes */}
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <Checkbox
                                            id="is_active"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                        />
                                        <InputLabel htmlFor="is_active" value="Active" className="ml-2" />
                                    </div>
                                    <div className="flex items-center">
                                        <Checkbox
                                            id="is_featured"
                                            checked={data.is_featured}
                                            onChange={(e) => setData('is_featured', e.target.checked)}
                                        />
                                        <InputLabel htmlFor="is_featured" value="Featured" className="ml-2" />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex items-center justify-end gap-4">
                                <Link href={route('admin.products.index')}>
                                    <SecondaryButton>Cancel</SecondaryButton>
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    Update Product
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
