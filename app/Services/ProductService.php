<?php

namespace App\Services;

use App\Models\Product;
use App\Repositories\ProductRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductService
{
    public function __construct(
        protected ProductRepository $productRepository,
        protected ProductImageService $imageService
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

            // Extract images from data
            $images = $data['images'] ?? [];
            unset($data['images']);

            $product = $this->productRepository->create($data);

            // Handle image uploads
            if (!empty($images)) {
                $this->imageService->uploadImages($product, $images);
            }

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

            // Extract images and delete_images from data
            $images = $data['images'] ?? [];
            $deleteImages = $data['delete_images'] ?? [];
            unset($data['images'], $data['delete_images']);

            $product = $this->productRepository->update($product, $data);

            // Handle image deletions
            if (!empty($deleteImages)) {
                $this->imageService->deleteImages($product, $deleteImages);
            }

            // Handle new image uploads
            if (!empty($images)) {
                $this->imageService->uploadImages($product, $images);
            }

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
        DB::beginTransaction();
        try {
            // Delete all product images
            $this->imageService->deleteAllImages($product);

            // Delete product
            $result = $this->productRepository->delete($product);

            DB::commit();
            return $result;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
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
