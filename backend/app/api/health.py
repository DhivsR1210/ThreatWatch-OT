"""Health-check routes."""

from flask import Blueprint, jsonify

health_bp = Blueprint("health", __name__)


@health_bp.get("/health")
def health_check():
    """Return the API availability status."""
    return jsonify({"status": "ok", "service": "ThreatWatch OT API"})
