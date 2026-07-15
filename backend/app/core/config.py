"""Environment-driven application configuration."""

import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")


class Config:
    """Default configuration suitable for local development."""

    SECRET_KEY = os.getenv(
        "SECRET_KEY", "development-only-secret-change-before-production-32"
    )
    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY", "development-only-jwt-secret-change-before-production"
    )
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", f"sqlite:///{BASE_DIR / 'threatwatch_ot.db'}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_ORIGINS = os.getenv(
        "CORS_ORIGINS", "http://localhost:5173,http://localhost:5174"
    ).split(",")
    FLASK_HOST = os.getenv("FLASK_HOST", "0.0.0.0")
    FLASK_PORT = int(os.getenv("FLASK_PORT", "5001"))
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        seconds=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", "3600"))
    )
    AUTO_CREATE_DATABASE = os.getenv("AUTO_CREATE_DATABASE", "true").lower() == "true"
