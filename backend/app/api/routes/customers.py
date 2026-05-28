from fastapi import APIRouter, Response, status

from app.api.deps import CurrentCustomer, DbSession
from app.models import Customer
from app.schemas import CustomerCreate, CustomerRead, CustomerUpdate
from app.services import crud


router = APIRouter(prefix="/customers", tags=["customers"])


@router.get("", response_model=list[CustomerRead])
def list_customers(db: DbSession, _: CurrentCustomer):
    return crud.list_customers(db)


@router.post("", response_model=CustomerRead, status_code=status.HTTP_201_CREATED)
def create_customer(payload: CustomerCreate, db: DbSession):
    return crud.create_customer(db, payload)


@router.get("/{customer_id}", response_model=CustomerRead)
def get_customer(customer_id: int, db: DbSession, _: CurrentCustomer):
    return crud.get_or_404(db, Customer, customer_id)


@router.put("/{customer_id}", response_model=CustomerRead)
def update_customer(customer_id: int, payload: CustomerUpdate, db: DbSession, _: CurrentCustomer):
    return crud.update_customer(db, customer_id, payload)


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(customer_id: int, db: DbSession, _: CurrentCustomer):
    crud.delete_customer(db, customer_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
