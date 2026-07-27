"""Application factory for the ThreatWatch OT API."""

from flask import Flask
from flask_cors import CORS

from app.api.alerts.routes import alerts_bp
from app.api.assets.routes import assets_bp
from app.api.auth.routes import auth_bp
from app.api.health import health_bp
from app.api.network.routes import network_bp
from app.api.mitre.routes import mitre_bp
from app.api.vulnerabilities.routes import vulnerabilities_bp
from app.core.config import Config
from app.core.extensions import db, init_extensions


def create_app(config_object=Config) -> Flask:
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config.from_object(config_object)
    CORS(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})
    init_extensions(app)
    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(network_bp, url_prefix="/api/network")
    app.register_blueprint(mitre_bp, url_prefix="/api/mitre")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(assets_bp, url_prefix="/api/assets")
    app.register_blueprint(alerts_bp, url_prefix="/api/alerts")
    app.register_blueprint(vulnerabilities_bp, url_prefix="/api/vulnerabilities")

    from app.models.vulnerability import Vulnerability, SAMPLE_VULNERABILITIES
    from app.models.alert import Alert, SAMPLE_ALERTS
    with app.app_context():
        if not Vulnerability.query.first():
            for sample in SAMPLE_VULNERABILITIES:
                db.session.add(Vulnerability(**sample))
            db.session.commit()
        if not Alert.query.first():
            for sample in SAMPLE_ALERTS:
                db.session.add(Alert(**sample))
            db.session.commit()

    return app
