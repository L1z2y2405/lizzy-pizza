from fastapi import APIRouter, Response, status

from app.api.deps import CurrentAdmin, CurrentCustomer, DbSession
from app.schemas import OrderCreate, OrderRead, OrderUpdate
from app.services import crud


router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("", response_model=list[OrderRead])
def list_orders(db: DbSession, current_customer: CurrentCustomer):
    return crud.list_orders(db, customer_id=current_customer.id)


@router.get("/all", response_model=list[OrderRead])
def list_all_orders(db: DbSession, _: CurrentAdmin):
    return crud.list_all_orders(db)


@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderCreate, db: DbSession, current_customer: CurrentCustomer):
    return crud.create_order(db, current_customer.id, payload)


@router.get("/{order_id}", response_model=OrderRead)
def get_order(order_id: int, db: DbSession, _: CurrentCustomer):
    return crud.get_order(db, order_id)


@router.put("/{order_id}", response_model=OrderRead)
def update_order(order_id: int, payload: OrderUpdate, db: DbSession, _: CurrentCustomer):
    return crud.update_order(db, order_id, payload)


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(order_id: int, db: DbSession, _: CurrentCustomer):
    crud.delete_order(db, order_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
