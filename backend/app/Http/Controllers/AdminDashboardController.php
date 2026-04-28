<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Support\Facades\Auth;

class AdminDashboardController extends Controller
{
    public function index()
    {
        try {
            if (Auth::user()->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }

            return response()->json([
                'total_users'    => User::count(),
                'total_products' => Product::count(),
                'total_orders'   => Order::count(),
                'total_revenue'  => Payment::where('status', 'completed')->sum('amount'),
                'pending_orders' => Order::where('status', 'pending')->count(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}