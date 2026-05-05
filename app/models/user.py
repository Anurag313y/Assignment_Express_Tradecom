from app import db
from datetime import datetime, timezone

import bcrypt as _bcrypt

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(80), nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    avatar_url = db.Column(db.Text, nullable=True)

    def set_password(self, password):
        if password is None:
            raise ValueError("Password is required")
        pw = password.encode("utf-8")
        self.password_hash = _bcrypt.hashpw(pw, _bcrypt.gensalt()).decode("utf-8")

    def check_password(self, password):
        if not password or not self.password_hash:
            return False
        try:
            return _bcrypt.checkpw(
                password.encode("utf-8"),
                self.password_hash.encode("utf-8"),
            )
        except ValueError:
            # covers invalid hash formats
            return False

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.isoformat() + "Z" if self.created_at else None,
            "avatar_url": self.avatar_url,
        }