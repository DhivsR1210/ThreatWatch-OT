"""JWT-protected REST API for SOC alert management."""

from flask import Blueprint, request
from sqlalchemy import or_

from app.api.auth.decorators import active_user_required
from app.core.extensions import db
from app.models.alert import Alert
from app.utils.alert_validation import ALERT_STATUSES, SEVERITY_LEVELS, validate_alert
from app.utils.responses import error_response, success_response

alerts_bp = Blueprint("alerts", __name__)


def request_json():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return None, error_response("Request body must be a JSON object.", 400)
    return payload, None


def find_alert(alert_id):
    alert = db.session.get(Alert, alert_id)
    if alert is None:
        return None, error_response("Alert not found.", 404)
    return alert, None


@alerts_bp.get("")
@active_user_required
def list_alerts(_user):
    query = Alert.query
    search = request.args.get("search", "").strip()
    severity = request.args.get("severity")
    status = request.args.get("status")

    if severity and severity not in SEVERITY_LEVELS:
        return error_response("Invalid severity filter.", 422)
    if status and status not in ALERT_STATUSES:
        return error_response("Invalid status filter.", 422)
    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(
                Alert.title.ilike(pattern),
                Alert.description.ilike(pattern),
                Alert.source.ilike(pattern),
                Alert.asset.ilike(pattern),
                Alert.mitreTechnique.ilike(pattern),
            )
        )
    if severity:
        query = query.filter_by(severity=severity)
    if status:
        query = query.filter_by(status=status)

    alerts = query.order_by(Alert.timestamp.desc()).all()
    return success_response({"alerts": [alert.to_dict() for alert in alerts], "total": len(alerts)})


@alerts_bp.get("/<int:alert_id>")
@active_user_required
def get_alert(_user, alert_id):
    alert, response = find_alert(alert_id)
    if response:
        return response
    return success_response({"alert": alert.to_dict()})


@alerts_bp.post("")
@active_user_required
def create_alert(_user):
    payload, response = request_json()
    if response:
        return response
    values, errors = validate_alert(payload)
    if errors:
        return error_response("Validation failed.", 422, errors)

    alert = Alert(**values)
    db.session.add(alert)
    db.session.commit()
    return success_response({"alert": alert.to_dict()}, "Alert created.", 201)


@alerts_bp.put("/<int:alert_id>")
@active_user_required
def update_alert(_user, alert_id):
    alert, response = find_alert(alert_id)
    if response:
        return response
    payload, response = request_json()
    if response:
        return response
    values, errors = validate_alert(payload, partial=True)
    if errors:
        return error_response("Validation failed.", 422, errors)

    for field, value in values.items():
        setattr(alert, field, value)
    db.session.commit()
    return success_response({"alert": alert.to_dict()}, "Alert updated.")


@alerts_bp.delete("/<int:alert_id>")
@active_user_required
def delete_alert(_user, alert_id):
    alert, response = find_alert(alert_id)
    if response:
        return response
    db.session.delete(alert)
    db.session.commit()
    return success_response(message="Alert deleted.")
