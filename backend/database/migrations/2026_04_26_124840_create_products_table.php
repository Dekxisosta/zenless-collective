<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();

            $table->decimal('price', 10, 2);
            $table->decimal('discount_percent', 5, 2)->default(null)->nullable();

            $table->string('brand', 100)->nullable();
            $table->string('sku', 100)->unique()->nullable();
            //? Made the dimensions from the last update into enums (universal sizing)
            $table->enum('size', ['XS', 'S', 'M', 'L', 'XL', 'XXL'])->default(null)->nullable();

            $table->string('shipping_from', 150)->nullable();
            $table->decimal('shipping_fee', 10, 2)->nullable();
            $table->integer('shipping_days_min')->default(null)->nullable();
            $table->integer('shipping_days_max')->default(null)->nullable();

            $table->foreignId('pill_id')->nullable()->constrained()->onDelete('cascade');

            //? constrained() func, assumes the foreign id belong to categories, onDelete(cascade) will be tampered if the primary key of the foreign key was deleted
            $table->foreignId('category_id')->constrained()->onDelete('cascade');

            //? creates both created_at and updated_at timestamps
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
