<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Services\ProductService;
use App\Services\CategoryService;
use App\Services\BrandService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        protected ProductService $productService,
        protected CategoryService $categoryService,
        protected BrandService $brandService
    ) {}

    /**
     * Display a listing of products.
     */
    public function index(Request $request)
    {
        $filters = $request->only([
            'search',
            'category_id',
            'brand_id',
            'min_price',
            'max_price',
            'in_stock',
            'featured',
            'sort_by',
            'sort_order',
            'per_page'
        ]);

        // Check if this is an admin route by checking the route name
        if ($request->route()->getName() === 'admin.products.index') {
            // Admin view - show all products (active and inactive)
            $products = $this->productService->getAllProducts($filters);
            return Inertia::render('Admin/Products/Index', [
                'products' => $products,
                'filters' => $filters,
            ]);
        }
        
        // Home/Storefront view - only show active products
        $filters['is_active'] = true;
        $products = $this->productService->getAllProducts($filters);
        $categories = $this->categoryService->getAllActiveCategories();
        $brands = $this->brandService->getAllActiveBrands();

        return Inertia::render('Home', [
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        $this->authorize('create', Product::class);

        $categories = $this->categoryService->getAllActiveCategories();
        $brands = $this->brandService->getAllActiveBrands();

        return Inertia::render('Admin/Products/Create', [
            'categories' => $categories,
            'brands' => $brands,
        ]);
    }

    /**
     * Store a newly created product.
     */
    public function store(StoreProductRequest $request)
    {
        $product = $this->productService->createProduct($request->validated());

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product, Request $request)
    {
        $product->load(['category', 'brand', 'images']);

        // For public storefront, check if product is active
        if ($request->route()->getName() === 'product.show' && !$product->is_active) {
            abort(404);
        }

        // Get related products from same category
        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->active()
            ->inStock()
            ->limit(4)
            ->get();

        return Inertia::render('Products/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(Product $product)
    {
        $this->authorize('update', $product);

        $product->load(['category', 'brand', 'images']);
        $categories = $this->categoryService->getAllActiveCategories();
        $brands = $this->brandService->getAllActiveBrands();

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'categories' => $categories,
            'brands' => $brands,
        ]);
    }

    /**
     * Update the specified product.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $this->productService->updateProduct($product, $request->validated());

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified product.
     */
    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);

        $this->productService->deleteProduct($product);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }
}

