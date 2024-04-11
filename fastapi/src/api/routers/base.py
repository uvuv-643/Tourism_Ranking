from fastapi import FastAPI

from src.api.routers import model
from src.api.routers import test


def create_app_routers(app: FastAPI):
    app.include_router(model.router)
    app.include_router(test.router)
    return app
