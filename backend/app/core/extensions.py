"""Flask extension instances shared across the application."""

from apscheduler.schedulers.background import BackgroundScheduler
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy

from app.utils.responses import error_response

db = SQLAlchemy()
jwt = JWTManager()
scheduler = BackgroundScheduler(daemon=True)


def init_extensions(app):
    """Bind extensions to an application instance.

    Scheduler jobs will be registered and started in a later implementation phase.
    """
    db.init_app(app)
    jwt.init_app(app)

    # Ensure all models are imported before auto-creating tables.
    from app.models.alert import Alert
    from app.models.token_blocklist import TokenBlocklist
    from app.models.vulnerability import Vulnerability

    @jwt.token_in_blocklist_loader
    def is_token_revoked(_jwt_header, jwt_payload):
        return db.session.get(TokenBlocklist, jwt_payload["jti"]) is not None

    @jwt.unauthorized_loader
    def missing_token(reason):
        return error_response("Authentication is required.", 401, {"token": reason})

    @jwt.invalid_token_loader
    def invalid_token(reason):
        return error_response("The access token is invalid.", 401, {"token": reason})

    @jwt.expired_token_loader
    def expired_token(_jwt_header, _jwt_payload):
        return error_response("The access token has expired.", 401)

    @jwt.revoked_token_loader
    def revoked_token(_jwt_header, _jwt_payload):
        return error_response("The access token has been revoked.", 401)

    if app.config["AUTO_CREATE_DATABASE"]:
        with app.app_context():
            db.create_all()
