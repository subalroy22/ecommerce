<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $brands = [
            ['name' => 'Apple', 'slug' => 'apple', 'description' => 'Premium technology products', 'is_active' => true],
            ['name' => 'Samsung', 'slug' => 'samsung', 'description' => 'Electronics and appliances', 'is_active' => true],
            ['name' => 'Sony', 'slug' => 'sony', 'description' => 'Entertainment and electronics', 'is_active' => true],
            ['name' => 'Nike', 'slug' => 'nike', 'description' => 'Sports apparel and equipment', 'is_active' => true],
            ['name' => 'Adidas', 'slug' => 'adidas', 'description' => 'Sports and lifestyle brand', 'is_active' => true],
            ['name' => 'Dell', 'slug' => 'dell', 'description' => 'Computer hardware and electronics', 'is_active' => true],
            ['name' => 'HP', 'slug' => 'hp', 'description' => 'Computing and printing solutions', 'is_active' => true],
            ['name' => 'Lenovo', 'slug' => 'lenovo', 'description' => 'Personal computers and electronics', 'is_active' => true],
            ['name' => 'LG', 'slug' => 'lg', 'description' => 'Home appliances and electronics', 'is_active' => true],
            ['name' => 'Bose', 'slug' => 'bose', 'description' => 'Premium audio equipment', 'is_active' => true],
            ['name' => 'Canon', 'slug' => 'canon', 'description' => 'Cameras and imaging products', 'is_active' => true],
            ['name' => 'Nikon', 'slug' => 'nikon', 'description' => 'Photography equipment', 'is_active' => true],
        ];

        foreach ($brands as $brand) {
            Brand::create($brand);
        }
    }
}
