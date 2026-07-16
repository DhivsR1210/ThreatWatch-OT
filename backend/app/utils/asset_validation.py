"""Validation and normalization helpers for OT asset requests."""

from datetime import datetime
import ipaddress
import re

CRITICALITIES = {"Low", "Medium", "High", "Critical"}
OPERATIONAL_STATUSES = {"Online", "Offline", "Maintenance"}
MAC_ADDRESS_PATTERN = re.compile(r"^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$")

REQUIRED_TEXT_FIELDS = {
    "asset_name": ("Asset name", 150),
    "asset_type": ("Asset type", 100),
}
OPTIONAL_TEXT_FIELDS = {
    "vendor": 100,
    "model": 100,
    "firmware_version": 100,
    "plant_location": 150,
}


def _text(value, label, maximum, errors, field, required=False):
    if value is None:
        if required:
            errors[field] = f"{label} is required."
        return None
    if not isinstance(value, str):
        errors[field] = f"{label} must be text."
        return None
    value = value.strip()
    if required and not value:
        errors[field] = f"{label} is required."
    elif len(value) > maximum:
        errors[field] = f"{label} must be {maximum} characters or fewer."
    return value or None


def _iso_datetime(value, errors):
    if value is None:
        return None
    if not isinstance(value, str):
        errors["last_seen"] = "Last seen must be an ISO 8601 date-time."
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        errors["last_seen"] = "Last seen must be an ISO 8601 date-time."
        return None


def validate_asset(payload, partial=False):
    """Validate create or update payloads and return normalized fields."""
    errors = {}
    values = {}

    for field, (label, maximum) in REQUIRED_TEXT_FIELDS.items():
        if field in payload or not partial:
            value = _text(payload.get(field), label, maximum, errors, field, required=True)
            if value is not None:
                values[field] = value

    for field, maximum in OPTIONAL_TEXT_FIELDS.items():
        if field in payload:
            value = _text(payload.get(field), field.replace("_", " ").title(), maximum, errors, field)
            values[field] = value

    if "ip_address" in payload:
        value = _text(payload["ip_address"], "IP address", 45, errors, "ip_address")
        if value:
            try:
                ipaddress.ip_address(value)
            except ValueError:
                errors["ip_address"] = "IP address must be a valid IPv4 or IPv6 address."
        values["ip_address"] = value

    if "mac_address" in payload:
        value = _text(payload["mac_address"], "MAC address", 17, errors, "mac_address")
        if value and not MAC_ADDRESS_PATTERN.fullmatch(value):
            errors["mac_address"] = "MAC address must use the format AA:BB:CC:DD:EE:FF."
        values["mac_address"] = value.upper() if value else None

    if "criticality" in payload or not partial:
        value = payload.get("criticality", "Medium")
        if value not in CRITICALITIES:
            errors["criticality"] = "Criticality must be Low, Medium, High, or Critical."
        else:
            values["criticality"] = value

    if "operational_status" in payload or not partial:
        value = payload.get("operational_status", "Online")
        if value not in OPERATIONAL_STATUSES:
            errors["operational_status"] = "Operational status must be Online, Offline, or Maintenance."
        else:
            values["operational_status"] = value

    if "risk_score" in payload or not partial:
        value = payload.get("risk_score", 0)
        if isinstance(value, bool) or not isinstance(value, int) or not 0 <= value <= 100:
            errors["risk_score"] = "Risk score must be an integer from 0 to 100."
        else:
            values["risk_score"] = value

    if "last_seen" in payload:
        values["last_seen"] = _iso_datetime(payload["last_seen"], errors)

    if partial and not values and not errors:
        errors["asset"] = "Provide at least one field to update."
    return (None, errors) if errors else (values, None)
