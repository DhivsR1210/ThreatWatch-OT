"""SOC alert model and OT-focused starter records."""

from datetime import datetime, timedelta, timezone

from app.core.extensions import db


class Alert(db.Model):
    """A security alert observed in the operational technology environment."""

    __tablename__ = "alerts"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(180), nullable=False, index=True)
    description = db.Column(db.Text, nullable=False)
    severity = db.Column(db.String(20), nullable=False, index=True)
    status = db.Column(db.String(20), nullable=False, default="New", index=True)
    source = db.Column(db.String(120), nullable=False, index=True)
    asset = db.Column(db.String(180), nullable=False, index=True)
    timestamp = db.Column(db.DateTime(timezone=True), nullable=False, index=True)
    mitreTechnique = db.Column(db.String(100), nullable=True)
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
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "severity": self.severity,
            "status": self.status,
            "source": self.source,
            "asset": self.asset,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "mitreTechnique": self.mitreTechnique,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


_NOW = datetime.now(timezone.utc)

SAMPLE_ALERTS = [
    {
        "title": "Unauthorized PLC logic download attempt",
        "description": "An engineering workstation attempted to download a modified logic block to the production PLC outside the approved maintenance window. The connection was blocked by the industrial firewall.",
        "severity": "Critical",
        "status": "New",
        "source": "Industrial Firewall",
        "asset": "Siemens PLC S7-1500",
        "timestamp": _NOW - timedelta(minutes=18),
        "mitreTechnique": "T0843",
    },
    {
        "title": "Repeated invalid HMI authentication",
        "description": "The operator station generated 27 failed authentication attempts against the ABB HMI in nine minutes from an unrecognized engineering subnet.",
        "severity": "High",
        "status": "Investigating",
        "source": "HMI Audit Log",
        "asset": "ABB HMI Panel",
        "timestamp": _NOW - timedelta(hours=1, minutes=12),
        "mitreTechnique": "T1110",
    },
    {
        "title": "Abnormal Modbus write command rate",
        "description": "Modbus write commands exceeded the established baseline for the remote pump station. Containment rules have isolated the originating host pending review.",
        "severity": "High",
        "status": "Contained",
        "source": "Network Detection Sensor",
        "asset": "Schneider RTU",
        "timestamp": _NOW - timedelta(hours=2, minutes=34),
        "mitreTechnique": "T0855",
    },
    {
        "title": "SCADA historian data export anomaly",
        "description": "An unusually large historian export was requested outside the normal reporting schedule. The export completed before policy review was triggered.",
        "severity": "Medium",
        "status": "Investigating",
        "source": "Historian Monitor",
        "asset": "AVEVA Historian",
        "timestamp": _NOW - timedelta(hours=5, minutes=8),
        "mitreTechnique": "T1005",
    },
    {
        "title": "Controller firmware integrity mismatch",
        "description": "The scheduled integrity check detected a firmware checksum mismatch on the DeltaV controller. A verified maintenance record later confirmed the approved update.",
        "severity": "Medium",
        "status": "Closed",
        "source": "Endpoint Integrity Monitor",
        "asset": "Emerson DCS Controller",
        "timestamp": _NOW - timedelta(hours=9, minutes=42),
        "mitreTechnique": "T0839",
    },
    {
        "title": "New industrial VLAN endpoint observed",
        "description": "A new endpoint was observed on the packaging line VLAN. Asset discovery identified it as a maintenance laptop and the event was closed after inventory reconciliation.",
        "severity": "Low",
        "status": "Closed",
        "source": "Asset Discovery",
        "asset": "Rockwell CompactLogix",
        "timestamp": _NOW - timedelta(days=1, hours=2),
        "mitreTechnique": "T0842",
    },
]
