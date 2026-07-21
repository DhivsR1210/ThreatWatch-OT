"""Validation helpers for SOC alert requests."""

import re
from datetime import datetime, timezone

SEVERITY_LEVELS = ("Low", "Medium", "High", "Critical")
ALERT_STATUSES = ("New", "Investigating", "Contained", "Closed")
MITRE_TECHNIQUE_PATTERN = re.compile(r"^T\d{4}(?:\.\d{3})?$", re.IGNORECASE)


def _required_text(payload, field, label, errors, maximum):
    value = payload.get(field)
    if not isinstance(value, str) or not value.strip():
        errors[field] = f"{label} is required."
        return None
    value = value.strip()
    if len(value) > maximum:
        errors[field] = f"{label} must be {maximum} characters or fewer."
        return None
    return value


def _parse_timestamp(payload, errors):
    value = payload.get("timestamp")
    if not isinstance(value, str) or not value.strip():
        errors["timestamp"] = "Timestamp is required."
        return None
    try:
        timestamp = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        errors["timestamp"] = "Timestamp must be an ISO 8601 datetime."
        return None
    return timestamp if timestamp.tzinfo else timestamp.replace(tzinfo=timezone.utc)


def validate_alert(payload, partial=False):
    """Validate an alert payload and return normalized model values."""
    errors = {}
    values = {}
    allowed_fields = {
        "title", "description", "severity", "status", "source", "asset", "timestamp", "mitreTechnique"
    }
    unknown_fields = set(payload) - allowed_fields
    if unknown_fields:
        errors["fields"] = f"Unsupported field(s): {', '.join(sorted(unknown_fields))}."

    text_fields = (
        ("title", "Title", 180),
        ("description", "Description", 4000),
        ("source", "Source", 120),
        ("asset", "Asset", 180),
    )
    for field, label, maximum in text_fields:
        if field in payload:
            value = _required_text(payload, field, label, errors, maximum)
            if value is not None:
                values[field] = value

    if "severity" in payload:
        severity = payload["severity"]
        if severity not in SEVERITY_LEVELS:
            errors["severity"] = f"Severity must be one of: {', '.join(SEVERITY_LEVELS)}."
        else:
            values["severity"] = severity

    if "status" in payload:
        status = payload["status"]
        if status not in ALERT_STATUSES:
            errors["status"] = f"Status must be one of: {', '.join(ALERT_STATUSES)}."
        else:
            values["status"] = status

    if "timestamp" in payload:
        timestamp = _parse_timestamp(payload, errors)
        if timestamp is not None:
            values["timestamp"] = timestamp

    if "mitreTechnique" in payload:
        technique = payload["mitreTechnique"]
        if technique in (None, ""):
            values["mitreTechnique"] = None
        elif not isinstance(technique, str) or not MITRE_TECHNIQUE_PATTERN.fullmatch(technique.strip()):
            errors["mitreTechnique"] = "MITRE technique must use the format T1234 or T1234.001."
        else:
            values["mitreTechnique"] = technique.strip().upper()

    required_fields = {"title", "description", "severity", "status", "source", "asset", "timestamp"}
    if not partial:
        for field in required_fields - set(payload):
            errors[field] = f"{field.capitalize()} is required."
    elif not values and not errors:
        errors["alert"] = "Provide at least one field to update."

    if errors:
        return None, errors
    return values, None
