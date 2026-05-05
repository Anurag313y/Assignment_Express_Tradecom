import os
from datetime import timedelta

from dotenv import load_dotenv

load_dotenv()


class Config:
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{os.getenv('DB_USER')}:"
        f"{os.getenv('DB_PASSWORD')}@"
        f"{os.getenv('DB_HOST')}/"
        f"{os.getenv('DB_NAME')}"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSON_SORT_KEYS = False

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback-secret-key")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)