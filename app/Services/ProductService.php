<?php

namespace App\Services;

use App\Models\Product;
use App\Repositories\ProductRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductService
{
    public function __construct(
        protected ProductRepository $productRepository
    ) {}

    /**
     * Get all products with filters.
     */
    public function getAllProducts(array $filters = [])
    {
        return $this->productRepository->getWithFilters($filters);
    }

    /**
     * Get a single product by ID.
     */
    public function getProductById(int $id)
    {
        return $this->productRepository->findById($id);
    }

    /**
     * Create a new product.
     */
    public function createProduct(array $data): Product
    {
        DB::beginTransaction();
        try {
            // Generate slug if not provided
            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);
            }

            $product = $this->productRepository->create($data);

            DB::commit();
            return $product;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update an existing product.
     */
    public function updateProduct(Product $product, array $data): Product
    {
        DB::beginTransaction();
        try {
            // Update slug if name changed
            if (isset($data['name']) && $data['name'] !== $product->name) {
                $data['slug'] = Str::slug($data['name']);
            }

            $product = $this->productRepository->update($product, $data);

            DB::commit();
            return $product;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete a product.
     */
    public function deleteProduct(Product $product): bool
    {
        return $this->productRepository->delete($product);
    }

    /**
     * Update product inventory.
     */
    public function updateInventory(Product $product, int $quantity): void
    {
        $this->productRepository->updateInventory($product, $quantity);
    }

    /**
     * Check if product is available in requested quantity.
     */
    public function checkAvailability(Product $product, int $quantity): bool
    {
        return $product->inventory_quantity >= $quantity;
    }

    /**
     * Search products.
     */
    public function searchProducts(string $query, array $filters = [])
    {
        return $this->productRepository->search($query, $filters);
    }
}
