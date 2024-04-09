from fastapi import APIRouter, Depends, Request

from src.api.responses.api_response import ApiResponse

router = APIRouter(
    prefix="/model",
    tags=["model"],
)


@router.post("/text", response_model=None)
async def register():
    return ApiResponse.payload({
        'hello': 'world'
    })
