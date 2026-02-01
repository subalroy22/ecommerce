<?php

namespace App\Repositories;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProductImageRepository
{
    /**
     * Create a product image.
     */
    public function create(array $data): ProductImage
    {
        return ProductImage::create($data);
    }

    /**
     * Store uploaded image file.
     */
    public function storeImage(UploadedFile $file): string
    {
        return $file->store('products', 'public');
    }

    /**
     * Delete image file from storage.
     */
    public function deleteImageFile(string $path): bool
    {
        return Storage::disk('public')->delete($path);
    }

    /**
     * Delete a product image record.
     */
    public function delete(ProductImage $image): bool
    {
        return $image->delete();
    }

    /**
     * Get images by product ID.
     */
    public function getByProductId(int $productId)
    {
        return ProductImage::where('product_id', $productId)
            ->orderBy('sort_order')
            ->get();
    }

    /**
     * Find image by ID.
     */
    public function findById(int $id): ?ProductImage
    {
        return ProductImage::find($id);
    }

    /**
     * Find images by IDs for a specific product.
     */
    public function findByIdsForProduct(array $imageIds, int $productId)
    {
        return ProductImage::whereIn('id', $imageIds)
            ->where('product_id', $productId)
            ->get();
    }

    /**
     * Get primary image for a product.
     */
    public function getPrimaryImage(int $productId): ?ProductImage
    {
        return ProductImage::where('product_id', $productId)
            ->where('is_primary', true)
            ->first();
    }

    /**
     * Set image as primary.
     */
    public function setPrimary(ProductImage $image): bool
    {
        // Remove primary status from other images
        ProductImage::where('product_id', $image->product_id)
            ->where('id', '!=', $image->id)
            ->update(['is_primary' => false]);

        // Set this image as primary
        return $image->update(['is_primary' => true]);
    }

    /**
     * Get the count of images for a product.
     */
    public function countByProductId(int $productId): int
    {
        return ProductImage::where('product_id', $productId)->count();
    }

    /**
     * Get the first image for a product.
     */
    public function getFirstImage(int $productId): ?ProductImage
    {
        return ProductImage::where('product_id', $productId)
            ->orderBy('sort_order')
            ->first();
    }

    /**
     * Update image data.
     */
    public function update(ProductImage $image, array $data): ProductImage
    {
        $image->update($data);
        return $image->fresh();
    }

    /**
     * Check if product has primary image.
     */
    public function hasPrimaryImage(int $productId): bool
    {
        return ProductImage::where('product_id', $productId)
            ->where('is_primary', true)
            ->exists();
    }
}
