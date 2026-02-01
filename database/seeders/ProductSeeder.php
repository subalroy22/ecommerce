<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get categories and brands
        $smartphones = Category::where('slug', 'smartphones')->first();
        $laptops = Category::where('slug', 'laptops')->first();
        $tablets = Category::where('slug', 'tablets')->first();
        $headphones = Category::where('slug', 'headphones')->first();
        $mensClothing = Category::where('slug', 'mens-clothing')->first();
        $womensClothing = Category::where('slug', 'womens-clothing')->first();
        $fitness = Category::where('slug', 'fitness-equipment')->first();

        $apple = Brand::where('slug', 'apple')->first();
        $samsung = Brand::where('slug', 'samsung')->first();
        $sony = Brand::where('slug', 'sony')->first();
        $nike = Brand::where('slug', 'nike')->first();
        $dell = Brand::where('slug', 'dell')->first();
        $hp = Brand::where('slug', 'hp')->first();
        $bose = Brand::where('slug', 'bose')->first();

        $products = [
            // Smartphones
            [
                'name' => 'iPhone 15 Pro',
                'slug' => 'iphone-15-pro',
                'sku' => 'APL-IP15P-001',
                'description' => 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system',
                'price' => 999.99,
                'compare_price' => 1099.99,
                'category_id' => $smartphones->id,
                'brand_id' => $apple->id,
                'inventory_quantity' => 50,
                'is_active' => true,
                'featured' => true,
            ],
            [
                'name' => 'Samsung Galaxy S24 Ultra',
                'slug' => 'samsung-galaxy-s24-ultra',
                'sku' => 'SAM-GS24U-001',
                'description' => 'Premium Android smartphone with S Pen, 200MP camera, and AI features',
                'price' => 1199.99,
                'compare_price' => 1299.99,
                'category_id' => $smartphones->id,
                'brand_id' => $samsung->id,
                'inventory_quantity' => 35,
                'is_active' => true,
                'featured' => true,
            ],
            [
                'name' => 'iPhone 14',
                'slug' => 'iphone-14',
                'sku' => 'APL-IP14-001',
                'description' => 'Powerful iPhone with A15 Bionic chip and dual camera system',
                'price' => 699.99,
                'compare_price' => 799.99,
                'category_id' => $smartphones->id,
                'brand_id' => $apple->id,
                'inventory_quantity' => 75,
                'is_active' => true,
                'featured' => false,
            ],

            // Laptops
            [
                'name' => 'MacBook Pro 16"',
                'slug' => 'macbook-pro-16',
                'sku' => 'APL-MBP16-001',
                'description' => 'Professional laptop with M3 Pro chip, stunning Liquid Retina XDR display',
                'price' => 2499.99,
                'compare_price' => 2699.99,
                'category_id' => $laptops->id,
                'brand_id' => $apple->id,
                'inventory_quantity' => 20,
                'is_active' => true,
                'featured' => true,
            ],
            [
                'name' => 'Dell XPS 15',
                'slug' => 'dell-xps-15',
                'sku' => 'DEL-XPS15-001',
                'description' => 'Premium Windows laptop with Intel Core i7, 4K display, and sleek design',
                'price' => 1799.99,
                'compare_price' => 1999.99,
                'category_id' => $laptops->id,
                'brand_id' => $dell->id,
                'inventory_quantity' => 30,
                'is_active' => true,
                'featured' => true,
            ],
            [
                'name' => 'HP Spectre x360',
                'slug' => 'hp-spectre-x360',
                'sku' => 'HP-SPX360-001',
                'description' => 'Convertible laptop with touchscreen, Intel Evo platform, and premium build',
                'price' => 1499.99,
                'compare_price' => null,
                'category_id' => $laptops->id,
                'brand_id' => $hp->id,
                'inventory_quantity' => 25,
                'is_active' => true,
                'featured' => false,
            ],

            // Tablets
            [
                'name' => 'iPad Pro 12.9"',
                'slug' => 'ipad-pro-129',
                'sku' => 'APL-IPP129-001',
                'description' => 'Powerful tablet with M2 chip, Liquid Retina XDR display, and Apple Pencil support',
                'price' => 1099.99,
                'compare_price' => 1199.99,
                'category_id' => $tablets->id,
                'brand_id' => $apple->id,
                'inventory_quantity' => 40,
                'is_active' => true,
                'featured' => true,
            ],
            [
                'name' => 'Samsung Galaxy Tab S9',
                'slug' => 'samsung-galaxy-tab-s9',
                'sku' => 'SAM-GTS9-001',
                'description' => 'Premium Android tablet with S Pen, AMOLED display, and DeX mode',
                'price' => 799.99,
                'compare_price' => 899.99,
                'category_id' => $tablets->id,
                'brand_id' => $samsung->id,
                'inventory_quantity' => 45,
                'is_active' => true,
                'featured' => false,
            ],

            // Headphones
            [
                'name' => 'AirPods Pro (2nd Gen)',
                'slug' => 'airpods-pro-2nd-gen',
                'sku' => 'APL-APP2-001',
                'description' => 'Premium wireless earbuds with active noise cancellation and spatial audio',
                'price' => 249.99,
                'compare_price' => null,
                'category_id' => $headphones->id,
                'brand_id' => $apple->id,
                'inventory_quantity' => 100,
                'is_active' => true,
                'featured' => true,
            ],
            [
                'name' => 'Sony WH-1000XM5',
                'slug' => 'sony-wh-1000xm5',
                'sku' => 'SNY-WH1000XM5-001',
                'description' => 'Industry-leading noise canceling headphones with exceptional sound quality',
                'price' => 399.99,
                'compare_price' => 449.99,
                'category_id' => $headphones->id,
                'brand_id' => $sony->id,
                'inventory_quantity' => 60,
                'is_active' => true,
                'featured' => true,
            ],
            [
                'name' => 'Bose QuietComfort 45',
                'slug' => 'bose-quietcomfort-45',
                'sku' => 'BSE-QC45-001',
                'description' => 'Premium wireless headphones with world-class noise cancellation',
                'price' => 329.99,
                'compare_price' => null,
                'category_id' => $headphones->id,
                'brand_id' => $bose->id,
                'inventory_quantity' => 55,
                'is_active' => true,
                'featured' => false,
            ],

            // Clothing
            [
                'name' => 'Nike Air Max Running Shoes',
                'slug' => 'nike-air-max-running-shoes',
                'sku' => 'NIK-AM-001',
                'description' => 'Comfortable running shoes with Air Max cushioning technology',
                'price' => 129.99,
                'compare_price' => 149.99,
                'category_id' => $mensClothing->id,
                'brand_id' => $nike->id,
                'inventory_quantity' => 80,
                'is_active' => true,
                'featured' => false,
            ],
            [
                'name' => 'Nike Sportswear Hoodie',
                'slug' => 'nike-sportswear-hoodie',
                'sku' => 'NIK-HOOD-001',
                'description' => 'Classic pullover hoodie with soft fleece fabric',
                'price' => 59.99,
                'compare_price' => null,
                'category_id' => $mensClothing->id,
                'brand_id' => $nike->id,
                'inventory_quantity' => 120,
                'is_active' => true,
                'featured' => false,
            ],

            // Fitness
            [
                'name' => 'Nike Yoga Mat',
                'slug' => 'nike-yoga-mat',
                'sku' => 'NIK-YOGA-001',
                'description' => 'Premium yoga mat with excellent grip and cushioning',
                'price' => 39.99,
                'compare_price' => null,
                'category_id' => $fitness->id,
                'brand_id' => $nike->id,
                'inventory_quantity' => 150,
                'is_active' => true,
                'featured' => false,
            ],

            // Low stock items
            [
                'name' => 'MacBook Air M2',
                'slug' => 'macbook-air-m2',
                'sku' => 'APL-MBA-M2-001',
                'description' => 'Thin and light laptop with M2 chip and all-day battery life',
                'price' => 1199.99,
                'compare_price' => 1299.99,
                'category_id' => $laptops->id,
                'brand_id' => $apple->id,
                'inventory_quantity' => 5,
                'is_active' => true,
                'featured' => true,
            ],

            // Out of stock item
            [
                'name' => 'Sony PlayStation 5',
                'slug' => 'sony-playstation-5',
                'sku' => 'SNY-PS5-001',
                'description' => 'Next-gen gaming console with 4K gaming and ultra-fast SSD',
                'price' => 499.99,
                'compare_price' => null,
                'category_id' => $smartphones->id, // Using smartphones as placeholder
                'brand_id' => $sony->id,
                'inventory_quantity' => 0,
                'is_active' => true,
                'featured' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
