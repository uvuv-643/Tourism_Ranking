import os

import redis as redis_lib
from fastapi import APIRouter
import logging

from src.api.responses.api_response import ApiResponse

router = APIRouter(
    prefix="/model",
    tags=["model"],
)


@router.post("/text", response_model=None)
async def register():
    redis = redis_lib.Redis(host='uvuv643.ru', port=6379, db=0, password=os.getenv('REDIS_PASSWORD'))
    if redis.get("h") is not None:
        redis.set("h", int(redis.get("h")) + 1)
    else:
        redis.set("h", "0")
    return ApiResponse.payload({
        'hello': redis.get("h")
    })
