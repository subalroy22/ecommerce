<?php

namespace App\Repositories;

use App\Models\Brand;
use Illuminate\Database\Eloquent\Collection;

class BrandRepository
{
    /**
     * Get all brands.
     */
    public function getAll(array $filters = []): Collection
    {
        $query = Brand::query();

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        } else {
            $query->active();
        }

        return $query->orderBy('name')->get();
    }

    /**
     * Find brand by ID.
     */
    public function findById(int $id): ?Brand
    {
        return Brand::with('products')->find($id);
    }

    /**
     * Create a new brand.
     */
    public function create(array $data): Brand
    {
        return Brand::create($data);
    }

    /**
     * Update a brand.
     */
    public function update(Brand $brand, array $data): Brand
    {
        $brand->update($data);
        return $brand->fresh();
    }

    /**
     * Delete a brand.
     */
    public function delete(Brand $brand): bool
    {
        return $brand->delete();
    }
}
