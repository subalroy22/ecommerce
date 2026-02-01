<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'phone' => '+1234567890',
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create manager user
        User::create([
            'name' => 'Manager User',
            'email' => 'manager@example.com',
            'password' => Hash::make('password'),
            'phone' => '+1234567891',
            'role' => 'manager',
            'is_active' => true,
        ]);

        // Create support user
        User::create([
            'name' => 'Support User',
            'email' => 'support@example.com',
            'password' => Hash::make('password'),
            'phone' => '+1234567892',
            'role' => 'support',
            'is_active' => true,
        ]);

        // Create customer user
        User::create([
            'name' => 'Customer User',
            'email' => 'customer@example.com',
            'password' => Hash::make('password'),
            'phone' => '+1234567893',
            'role' => 'customer',
            'is_active' => true,
        ]);

        // Create additional customers
        User::factory(10)->create([
            'role' => 'customer',
        ]);
    }
}
