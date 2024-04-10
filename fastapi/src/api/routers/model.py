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
        city_id = request_content['city_id']
        logging.warning("got an image", image_base64)
    except:
        return ApiResponse.payload({
            'error': True,
            'message': 'Некорректный запрос'
        })

    redis_connection = redis.get_connection()
    redis_pubsub = redis_connection.pubsub()

    current_id = str(uuid.uuid4())
    await redis_connection.publish("photo_queries", json.dumps({
        "id": current_id,
        "content": image_base64,
        "city_id": city_id
    }, ensure_ascii=False))

    await redis_pubsub.subscribe(f"photo_response_{current_id}")
    start_time = time.time()
    while (time.time() - start_time) < 5:
        message = await redis_pubsub.get_message(ignore_subscribe_messages=True)
        if message is not None and message['data']:
            return ApiResponse.payload({
                'hello': message['data'].decode('utf-8')
            })
        await asyncio.sleep(0.1)

    return ApiResponse.payload({
        'error': True,
        'message': 'Ошибка удаленного сервера'
    })


@router.post("/text", response_model=None)
async def photo_information(request: Request):
    try:
        request_content = await request.json()
        text = request_content['text']
        city_id = request_content['city_id']
        logging.warning("got a text", text)
        if len(text) > 500:
            raise Exception()
        if city_id not in [1, 2, 3, 4, 0]:
            raise Exception()
    except:
        return ApiResponse.payload({
            'error': True,
            'message': 'Некорректный запрос'
        })

    redis_connection = redis.get_connection()
    redis_pubsub = redis_connection.pubsub()

    current_id = str(uuid.uuid4())
    await redis_connection.publish("text_queries", json.dumps({
        "id": current_id,
        "content": text,
        "city_id": city_id
    }, ensure_ascii=False))

    await redis_pubsub.subscribe(f"text_response_{current_id}")
    start_time = time.time()
    while (time.time() - start_time) < 5:
        message = await redis_pubsub.get_message(ignore_subscribe_messages=True)
        if message is not None and message['data']:
            return ApiResponse.payload({
                'hello': message['data'].decode('utf-8')
            })
        await asyncio.sleep(0.1)

    return ApiResponse.payload({
        'error': True,
        'message': 'Ошибка удаленного сервера'
    })
