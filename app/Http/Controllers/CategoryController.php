<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use App\Services\CategoryService;
use App\Services\ProductService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        protected CategoryService $categoryService,
        protected ProductService $productService
    ) {}

    /**
     * Display a listing of categories.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'is_active', 'per_page']);

        $categories = $this->categoryService->getAllCategories($filters);

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new category.
     */
    public function create()
    {
        $this->authorize('create', Category::class);

        $categories = $this->categoryService->getAllActiveCategories();

        return Inertia::render('Admin/Categories/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created category.
     */
    public function store(StoreCategoryRequest $request)
    {
        $category = $this->categoryService->createCategory($request->validated());

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category created successfully.');
    }

    /**
     * Display the specified category with its products.
     */
    public function show(Category $category, Request $request)
    {
        // For public storefront, check if category is active
        if ($request->route()->getName() === 'category.show' && !$category->is_active) {
            abort(404);
        }

        $category->load(['parent', 'children']);

        $filters = $request->only([
            'search',
            'brand_id',
            'min_price',
            'max_price',
            'in_stock',
            'sort_by',
            'sort_order',
            'per_page'
        ]);

        $filters['category_id'] = $category->id;
        // For public storefront, only show active products
        if ($request->route()->getName() === 'category.show') {
            $filters['is_active'] = true;
        }

        $products = $this->productService->getAllProducts($filters);

        return Inertia::render('Categories/Show', [
            'category' => $category,
            'products' => $products,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for editing the specified category.
     */
    public function edit(Category $category)
    {
        $this->authorize('update', $category);

        $category->load(['parent', 'children']);
        $categories = $this->categoryService->getAllActiveCategories();

        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified category.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $this->categoryService->updateCategory($category, $request->validated());

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified category.
     */
    public function destroy(Category $category)
    {
        $this->authorize('delete', $category);

        $this->categoryService->deleteCategory($category);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}
