import base64
import hashlib
from cryptography.fernet import Fernet, InvalidToken
from app.core.config import settings


def _build_fernet() -> Fernet:
    key_material = settings.TOKEN_ENCRYPTION_KEY or settings.SECRET_KEY
    digest = hashlib.sha256(key_material.encode("utf-8")).digest()
    fernet_key = base64.urlsafe_b64encode(digest)
    return Fernet(fernet_key)


def encrypt_token(value: str) -> str:
    return _build_fernet().encrypt(value.encode("utf-8")).decode("utf-8")


def decrypt_token(value: str) -> str:
    try:
        return _build_fernet().decrypt(value.encode("utf-8")).decode("utf-8")
    except InvalidToken:
        return value
