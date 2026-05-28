from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import get_db
from app.models import Customer


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
DbSession = Annotated[Session, Depends(get_db)]
Token = Annotated[str, Depends(oauth2_scheme)]


def get_current_customer(db: DbSession, token: Token) -> Customer:
    settings = get_settings()
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        subject = payload.get("sub")
        if subject is None:
            raise credentials_error
        customer_id = int(subject)
    except (JWTError, ValueError) as exc:
        raise credentials_error from exc

    customer = db.get(Customer, customer_id)
    if customer is None:
        raise credentials_error
    return customer


CurrentCustomer = Annotated[Customer, Depends(get_current_customer)]


def require_admin_customer(current_customer: CurrentCustomer) -> Customer:
    if not current_customer.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_customer


CurrentAdmin = Annotated[Customer, Depends(require_admin_customer)]
