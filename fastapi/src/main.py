from fastapi import Request
import uvicorn
from fastapi import FastAPI

from api.responses.api_response import ApiResponse
from api.routers.base import create_app_routers
from config.app.config import settings_app
from utils.validator.exceptions import AppValidationException


def get_application() -> FastAPI:
    application = FastAPI(
        title=settings_app.APP_NAME,
        debug=settings_app.DEBUG,
        version=settings_app.APP_VERSION
    )
    application = create_app_routers(application)

    return application


app = get_application()


@app.on_event("startup")
async def startup_event():
    print("hello world")


@app.on_event("shutdown")
async def shutdown_event():
    print("bye world")


@app.exception_handler(AppValidationException)
async def validation_failed(request: Request, exc: AppValidationException):
    return ApiResponse.errors(exc.errors, status_code=422)


if __name__ == "__main__":
    uvicorn.run(
        app=settings_app.UVICORN_APP_NAME,
        host=settings_app.UVICORN_HOST,
        port=settings_app.UVICORN_PORT,
        reload=settings_app.UVICORN_RELOAD
    )
