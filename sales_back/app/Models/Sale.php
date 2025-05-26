<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $table = 'sales_tb';
    protected $primaryKey = 'sales_id';
    
    protected $fillable = [
        'menu_id',
        'quantity'
    ];
    
    public function menu()
    {
        return $this->belongsTo(Menu::class, 'menu_id', 'menu_id');
    }
    
    public function getTotalPriceAttribute()
    {
        return $this->quantity * $this->menu->menu_price;
    }
}
