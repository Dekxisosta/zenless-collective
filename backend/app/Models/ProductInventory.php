<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductInventory extends Model
{
    protected $fillable = ['product_id', 'stock', 'sold'];
}
