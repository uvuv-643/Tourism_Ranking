from fastapi import FastAPI

from api.routers import model


def create_app_routers(app: FastAPI):
    app.include_router(model.router)
    return app
