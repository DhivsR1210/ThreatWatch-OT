"""Operational technology asset inventory model."""

from datetime import datetime, timezone

from app.core.extensions import db


class Asset(db.Model):
    """A discoverable or managed OT asset."""

    __tablename__ = "assets"

    id = db.Column(db.Integer, primary_key=True)
    asset_name = db.Column(db.String(150), nullable=False, index=True)
    asset_type = db.Column(db.String(100), nullable=False, index=True)
    vendor = db.Column(db.String(100), nullable=True)
    model = db.Column(db.String(100), nullable=True)
    firmware_version = db.Column(db.String(100), nullable=True)
    ip_address = db.Column(db.String(45), nullable=True, unique=True, index=True)
    mac_address = db.Column(db.String(17), nullable=True, unique=True, index=True)
    plant_location = db.Column(db.String(150), nullable=True, index=True)
    criticality = db.Column(db.String(20), nullable=False, default="Medium", index=True)
    operational_status = db.Column(db.String(20), nullable=False, default="Online", index=True)
    risk_score = db.Column(db.Integer, nullable=False, default=0, index=True)
    last_seen = db.Column(db.DateTime(timezone=True), nullable=True)
    created_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def to_dict(self) -> dict:
        """Return a JSON-safe asset representation."""
        return {
            "id": self.id,
            "asset_name": self.asset_name,
            "asset_type": self.asset_type,
            "vendor": self.vendor,
            "model": self.model,
            "firmware_version": self.firmware_version,
            "ip_address": self.ip_address,
            "mac_address": self.mac_address,
            "plant_location": self.plant_location,
            "criticality": self.criticality,
            "operational_status": self.operational_status,
            "risk_score": self.risk_score,
            "last_seen": self.last_seen.isoformat() if self.last_seen else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
