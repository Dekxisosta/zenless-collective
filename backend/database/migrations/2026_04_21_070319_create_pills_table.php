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
        // TODO: ADD seeders for the pills
        /*
        INSERT INTO pills (label, priority) VALUES
            ('new', 1),
            ('bestseller', 2),
            ('trending', 3),
            ('sale', 4);
        */
        Schema::create('pills', function (Blueprint $table) {
            $table->id();
            $table->string('label', 50)->unique();
            $table->integer('priority')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pills');
    }
};
