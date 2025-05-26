<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\SaleController;

// Menu routes
Route::get('/menus', [MenuController::class, 'index']);
Route::post('/menus', [MenuController::class, 'store']);
Route::get('/menus/{id}', [MenuController::class, 'show']);
Route::put('/menus/{id}', [MenuController::class, 'update']);
Route::delete('/menus/{id}', [MenuController::class, 'destroy']);

// Sales routes
Route::get('/sales', [SaleController::class, 'index']);
Route::post('/sales', [SaleController::class, 'store']);
Route::get('/sales/{id}', [SaleController::class, 'show']);
Route::delete('/sales/{id}', [SaleController::class, 'destroy']);
Route::get('/sales-trend', [SaleController::class, 'salesTrend']);
