<?php

namespace App\Services;

use App\Models\Brand;
use App\Repositories\BrandRepository;
use Illuminate\Support\Str;

class BrandService
{
    public function __construct(
        protected BrandRepository $brandRepository
    ) {}

    /**
     * Get all brands.
     */
    public function getAllBrands(array $filters = [])
    {
        return $this->brandRepository->getAll($filters);
    }

    /**
     * Get all active brands without pagination.
     */
    public function getAllActiveBrands()
    {
        return $this->brandRepository->getAllActive();
    }

    /**
     * Get a single brand by ID.
     */
    public function getBrandById(int $id)
    {
        return $this->brandRepository->findById($id);
    }

    /**
     * Create a new brand.
     */
    public function createBrand(array $data): Brand
    {
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        return $this->brandRepository->create($data);
    }

    /**
     * Update an existing brand.
     */
    public function updateBrand(Brand $brand, array $data): Brand
    {
        if (isset($data['name']) && $data['name'] !== $brand->name) {
            $data['slug'] = Str::slug($data['name']);
        }

        return $this->brandRepository->update($brand, $data);
    }

    /**
     * Delete a brand.
     */
    public function deleteBrand(Brand $brand): bool
    {
        return $this->brandRepository->delete($brand);
    }
}
