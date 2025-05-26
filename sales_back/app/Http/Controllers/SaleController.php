<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    public function index()
    {
        $sales = Sale::with('menu')->get()->map(function ($sale) {
            return [
                'sales_id' => $sale->sales_id,
                'menu_id' => $sale->menu_id,
                'menu_name' => $sale->menu->menu_name,
                'menu_price' => $sale->menu->menu_price,
                'quantity' => $sale->quantity,
                'total_price' => $sale->quantity * $sale->menu->menu_price,
                'created_at' => $sale->created_at,
                'updated_at' => $sale->updated_at
            ];
        });

        return response()->json($sales);
    }

    public function store(Request $request)
    {
        $request->validate([
            'menu_id' => 'required|exists:menu_tb,menu_id',
            'quantity' => 'required|integer|min:1'
        ]);

        $sale = Sale::create([
            'menu_id' => $request->menu_id,
            'quantity' => $request->quantity
        ]);

        $sale->load('menu');
        
        return response()->json([
            'sales_id' => $sale->sales_id,
            'menu_id' => $sale->menu_id,
            'menu_name' => $sale->menu->menu_name,
            'menu_price' => $sale->menu->menu_price,
            'quantity' => $sale->quantity,
            'total_price' => $sale->quantity * $sale->menu->menu_price,
            'created_at' => $sale->created_at,
            'updated_at' => $sale->updated_at
        ], 201);
    }

    public function show($id)
    {
        $sale = Sale::with('menu')->findOrFail($id);
        
        return response()->json([
            'sales_id' => $sale->sales_id,
            'menu_id' => $sale->menu_id,
            'menu_name' => $sale->menu->menu_name,
            'menu_price' => $sale->menu->menu_price,
            'quantity' => $sale->quantity,
            'total_price' => $sale->quantity * $sale->menu->menu_price,
            'created_at' => $sale->created_at,
            'updated_at' => $sale->updated_at
        ]);
    }    public function salesTrend()
    {
        $salesTrend = Sale::select(
            DB::raw('DATE(sales_tb.created_at) as date'),
            DB::raw('SUM(sales_tb.quantity * menu_tb.menu_price) as total_sales'),
            DB::raw('COUNT(*) as total_orders')
        )
        ->join('menu_tb', 'sales_tb.menu_id', '=', 'menu_tb.menu_id')
        ->groupBy(DB::raw('DATE(sales_tb.created_at)'))
        ->orderBy('date', 'asc')
        ->get();

        return response()->json($salesTrend);
    }

    public function destroy($id)
    {
        $sale = Sale::findOrFail($id);
        $sale->delete();

        return response()->json(['message' => 'Sale deleted successfully']);
    }
}
