"""Authorization middleware for protected endpoints."""

from functools import wraps

from flask_jwt_extended import get_jwt_identity, jwt_required

from app.models.user import User
from app.utils.responses import error_response


def active_user_required(view):
    """Require a valid token belonging to an active user."""

    @wraps(view)
    @jwt_required()
    def wrapped(*args, **kwargs):
        user = User.query.filter_by(uuid=get_jwt_identity()).first()
        if user is None or not user.is_active:
            return error_response("This account is unavailable.", 403)
        return view(user, *args, **kwargs)

    return wrapped
