<?php

namespace App\Repositories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository
{
    /**
     * Get all categories with pagination.
     */
    public function getAll(array $filters = [])
    {
        $query = Category::query();

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        if (isset($filters['search']) && !empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        $perPage = $filters['per_page'] ?? 15;

        return $query->orderBy('sort_order')->orderBy('name')->with('parent')->withCount('products')->paginate($perPage);
    }

    /**
     * Get all active categories without pagination.
     */
    public function getAllActive(): Collection
    {
        return Category::active()->orderBy('sort_order')->orderBy('name')->get();
    }

    /**
     * Find category by ID.
     */
    public function findById(int $id): ?Category
    {
        return Category::with(['parent', 'children', 'products'])->find($id);
    }

    /**
     * Create a new category.
     */
    public function create(array $data): Category
    {
        return Category::create($data);
    }

    /**
     * Update a category.
     */
    public function update(Category $category, array $data): Category
    {
        $category->update($data);
        return $category->fresh();
    }

    /**
     * Delete a category.
     */
    public function delete(Category $category): bool
    {
        return $category->delete();
    }

    /**
     * Get root categories.
     */
    public function getRoots(): Collection
    {
        return Category::roots()->active()->orderBy('sort_order')->get();
    }

    /**
     * Get category tree.
     */
    public function getTree(): Collection
    {
        return Category::with('children')->roots()->active()->orderBy('sort_order')->get();
    }
}
