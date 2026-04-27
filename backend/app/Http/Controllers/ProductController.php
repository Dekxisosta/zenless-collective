<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Product;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        try {
            //? Prepares a query statement to pass to the Product table 
            $query = Product::query();
            
            //? check the request model if its exactly with the category_id
            if($request->category_id){
                $query->where('category_id', $request->category_id);
            }
             //? check the request model if its exactly with the pill
            if($request->pill){
                $query->where('pill', $request->pill);
            }

             //? gets the products an insert into array of products
            $product = $query->get();

            return response()->json(['message' => 'Successfully retrieved product/s', 'product' => $product], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
    public function show($id){
         try {
            $product = Product::findOrFail($id);
            
            return response()->json(['message' => 'Product successfully retrieved.', 'product' => $product], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

}
