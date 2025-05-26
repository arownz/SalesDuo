<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $table = 'menu_tb';
    protected $primaryKey = 'menu_id';
    
    protected $fillable = [
        'menu_name',
        'menu_price'
    ];
    
    public function sales()
    {
        return $this->hasMany(Sale::class, 'menu_id', 'menu_id');
    }
}
