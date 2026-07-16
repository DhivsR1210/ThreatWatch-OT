"""JWT-protected REST API for OT asset inventory."""

from sqlalchemy import or_

from flask import Blueprint, request

from app.api.auth.decorators import active_user_required
from app.core.extensions import db
from app.models.asset import Asset
from app.utils.asset_validation import CRITICALITIES, OPERATIONAL_STATUSES, validate_asset
from app.utils.responses import error_response, success_response

assets_bp = Blueprint("assets", __name__)


def request_json():
    """Return a JSON object body or an API-consistent error response."""
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return None, error_response("Request body must be a JSON object.", 400)
    return payload, None


def find_asset(asset_id):
    """Return an asset or a consistent not-found response."""
    asset = db.session.get(Asset, asset_id)
    if asset is None:
        return None, error_response("Asset not found.", 404)
    return asset, None


@assets_bp.get("")
@active_user_required
def list_assets(_user):
    """List assets with optional inventory filters."""
    query = Asset.query
    search = request.args.get("search", "").strip()
    criticality = request.args.get("criticality")
    status = request.args.get("status")

    if criticality and criticality not in CRITICALITIES:
        return error_response("Invalid criticality filter.", 422)
    if status and status not in OPERATIONAL_STATUSES:
        return error_response("Invalid status filter.", 422)
    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(
                Asset.asset_name.ilike(pattern),
                Asset.asset_type.ilike(pattern),
                Asset.vendor.ilike(pattern),
                Asset.ip_address.ilike(pattern),
                Asset.plant_location.ilike(pattern),
            )
        )
    if criticality:
        query = query.filter_by(criticality=criticality)
    if status:
        query = query.filter_by(operational_status=status)

    assets = query.order_by(Asset.risk_score.desc(), Asset.asset_name.asc()).all()
    return success_response({"assets": [asset.to_dict() for asset in assets], "total": len(assets)})


@assets_bp.get("/<int:asset_id>")
@active_user_required
def get_asset(_user, asset_id):
    """Return one asset."""
    asset, response = find_asset(asset_id)
    if response:
        return response
    return success_response({"asset": asset.to_dict()})


@assets_bp.post("")
@active_user_required
def create_asset(_user):
    """Create an OT asset record."""
    payload, response = request_json()
    if response:
        return response
    values, errors = validate_asset(payload)
    if errors:
        return error_response("Validation failed.", 422, errors)

    for field in ("ip_address", "mac_address"):
        value = values.get(field)
        if value and Asset.query.filter(getattr(Asset, field) == value).first():
            return error_response(f"An asset with this {field.replace('_', ' ')} already exists.", 409)

    asset = Asset(**values)
    db.session.add(asset)
    db.session.commit()
    return success_response({"asset": asset.to_dict()}, "Asset created.", 201)


@assets_bp.put("/<int:asset_id>")
@active_user_required
def update_asset(_user, asset_id):
    """Update an OT asset record."""
    asset, response = find_asset(asset_id)
    if response:
        return response
    payload, response = request_json()
    if response:
        return response
    values, errors = validate_asset(payload, partial=True)
    if errors:
        return error_response("Validation failed.", 422, errors)

    for field in ("ip_address", "mac_address"):
        value = values.get(field)
        if value:
            duplicate = Asset.query.filter(getattr(Asset, field) == value, Asset.id != asset.id).first()
            if duplicate:
                return error_response(
                    f"An asset with this {field.replace('_', ' ')} already exists.", 409
                )

    for field, value in values.items():
        setattr(asset, field, value)
    db.session.commit()
    return success_response({"asset": asset.to_dict()}, "Asset updated.")


@assets_bp.delete("/<int:asset_id>")
@active_user_required
def delete_asset(_user, asset_id):
    """Delete an asset record."""
    asset, response = find_asset(asset_id)
    if response:
        return response
    db.session.delete(asset)
    db.session.commit()
    return success_response(message="Asset deleted.")
