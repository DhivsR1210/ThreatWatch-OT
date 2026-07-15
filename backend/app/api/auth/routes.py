"""REST endpoints for registration, login, logout, and profiles."""

from datetime import datetime, timezone

from flask import Blueprint, request
from flask_jwt_extended import create_access_token, get_jwt, jwt_required

from app.api.auth.decorators import active_user_required
from app.core.extensions import db
from app.models.token_blocklist import TokenBlocklist
from app.models.user import User
from app.utils.responses import error_response, success_response
from app.utils.validation import validate_login, validate_profile_update, validate_registration

auth_bp = Blueprint("auth", __name__)


def request_json():
    """Return a JSON request body or a consistent validation error."""
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return None, error_response("Request body must be a JSON object.", 400)
    return payload, None


@auth_bp.post("/register")
def register():
    """Register a new viewer account."""
    payload, response = request_json()
    if response:
        return response

    values, errors = validate_registration(payload)
    if errors:
        return error_response("Validation failed.", 422, errors)
    if User.query.filter_by(email=values["email"]).first():
        return error_response("An account with this email already exists.", 409)

    user = User(
        first_name=values["first_name"],
        last_name=values["last_name"],
        email=values["email"],
    )
    user.set_password(values["password"])
    db.session.add(user)
    db.session.commit()

    return success_response({"user": user.to_dict()}, "Account created.", 201)


@auth_bp.post("/login")
def login():
    """Authenticate a user and issue a JWT access token."""
    payload, response = request_json()
    if response:
        return response

    values, errors = validate_login(payload)
    if errors:
        return error_response("Validation failed.", 422, errors)

    user = User.query.filter_by(email=values["email"]).first()
    if user is None or not user.check_password(values["password"]):
        return error_response("Invalid email or password.", 401)
    if not user.is_active:
        return error_response("This account is inactive.", 403)

    user.last_login = datetime.now(timezone.utc)
    db.session.commit()
    access_token = create_access_token(identity=user.uuid)
    return success_response(
        {"access_token": access_token, "token_type": "Bearer", "user": user.to_dict()},
        "Login successful.",
    )


@auth_bp.post("/logout")
@jwt_required()
def logout():
    """Revoke the current JWT access token."""
    token = get_jwt()
    expires_at = datetime.fromtimestamp(token["exp"], tz=timezone.utc)
    db.session.add(TokenBlocklist(jti=token["jti"], expires_at=expires_at))
    db.session.commit()
    return success_response(message="Logout successful.")


@auth_bp.get("/profile")
@active_user_required
def profile(user):
    """Return the authenticated user's profile."""
    return success_response({"user": user.to_dict()})


@auth_bp.put("/profile")
@active_user_required
def update_profile(user):
    """Update permitted fields of the authenticated user's profile."""
    payload, response = request_json()
    if response:
        return response

    updates, errors = validate_profile_update(payload)
    if errors:
        return error_response("Validation failed.", 422, errors)

    new_email = updates.get("email")
    if new_email and new_email != user.email:
        email_owner = User.query.filter_by(email=new_email).first()
        if email_owner:
            return error_response("An account with this email already exists.", 409)

    for field, value in updates.items():
        setattr(user, field, value)
    db.session.commit()
    return success_response({"user": user.to_dict()}, "Profile updated.")
