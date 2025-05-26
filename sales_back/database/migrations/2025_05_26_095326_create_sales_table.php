<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sales_tb', function (Blueprint $table) {
            $table->id('sales_id');
            $table->unsignedBigInteger('menu_id');
            $table->integer('quantity');
            $table->timestamps();
            
            $table->foreign('menu_id')->references('menu_id')->on('menu_tb');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_tb');
    }
};
