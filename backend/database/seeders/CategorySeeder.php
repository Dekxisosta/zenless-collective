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
        //? Dummy data for Category
        //? create method for the model - used for seeders (inputs single data)
        Category::create([
            'name' => 'Shoes',
            'slug' => 'shoes',
            'image_url' => 'https://example.com/images/categories/shoes.jpg',
            'description' => 'Footwear for all occasions'
        ]);

        Category::create([
            'name' => 'Bags',
            'slug' => 'bags',
            'image_url' => 'https://example.com/images/categories/bags.jpg',
            'description' => 'Stylish bags and backpacks'
        ]);
    }
}
