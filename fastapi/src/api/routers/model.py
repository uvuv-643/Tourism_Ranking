import asyncio
import json
import logging
import random
import time

import uuid
from fastapi import APIRouter, Request

from src.api.responses.api_response import ApiResponse
from src.utils.redis import redis

router = APIRouter(
    prefix="/model",
    tags=["model"],
)


@router.post("/photo", response_model=None)
async def photo_information(request: Request):
    try:
        request_content = await request.json()
        image_base64 = request_content['image'].split(',', 1)[1]
        logging.warning("got an image", image_base64)
    except:
        return ApiResponse.payload({
            'error': True,
            'message': 'Некорректное base64 изображение'
        })

    redis_connection = redis.get_connection()
    redis_pubsub = redis_connection.pubsub()

    current_id = str(uuid.uuid4())
    await redis_connection.publish("photo_queries", json.dumps({
        "id": current_id,
        "content": image_base64
    }, ensure_ascii=False))

    logging.warning("added redis_connection", current_id)
    await redis_pubsub.subscribe(f"photo_response_{current_id}")
    start_time = time.time()
    while (time.time() - start_time) < 5:
        message = await redis_pubsub.get_message()
        if message is not None:
            return ApiResponse.payload({
                'hello': message
            })
        await asyncio.sleep(0.1)

    return ApiResponse.payload({
        'detail': "Ошибка удаленного сервера"
    })
