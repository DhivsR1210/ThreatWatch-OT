"""Persisted JWT revocations used by logout."""

from datetime import datetime, timezone

from app.core.extensions import db


class TokenBlocklist(db.Model):
    """A JWT that must no longer be accepted."""

    __tablename__ = "token_blocklist"

    jti = db.Column(db.String(36), primary_key=True)
    expires_at = db.Column(db.DateTime(timezone=True), nullable=False)
    created_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )
