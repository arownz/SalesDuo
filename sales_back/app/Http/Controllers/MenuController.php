<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index()
    {
        $menus = Menu::all();
        return response()->json($menus);
    }

    public function store(Request $request)
    {
        $request->validate([
            'menu_name' => 'required|string|max:255',
            'menu_price' => 'required|numeric|min:0'
        ]);

        $menu = Menu::create([
            'menu_name' => $request->menu_name,
            'menu_price' => $request->menu_price
        ]);

        return response()->json($menu, 201);
    }

    public function show($id)
    {
        $menu = Menu::findOrFail($id);
        return response()->json($menu);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'menu_name' => 'string|max:255',
            'menu_price' => 'numeric|min:0'
        ]);

        $menu = Menu::findOrFail($id);
        $menu->update($request->only(['menu_name', 'menu_price']));

        return response()->json($menu);
    }

    public function destroy($id)
    {
        $menu = Menu::findOrFail($id);
        $menu->delete();

        return response()->json(['message' => 'Menu deleted successfully']);
    }
}
