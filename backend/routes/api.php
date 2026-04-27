<?php
//? INFO: Use singular when it's an ACTION not a resource!! 

//? Controllers
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AddressController;
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

//TODO: Need to set up the routes for public browsing vs private browsing (with acc) 
//? Checks for user end if logged in or not != blocked by the system 
Route::middleware('auth:sanctum')->group(function () {
    //* ALL PROTECTED ROUTES HERE 
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [UserController::class, 'getProfile']);
    Route::patch('/profile', [UserController::class, 'updateProfile']);
    
    Route::get('/addresses', [AddressController::class, 'getAddresses']);
    Route::post('/addresses', [AddressController::class, 'addAddress']);
    Route::patch('/addresses/{id}', [AddressController::class, 'updateAddress']);
    Route::delete('/addresses/{id}', [AddressController::class, 'deleteAddress']);
    Route::patch('/addresses/{id}/default', [AddressController::class, 'setDefault']);

    //TODO: Pages that needs to be here cart, cart items, order, order items, payment, checkout
    
});

//* ------------------------------------------------------------

//* ---------------------- PRODUCT ROUTES ----------------------  

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
// TODO: Pages that needs product inventory, product images

//* ---------------------------------------------------------- 

//* ---------------------- CATEGORY ROUTES ----------------------  

Route::get('categories', [CategoryController::class, 'index']);
Route::get('categories/{id}', [CategoryController::class, 'show']);

//* ---------------------------------------------------------- 
