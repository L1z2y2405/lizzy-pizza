from fastapi import APIRouter, Query, Response, status

from app.api.deps import CurrentCustomer, DbSession
from app.models import PizzaMenu
from app.schemas import PizzaCreate, PizzaRead, PizzaUpdate
from app.services import crud


router = APIRouter(prefix="/pizzas", tags=["pizzas"])


@router.get("", response_model=list[PizzaRead])
def list_pizzas(
    db: DbSession,
    search: str | None = Query(default=None, max_length=120),
    include_unavailable: bool = False,
):
    return crud.list_pizzas(db, search, include_unavailable)


@router.post("", response_model=PizzaRead, status_code=status.HTTP_201_CREATED)
def create_pizza(payload: PizzaCreate, db: DbSession, _: CurrentCustomer):
    return crud.create_pizza(db, payload)


@router.get("/{pizza_id}", response_model=PizzaRead)
def get_pizza(pizza_id: int, db: DbSession):
    return crud.get_or_404(db, PizzaMenu, pizza_id)


@router.put("/{pizza_id}", response_model=PizzaRead)
def update_pizza(pizza_id: int, payload: PizzaUpdate, db: DbSession, _: CurrentCustomer):
    return crud.update_pizza(db, pizza_id, payload)


@router.delete("/{pizza_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pizza(pizza_id: int, db: DbSession, _: CurrentCustomer):
    crud.delete_pizza(db, pizza_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
