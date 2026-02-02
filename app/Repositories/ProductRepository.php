<?php

namespace App\Repositories;

use App\Models\Product;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductRepository
{
    /**
     * Get products with filters and pagination.
     */
    public function getWithFilters(array $filters = []): LengthAwarePaginator
    {
        $query = Product::with(['category', 'brand', 'images']);

        // Filter by active status - only apply if explicitly set
        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        // Filter by category
        if (isset($filters['category_id'])) {
            $query->byCategory($filters['category_id']);
        }

        // Filter by brand
        if (isset($filters['brand_id'])) {
            $query->byBrand($filters['brand_id']);
        }

        // Filter by price range
        if (isset($filters['min_price']) && isset($filters['max_price'])) {
            $query->priceRange($filters['min_price'], $filters['max_price']);
        }

        // Filter by stock status
        if (isset($filters['in_stock']) && $filters['in_stock']) {
            $query->inStock();
        }

        // Search
        if (isset($filters['search'])) {
            $query->search($filters['search']);
        }

        // Featured products
        if (isset($filters['featured']) && $filters['featured']) {
            $query->featured();
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $filters['per_page'] ?? 15;
        return $query->paginate($perPage);
    }

    /**
     * Find product by ID with relationships.
     */
    public function findById(int $id): ?Product
    {
        return Product::with(['category', 'brand', 'images'])->find($id);
    }

    /**
     * Create a new product.
     */
    public function create(array $data): Product
    {
        return Product::create($data);
    }

    /**
     * Update a product.
     */
    public function update(Product $product, array $data): Product
    {
        $product->update($data);
        return $product->fresh();
    }

    /**
     * Delete a product (soft delete).
     */
    public function delete(Product $product): bool
    {
        return $product->delete();
    }

    /**
     * Update product inventory.
     */
    public function updateInventory(Product $product, int $quantity): void
    {
        $product->update(['inventory_quantity' => $quantity]);
    }

    /**
     * Search products.
     */
    public function search(string $query, array $filters = []): LengthAwarePaginator
    {
        $filters['search'] = $query;
        return $this->getWithFilters($filters);
    }

    /**
     * Get products by category.
     */
    public function getByCategory(int $categoryId): LengthAwarePaginator
    {
        return $this->getWithFilters(['category_id' => $categoryId]);
    }

    /**
     * Get products by brand.
     */
    public function getByBrand(int $brandId): LengthAwarePaginator
    {
        return $this->getWithFilters(['brand_id' => $brandId]);
    }

    /**
     * Get low stock products.
     */
    public function getLowStock(int $threshold = 10): LengthAwarePaginator
    {
        return Product::where('inventory_quantity', '<=', $threshold)
            ->where('inventory_quantity', '>', 0)
            ->with(['category', 'brand'])
            ->paginate(15);
    }
}
