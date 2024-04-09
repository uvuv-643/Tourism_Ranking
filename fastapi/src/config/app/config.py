from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class AppConfig(BaseSettings):
    APP_NAME: str
    APP_PATH: str
    APP_URL: str
    APP_VERSION: str
    DEBUG: bool

    UVICORN_APP_NAME: str
    UVICORN_HOST: str
    UVICORN_PORT: int
    UVICORN_RELOAD: bool

    class Config:
        env_file = ".env"


settings_app = AppConfig()
