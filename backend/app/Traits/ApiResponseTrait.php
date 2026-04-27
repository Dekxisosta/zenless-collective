<?php

namespace App\Traits;

trait ApiResponseTrait
{
     protected function handleException(\Exception $e)
    {
        return response()->json(['message' => $e->getMessage()], 500);
    }
}
