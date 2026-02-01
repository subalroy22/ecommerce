<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Electronics',
                'slug' => 'electronics',
                'description' => 'Electronic devices and gadgets',
                'is_active' => true,
                'children' => [
                    ['name' => 'Smartphones', 'slug' => 'smartphones', 'description' => 'Mobile phones and accessories', 'is_active' => true],
                    ['name' => 'Laptops', 'slug' => 'laptops', 'description' => 'Portable computers', 'is_active' => true],
                    ['name' => 'Tablets', 'slug' => 'tablets', 'description' => 'Tablet devices', 'is_active' => true],
                    ['name' => 'Headphones', 'slug' => 'headphones', 'description' => 'Audio devices', 'is_active' => true],
                ]
            ],
            [
                'name' => 'Clothing',
                'slug' => 'clothing',
                'description' => 'Fashion and apparel',
                'is_active' => true,
                'children' => [
                    ['name' => 'Men\'s Clothing', 'slug' => 'mens-clothing', 'description' => 'Clothing for men', 'is_active' => true],
                    ['name' => 'Women\'s Clothing', 'slug' => 'womens-clothing', 'description' => 'Clothing for women', 'is_active' => true],
                    ['name' => 'Kids Clothing', 'slug' => 'kids-clothing', 'description' => 'Clothing for children', 'is_active' => true],
                ]
            ],
            [
                'name' => 'Home & Kitchen',
                'slug' => 'home-kitchen',
                'description' => 'Home appliances and kitchen items',
                'is_active' => true,
                'children' => [
                    ['name' => 'Furniture', 'slug' => 'furniture', 'description' => 'Home furniture', 'is_active' => true],
                    ['name' => 'Kitchen Appliances', 'slug' => 'kitchen-appliances', 'description' => 'Cooking and kitchen tools', 'is_active' => true],
                    ['name' => 'Home Decor', 'slug' => 'home-decor', 'description' => 'Decorative items', 'is_active' => true],
                ]
            ],
            [
                'name' => 'Sports & Outdoors',
                'slug' => 'sports-outdoors',
                'description' => 'Sports equipment and outdoor gear',
                'is_active' => true,
                'children' => [
                    ['name' => 'Fitness Equipment', 'slug' => 'fitness-equipment', 'description' => 'Exercise and fitness gear', 'is_active' => true],
                    ['name' => 'Camping & Hiking', 'slug' => 'camping-hiking', 'description' => 'Outdoor adventure gear', 'is_active' => true],
                ]
            ],
            [
                'name' => 'Books',
                'slug' => 'books',
                'description' => 'Books and reading materials',
                'is_active' => true,
                'children' => [
                    ['name' => 'Fiction', 'slug' => 'fiction', 'description' => 'Fiction books', 'is_active' => true],
                    ['name' => 'Non-Fiction', 'slug' => 'non-fiction', 'description' => 'Non-fiction books', 'is_active' => true],
                ]
            ],
        ];

        foreach ($categories as $categoryData) {
            $children = $categoryData['children'] ?? [];
            unset($categoryData['children']);

            $category = Category::create($categoryData);

            foreach ($children as $childData) {
                $childData['parent_id'] = $category->id;
                Category::create($childData);
            }
        }
    }
}
