<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductInventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminInventoryController extends Controller
{
    public function index()
    {
        try {
            if (Auth::user()->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }

            $inventory = ProductInventory::with('product')->get();
            return response()->json(['inventory' => $inventory], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $productId)
    {
        try {
            if (Auth::user()->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }

            $request->validate([
                'stock' => 'sometimes|integer|min:0',
                'sold'  => 'sometimes|integer|min:0',
            ]);

            $inventory = ProductInventory::where('product_id', $productId)->firstOrFail();
            $inventory->update([
                'stock' => $request->stock ?? $inventory->stock,
                'sold'  => $request->sold ?? $inventory->sold,
            ]);

            return response()->json(['message' => 'Inventory updated!!', 'inventory' => $inventory], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}