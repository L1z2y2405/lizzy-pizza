from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentCustomer, DbSession
from app.core.security import create_access_token
from app.schemas import CustomerCreate, CustomerRead, LoginRequest, Token
from app.services import crud


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=CustomerRead, status_code=status.HTTP_201_CREATED)
def signup(payload: CustomerCreate, db: DbSession):
    return crud.create_customer(db, payload)


@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: DbSession):
    customer = crud.authenticate_customer(db, payload.email, payload.password)
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    return Token(access_token=create_access_token(customer.id))


@router.get("/me", response_model=CustomerRead)
def me(current_customer: CurrentCustomer):
    return current_customer
