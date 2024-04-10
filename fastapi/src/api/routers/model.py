import os

from fastapi import APIRouter
import logging

from src.api.responses.api_response import ApiResponse
from src.utils.redis import redis

router = APIRouter(
    prefix="/model",
    tags=["model"],
)


@router.post("/text", response_model=None)
async def register():
    redis_connection = redis.get_connection()
    if redis_connection.get("h") is not None:
        redis_connection.set("h", str(int(redis_connection.get("h")) + 1))
    else:
        redis_connection.set("h", "0")
    return ApiResponse.payload({
        'hello': str(redis_connection.get("h"))
    })
