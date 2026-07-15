"""Application factory for the ThreatWatch OT API."""

from flask import Flask
from flask_cors import CORS

from app.api.auth.routes import auth_bp
from app.api.health import health_bp
from app.core.config import Config
from app.core.extensions import init_extensions


def create_app(config_object=Config) -> Flask:
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config.from_object(config_object)
    CORS(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})
    init_extensions(app)
    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    return app
