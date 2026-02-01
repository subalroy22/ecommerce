<?php

namespace App\Services;

use App\Models\Category;
use App\Repositories\CategoryRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategoryService
{
    public function __construct(
        protected CategoryRepository $categoryRepository
    ) {}

    /**
     * Get all categories.
     */
    public function getAllCategories(array $filters = [])
    {
        return $this->categoryRepository->getAll($filters);
    }

    /**
     * Get a single category by ID.
     */
    public function getCategoryById(int $id)
    {
        return $this->categoryRepository->findById($id);
    }

    /**
     * Create a new category.
     */
    public function createCategory(array $data): Category
    {
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        return $this->categoryRepository->create($data);
    }

    /**
     * Update an existing category.
     */
    public function updateCategory(Category $category, array $data): Category
    {
        if (isset($data['name']) && $data['name'] !== $category->name) {
            $data['slug'] = Str::slug($data['name']);
        }

        return $this->categoryRepository->update($category, $data);
    }

    /**
     * Delete a category.
     */
    public function deleteCategory(Category $category): bool
    {
        return $this->categoryRepository->delete($category);
    }

    /**
     * Get root categories (no parent).
     */
    public function getRootCategories()
    {
        return $this->categoryRepository->getRoots();
    }

    /**
     * Get category tree.
     */
    public function getCategoryTree()
    {
        return $this->categoryRepository->getTree();
    }
}
