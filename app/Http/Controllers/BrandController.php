<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBrandRequest;
use App\Http\Requests\UpdateBrandRequest;
use App\Models\Brand;
use App\Services\BrandService;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BrandController extends Controller
{
    public function __construct(
        protected BrandService $brandService,
        protected ProductService $productService
    ) {}

    /**
     * Display a listing of brands.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'is_active', 'per_page']);

        $brands = $this->brandService->getAllBrands($filters);

        return Inertia::render('Admin/Brands/Index', [
            'brands' => $brands,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new brand.
     */
    public function create()
    {
        $this->authorize('create', Brand::class);

        return Inertia::render('Admin/Brands/Create');
    }

    /**
     * Store a newly created brand.
     */
    public function store(StoreBrandRequest $request)
    {
        $brand = $this->brandService->createBrand($request->validated());

        return redirect()->route('admin.brands.index')
            ->with('success', 'Brand created successfully.');
    }

    /**
     * Display the specified brand with its products.
     */
    public function show(Brand $brand, Request $request)
    {
        $filters = $request->only([
            'search',
            'category_id',
            'min_price',
            'max_price',
            'in_stock',
            'sort_by',
            'sort_order',
            'per_page'
        ]);

        $filters['brand_id'] = $brand->id;

        $products = $this->productService->getAllProducts($filters);

        return Inertia::render('Brands/Show', [
            'brand' => $brand,
            'products' => $products,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for editing the specified brand.
     */
    public function edit(Brand $brand)
    {
        $this->authorize('update', $brand);

        return Inertia::render('Admin/Brands/Edit', [
            'brand' => $brand,
        ]);
    }

    /**
     * Update the specified brand.
     */
    public function update(UpdateBrandRequest $request, Brand $brand)
    {
        $this->brandService->updateBrand($brand, $request->validated());

        return redirect()->route('admin.brands.index')
            ->with('success', 'Brand updated successfully.');
    }

    /**
     * Remove the specified brand.
     */
    public function destroy(Brand $brand)
    {
        $this->authorize('delete', $brand);

        $this->brandService->deleteBrand($brand);

        return redirect()->route('admin.brands.index')
            ->with('success', 'Brand deleted successfully.');
    }
}
