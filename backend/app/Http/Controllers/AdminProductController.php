<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductInventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminProductController extends Controller
{
    public function index()
    {
        try {
            if (Auth::user()->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }

            $products = Product::with(['inventory', 'images', 'category', 'pill'])->get();
            return response()->json(['products' => $products], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            if (Auth::user()->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }

            $request->validate([
                'name'        => 'required|string',
                'price'       => 'required|numeric',
                'category_id' => 'required|exists:categories,id',
            ]);

            $product = Product::create($request->all());

            ProductInventory::create([
                'product_id' => $product->id,
                'stock'      => $request->stock ?? 0,
                'sold'       => 0,
            ]);

            return response()->json(['message' => 'Product created!!', 'product' => $product], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            if (Auth::user()->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }

            $product = Product::findOrFail($id);
            $product->update($request->all());

            return response()->json(['message' => 'Product updated!!', 'product' => $product], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            if (Auth::user()->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }

            Product::findOrFail($id)->delete();
            return response()->json(['message' => 'Product deleted!!'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}