"""JWT-protected REST API for vulnerability management."""

from sqlalchemy import or_

from flask import Blueprint, request

from app.api.auth.decorators import active_user_required
from app.core.extensions import db
from app.models.vulnerability import Vulnerability
from app.utils.responses import error_response, success_response
from app.utils.vulnerability_validation import SEVERITY_LEVELS, validate_vulnerability

vulnerabilities_bp = Blueprint("vulnerabilities", __name__)


def request_json():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return None, error_response("Request body must be a JSON object.", 400)
    return payload, None


def find_vulnerability(vulnerability_id):
    vulnerability = db.session.get(Vulnerability, vulnerability_id)
    if vulnerability is None:
        return None, error_response("Vulnerability not found.", 404)
    return vulnerability, None


@vulnerabilities_bp.get("")
@active_user_required
def list_vulnerabilities(_user):
    query = Vulnerability.query
    search = request.args.get("search", "").strip()
    severity = request.args.get("severity")
    exploit_available = request.args.get("exploit_available")

    if severity and severity not in SEVERITY_LEVELS:
        return error_response("Invalid severity filter.", 422)
    if exploit_available is not None:
        if exploit_available.lower() not in ("true", "false"):
            return error_response("Exploit availability filter must be true or false.", 422)
        query = query.filter_by(exploit_available=exploit_available.lower() == "true")

    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(
                Vulnerability.cve_id.ilike(pattern),
                Vulnerability.vendor.ilike(pattern),
                Vulnerability.product.ilike(pattern),
                Vulnerability.version.ilike(pattern),
                Vulnerability.mitre_technique.ilike(pattern),
            )
        )
    if severity:
        query = query.filter_by(severity=severity)

    records = query.order_by(Vulnerability.published_date.desc()).all()
    return success_response({"vulnerabilities": [record.to_dict() for record in records], "total": len(records)})


@vulnerabilities_bp.get("/<int:vulnerability_id>")
@active_user_required
def get_vulnerability(_user, vulnerability_id):
    vulnerability, response = find_vulnerability(vulnerability_id)
    if response:
        return response
    return success_response({"vulnerability": vulnerability.to_dict()})


@vulnerabilities_bp.post("")
@active_user_required
def create_vulnerability(_user):
    payload, response = request_json()
    if response:
        return response
    values, errors = validate_vulnerability(payload)
    if errors:
        return error_response("Validation failed.", 422, errors)

    if Vulnerability.query.filter_by(cve_id=values["cve_id"]).first():
        return error_response("A vulnerability with this CVE ID already exists.", 409)

    vulnerability = Vulnerability(**values)
    db.session.add(vulnerability)
    db.session.commit()
    return success_response({"vulnerability": vulnerability.to_dict()}, "Vulnerability created.", 201)


@vulnerabilities_bp.put("/<int:vulnerability_id>")
@active_user_required
def update_vulnerability(_user, vulnerability_id):
    vulnerability, response = find_vulnerability(vulnerability_id)
    if response:
        return response
    payload, response = request_json()
    if response:
        return response
    values, errors = validate_vulnerability(payload, partial=True)
    if errors:
        return error_response("Validation failed.", 422, errors)

    if "cve_id" in values and values["cve_id"] != vulnerability.cve_id:
        if Vulnerability.query.filter_by(cve_id=values["cve_id"]).first():
            return error_response("A vulnerability with this CVE ID already exists.", 409)

    for field, value in values.items():
        setattr(vulnerability, field, value)
    db.session.commit()
    return success_response({"vulnerability": vulnerability.to_dict()}, "Vulnerability updated.")


@vulnerabilities_bp.delete("/<int:vulnerability_id>")
@active_user_required
def delete_vulnerability(_user, vulnerability_id):
    vulnerability, response = find_vulnerability(vulnerability_id)
    if response:
        return response
    db.session.delete(vulnerability)
    db.session.commit()
    return success_response(message="Vulnerability deleted.")
