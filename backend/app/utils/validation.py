"""Input validation for authentication requests."""

import re

EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def _required_text(payload, field, label, errors, maximum=100):
    value = payload.get(field)
    if not isinstance(value, str) or not value.strip():
        errors[field] = f"{label} is required."
        return None

    value = value.strip()
    if len(value) > maximum:
        errors[field] = f"{label} must be {maximum} characters or fewer."
        return None
    return value


def _email(payload, errors, required=True):
    value = payload.get("email")
    if value is None and not required:
        return None
    if not isinstance(value, str) or not EMAIL_PATTERN.fullmatch(value.strip()):
        errors["email"] = "A valid email address is required."
        return None
    return value.strip().lower()


def validate_registration(payload):
    """Validate a registration request and return normalized fields."""
    errors = {}
    first_name = _required_text(payload, "first_name", "First name", errors)
    last_name = _required_text(payload, "last_name", "Last name", errors)
    email = _email(payload, errors)
    password = payload.get("password")

    if not isinstance(password, str) or len(password) < 8:
        errors["password"] = "Password must be at least 8 characters long."
    elif len(password.encode("utf-8")) > 72:
        errors["password"] = "Password must be 72 bytes or fewer."

    if errors:
        return None, errors
    return {
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "password": password,
    }, None


def validate_login(payload):
    """Validate and normalize login credentials."""
    errors = {}
    email = _email(payload, errors)
    password = payload.get("password")
    if not isinstance(password, str) or not password:
        errors["password"] = "Password is required."

    if errors:
        return None, errors
    return {"email": email, "password": password}, None


def validate_profile_update(payload):
    """Validate permitted profile updates."""
    errors = {}
    updates = {}

    for field, label in (("first_name", "First name"), ("last_name", "Last name")):
        if field in payload:
            value = _required_text(payload, field, label, errors)
            if value is not None:
                updates[field] = value

    if "email" in payload:
        value = _email(payload, errors, required=False)
        if value is not None:
            updates["email"] = value

    if not updates and not errors:
        errors["profile"] = "Provide at least one field to update."

    if errors:
        return None, errors
    return updates, None
