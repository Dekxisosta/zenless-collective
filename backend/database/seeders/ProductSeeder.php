<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::insert([
            [
                'name' => 'Nike Air Force 1',
                'description' => 'Classic white sneakers perfect for everyday wear.',
                'price' => 999.99,
                'discount_percent' => 10.00,

                'brand' => 'Nike',
                'sku' => 'NK-AF1-001',

                'size' => 'M',

                'shipping_from' => 'Manila',
                'shipping_fee' => 99.00,
                'shipping_days_min' => 3,
                'shipping_days_max' => 5,

                'pill_id' => null,
                'category_id' => 1,

                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Adidas Ultraboost',
                'description' => 'High performance running shoes with responsive cushioning.',
                'price' => 1299.99,
                'discount_percent' => null,

                'brand' => 'Adidas',
                'sku' => 'AD-UB-001',

                'size' => 'L',

                'shipping_from' => 'Cebu',
                'shipping_fee' => 120.00,
                'shipping_days_min' => 5,
                'shipping_days_max' => 7,

                'pill_id' => null,
                'category_id' => 1,

                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}