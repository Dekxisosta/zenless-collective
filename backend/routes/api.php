<?php
//? INFO: Use singular when it's an ACTION not a resource!! 

//? Controllers
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserImageController;

use App\Http\Controllers\AddressController;

use App\Http\Controllers\PillController;

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\ProductInventoryController;

use App\Http\Controllers\CartController;
use App\Http\Controllers\CartItemController;

use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderItemController;

use App\Http\Controllers\PaymentController;

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminInventoryController;
use App\Http\Controllers\Admin\AdminCustomerController;
use App\Http\Controllers\Admin\AdminPaymentController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//* ---------------------- USER ROUTES ----------------------  
//? 1st param -> creates path (the URL/door)
//? 2nd param -> [which controller, which function to run]
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

//* ------------------------------------------------------------

//* ---------------------- CATEGORY ROUTES ----------------------  

Route::get('categories', [CategoryController::class, 'index']);
Route::get('categories/{id}', [CategoryController::class, 'show']);

//* ------------------------------------------------------------

//* ---------------------------------------------------------- 

//* -------- Pills (Public) --------
Route::get('/pills', [PillController::class, 'index']);

//* ------------------------------------------------------------

//? Checks for user end if logged in or not != blocked by the system 
Route::middleware('auth:sanctum')->group(function () {
    //* ALL PROTECTED ROUTES HERE ]

    //* -------- Auth & User Api --------  
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [UserController::class, 'getProfile']);
    Route::patch('/profile', [UserController::class, 'updateProfile']);

    //* -------- User Images --------
    Route::get('/profile/avatar', [UserImageController::class, 'show']);
    Route::post('/profile/avatar', [UserImageController::class, 'store']);
    Route::patch('/profile/avatar', [UserImageController::class, 'update']);

    //* -------- Address Api --------  
    Route::get('/addresses', [AddressController::class, 'getAddresses']);
    Route::post('/addresses', [AddressController::class, 'addAddress']);
    Route::patch('/addresses/{id}', [AddressController::class, 'updateAddress']);
    Route::delete('/addresses/{id}', [AddressController::class, 'deleteAddress']);
    Route::patch('/addresses/{id}/default', [AddressController::class, 'setDefault']);

    //* -------- Product Inventory (ADMIN) --------
    Route::get('/admin/products/{id}/inventory', [ProductInventoryController::class, 'show']);
    Route::patch('/admin/products/{id}/inventory', [ProductInventoryController::class, 'update']);

    //* -------- Cart Api --------  
    Route::get('/cart', [CartController::class, 'index']);
    Route::delete('/cart', [CartController::class, 'clear']);

    //* -------- Cart Item Api --------    
    Route::post('/cart/items', [CartItemController::class, 'store']);
    Route::patch('/cart/items/{id}', [CartItemController::class, 'update']);
    Route::delete('/cart/items/{id}', [CartItemController::class, 'destroy']);

    //* -------- Order  Api --------    
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'checkout']);
    Route::patch('/orders/{id}', [OrderController::class, 'cancel']);

    //* -------- Order  Api (ADMIN) --------  
    Route::get('/admin/orders', [OrderController::class, 'adminIndex']);
    Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);

    //* -------- Order Item Api --------    
    Route::get('/orders/{orderId}/items', [OrderItemController::class, 'index']);
    Route::get('/orders/{orderId}/items/{itemId}', [OrderItemController::class, 'show']);

    //* -------- Payment Api -------- 
    Route::post('/payments', [PaymentController::class, 'store']);
    Route::get('/payments/{orderId}', [PaymentController::class, 'show']);
    Route::patch('/payments/{id}/status', [PaymentController::class, 'updateStatus']);

    //* -------- ADMIN ROUTES --------
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);
        
        Route::get('/products', [AdminProductController::class, 'index']);
        Route::post('/products', [AdminProductController::class, 'store']);
        Route::put('/products/{id}', [AdminProductController::class, 'update']);
        Route::delete('/products/{id}', [AdminProductController::class, 'destroy']);

        Route::get('/inventory', [AdminInventoryController::class, 'index']);
        Route::patch('/inventory/{productId}', [AdminInventoryController::class, 'update']);

        Route::get('/payments', [AdminPaymentController::class, 'index']);
        Route::get('/payments/{id}', [AdminPaymentController::class, 'show']);

        Route::get('/customers', [AdminCustomerController::class, 'index']);
        Route::delete('/customers/{id}', [AdminCustomerController::class, 'destroy']);
        Route::get('/customers/{id}/cart', [AdminCustomerController::class, 'cart']);
        Route::get('/customers/{id}/orders', [AdminCustomerController::class, 'orders']);
    });
});

//* ------------------------------------------------------------

//* ---------------------- PRODUCT ROUTES ----------------------  

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

//* ---------------------------------------------------------- 

//* -------- Product Images (Public) --------
Route::get('/products/{id}/images', [ProductImageController::class, 'index']);

//* ---------------------------------------------------------- 


