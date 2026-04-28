<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Support\Facades\Auth;

class AdminCustomerController extends Controller
{
    // GET all customers
    public function index()
    {
        try {
            if (Auth::user()->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }

            $users = User::where('role', 'user')->get();
            return response()->json(['customers' => $users], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    // DELETE a customer
    public function destroy($id)
    {
        try {
            if (Auth::user()->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }

            User::findOrFail($id)->delete();
            return response()->json(['message' => 'Customer deleted!!'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    // GET customer's cart
    public function cart($id)
    {
        try {
            if (Auth::user()->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }

            $cart = Cart::where('user_id', $id)->with('items.product')->first();

            if (!$cart) {
                return response()->json(['message' => 'No cart found.'], 404);
            }

            return response()->json(['cart' => $cart], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    // GET customer's order history
    public function orders($id)
    {
        try {
            if (Auth::user()->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }

            $orders = Order::where('user_id', $id)
                ->with('orderItems')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json(['orders' => $orders], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}