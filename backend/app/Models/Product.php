<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    // TODO: Finish the fillable function for products (exclude id)
    protected $fillable = [
        'name',
        'description',
        'price',
        'discount_percent',
        'brand',
        'sku',
        'size',
        'shipping_from',
        'shipping_fee',
        'shipping_days_min',
        'shipping_days_max',
        'pill_id',
        'category_id'
    ];
}
