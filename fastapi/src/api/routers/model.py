import os

import redis
from fastapi import APIRouter

from src.api.responses.api_response import ApiResponse

router = APIRouter(
    prefix="/model",
    tags=["model"],
)

redis = redis.Redis(host='localhost', port=6379, db=0, password=os.getenv('REDIS_PASSWORD'))


@router.post("/text", response_model=None)
async def register():

    if redis.get("h") is not None:
        await redis.set("h", int(redis.get("h")) + 1)
    else:
        await redis.set("h", "0")

    return ApiResponse.payload({
        'hello': redis.get("h")
    })
