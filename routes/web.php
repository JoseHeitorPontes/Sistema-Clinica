<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
use App\Http\Controllers\PatientController;
Route::get('/', [PatientController::class, 'index']);
Route::get('/pacientes', [PatientController::class, 'list']);
Route::post('/cadastro', [PatientController::class, 'store']);
Route::delete('/pacientes/{id}', [PatientController::class, 'destroy']);
Route::get('/editar/{id}', [PatientController::class, 'edit']);
Route::match(['get','post'],'/atualizar/{id}', [PatientController::class, 'update']);
Route::get('/atender/{id}', [PatientController::class, 'attendance']);
Route::match(['get','post'],'/diagnosticar/{id}', [PatientController::class, 'diagnosis']);