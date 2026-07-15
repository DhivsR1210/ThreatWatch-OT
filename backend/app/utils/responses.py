"""Shared JSON response helpers."""

from flask import jsonify


def success_response(data=None, message="OK", status=200):
    """Return a consistent successful JSON response."""
    payload = {"success": True, "message": message}
    if data is not None:
        payload["data"] = data
    return jsonify(payload), status


def error_response(message, status=400, errors=None):
    """Return a consistent error JSON response."""
    payload = {"success": False, "message": message}
    if errors:
        payload["errors"] = errors
    return jsonify(payload), status
