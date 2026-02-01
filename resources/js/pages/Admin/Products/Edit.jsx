import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Checkbox from '@/Components/Checkbox';
import { useState } from 'react';

export default function Edit({ product, categories, brands }) {
    const { data, setData, post, processing, errors } = useForm({
        name: product.name || '',
        sku: product.sku || '',
        description: product.description || '',
        price: product.price || '',
        compare_price: product.compare_price || '',
        category_id: product.category_id || '',
        brand_id: product.brand_id || '',
        inventory_quantity: product.inventory_quantity || '',
        is_active: product.is_active || false,
        is_featured: product.is_featured || false,
        images: [],
        delete_images: [],
        _method: 'PUT',
    });

    const [imagePreviews, setImagePreviews] = useState([]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setData('images', files);

        // Generate preview URLs
        const previews = files.map(file => ({
            url: URL.createObjectURL(file),
            name: file.name,
            size: (file.size / 1024).toFixed(2) + ' KB'
        }));
        setImagePreviews(previews);
    };

    const removeNewImage = (index) => {
        const newImages = data.images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        
        // Revoke the URL to free memory
        URL.revokeObjectURL(imagePreviews[index].url);
        
        setData('images', newImages);
        setImagePreviews(newPreviews);
    };

    const handleDeleteImage = (imageId) => {
        setData('delete_images', [...data.delete_images, imageId]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.products.update', product.id));
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
                                    <InputLabel htmlFor="inventory_quantity" value="Stock Quantity *" />
                                    <TextInput
                                        id="inventory_quantity"
                                        type="number"
                                        value={data.inventory_quantity}
                                        onChange={(e) => setData('inventory_quantity', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.inventory_quantity} className="mt-2" />
                                </div>

                                {/* Existing Images */}
                                {product.images && product.images.length > 0 && (
                                    <div>
                                        <InputLabel value="Current Images" />
                                        <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                            {product.images.filter(img => !data.delete_images.includes(img.id)).map((image) => (
                                                <div key={image.id} className="relative group">
                                                    <img
                                                        src={image.image_url}
                                                        alt="Product"
                                                        className="h-32 w-full rounded-lg object-cover border-2 border-gray-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteImage(image.id)}
                                                        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1.5 text-white shadow-lg hover:bg-red-600 transition"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                    {image.is_primary && (
                                                        <span className="absolute bottom-2 left-2 rounded bg-indigo-600 px-2 py-1 text-xs font-medium text-white shadow">
                                                            Primary
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Add New Images */}
                                <div>
                                    <InputLabel htmlFor="images" value="Add New Images (Max 5 total)" />
                                    <input
                                        id="images"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Upload up to 5 images total. Supported formats: JPEG, PNG, JPG, GIF, WEBP (Max 2MB each)
                                    </p>
                                    <InputError message={errors.images} className="mt-2" />

                                    {/* New Image Previews */}
                                    {imagePreviews.length > 0 && (
                                        <div className="mt-4">
                                            <p className="mb-2 text-sm font-medium text-gray-700">
                                                New Images to Upload ({imagePreviews.length})
                                            </p>
                                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                                {imagePreviews.map((preview, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={preview.url}
                                                            alt={preview.name}
                                                            className="h-32 w-full rounded-lg object-cover border-2 border-green-200"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeNewImage(index)}
                                                            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1.5 text-white shadow-lg hover:bg-red-600 transition"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                        <span className="absolute top-2 left-2 rounded bg-green-600 px-2 py-1 text-xs font-medium text-white shadow">
                                                            New
                                                        </span>
                                                        <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                                                            {preview.size}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
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
