<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductImage;
use App\Repositories\ProductImageRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class ProductImageService
{
    public function __construct(
        protected ProductImageRepository $imageRepository
    ) {}

    /**
     * Upload and attach images to a product.
     */
    public function uploadImages(Product $product, array $images): void
    {
        DB::beginTransaction();
        try {
            $existingImagesCount = $this->imageRepository->countByProductId($product->id);
            $isFirstImage = $existingImagesCount === 0;

            foreach ($images as $index => $image) {
                if ($image instanceof UploadedFile) {
                    $path = $this->imageRepository->storeImage($image);
                    
                    $this->imageRepository->create([
                        'product_id' => $product->id,
                        'path' => $path,
                        'is_primary' => $isFirstImage && $index === 0,
                        'sort_order' => $existingImagesCount + $index,
                    ]);
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete specific images from a product.
     */
    public function deleteImages(Product $product, array $imageIds): void
    {
        DB::beginTransaction();
        try {
            $images = $this->imageRepository->findByIdsForProduct($imageIds, $product->id);

            foreach ($images as $image) {
                $this->imageRepository->deleteImageFile($image->path);
                $this->imageRepository->delete($image);
            }

            // If primary image was deleted, set first remaining image as primary
            if (!$this->imageRepository->hasPrimaryImage($product->id)) {
                $firstImage = $this->imageRepository->getFirstImage($product->id);
                if ($firstImage) {
                    $this->imageRepository->setPrimary($firstImage);
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete all images for a product.
     */
    public function deleteAllImages(Product $product): void
    {
        DB::beginTransaction();
        try {
            $images = $this->imageRepository->getByProductId($product->id);

            foreach ($images as $image) {
                $this->imageRepository->deleteImageFile($image->path);
                $this->imageRepository->delete($image);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Set an image as primary.
     */
    public function setPrimaryImage(ProductImage $image): bool
    {
        return $this->imageRepository->setPrimary($image);
    }

    /**
     * Get all images for a product.
     */
    public function getProductImages(int $productId)
    {
        return $this->imageRepository->getByProductId($productId);
    }

    /**
     * Get primary image for a product.
     */
    public function getPrimaryImage(int $productId): ?ProductImage
    {
        return $this->imageRepository->getPrimaryImage($productId);
    }
}
