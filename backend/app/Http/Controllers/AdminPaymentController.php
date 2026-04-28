<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminPaymentController extends Controller
{
    public function index()
    {
        try {
            if (Auth::user()->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }

            $payments = Payment::with('order')->orderBy('created_at', 'desc')->get();
            return response()->json(['payments' => $payments], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            if (Auth::user()->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }

            $payment = Payment::with('order')->findOrFail($id);
            return response()->json(['payment' => $payment], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}