import { useState } from 'react';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

export default function ProductFilter({ categories, brands, filters, onFilterChange }) {
    const [localFilters, setLocalFilters] = useState({
        category_id: filters.category_id || '',
        brand_id: filters.brand_id || '',
        min_price: filters.min_price || '',
        max_price: filters.max_price || '',
        in_stock: filters.in_stock || '',
        featured: filters.featured || '',
    });

    const handleChange = (field, value) => {
        setLocalFilters(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const applyFilters = () => {
        const cleanFilters = Object.fromEntries(
            Object.entries(localFilters).filter(([_, value]) => value !== '')
        );
        onFilterChange({ ...filters, ...cleanFilters });
    };

    const clearFilters = () => {
        setLocalFilters({
            category_id: '',
            brand_id: '',
            min_price: '',
            max_price: '',
            in_stock: '',
            featured: '',
        });
        onFilterChange({ search: filters.search || '' });
    };

    return (
        <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>

            <div className="mt-6 space-y-6">
                {/* Category Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <select
                        value={localFilters.category_id}
                        onChange={(e) => handleChange('category_id', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Brand Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Brand
                    </label>
                    <select
                        value={localFilters.brand_id}
                        onChange={(e) => handleChange('brand_id', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">All Brands</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price Range */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Price Range
                    </label>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={localFilters.min_price}
                            onChange={(e) => handleChange('min_price', e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={localFilters.max_price}
                            onChange={(e) => handleChange('max_price', e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Availability */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Availability
                    </label>
                    <select
                        value={localFilters.in_stock}
                        onChange={(e) => handleChange('in_stock', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">All Products</option>
                        <option value="1">In Stock Only</option>
                        <option value="0">Out of Stock</option>
                    </select>
                </div>

                {/* Featured */}
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={localFilters.featured === '1'}
                            onChange={(e) => handleChange('featured', e.target.checked ? '1' : '')}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Featured Only</span>
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                    <PrimaryButton
                        onClick={applyFilters}
                        className="w-full justify-center"
                    >
                        Apply Filters
                    </PrimaryButton>
                    <SecondaryButton
                        onClick={clearFilters}
                        className="w-full justify-center"
                    >
                        Clear All
                    </SecondaryButton>
                </div>
            </div>
        </div>
    );
}
