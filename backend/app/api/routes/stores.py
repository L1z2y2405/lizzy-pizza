from fastapi import APIRouter, Response, status

from app.api.deps import CurrentCustomer, DbSession
from app.models import Store
from app.schemas import StoreCreate, StoreRead, StoreUpdate
from app.services import crud


router = APIRouter(prefix="/stores", tags=["stores"])


@router.get("", response_model=list[StoreRead])
def list_stores(db: DbSession):
    return crud.list_stores(db)


@router.post("", response_model=StoreRead, status_code=status.HTTP_201_CREATED)
def create_store(payload: StoreCreate, db: DbSession, _: CurrentCustomer):
    return crud.create_store(db, payload)


@router.get("/{store_id}", response_model=StoreRead)
def get_store(store_id: int, db: DbSession):
    return crud.get_or_404(db, Store, store_id)


@router.put("/{store_id}", response_model=StoreRead)
def update_store(store_id: int, payload: StoreUpdate, db: DbSession, _: CurrentCustomer):
    return crud.update_store(db, store_id, payload)


@router.delete("/{store_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_store(store_id: int, db: DbSession, _: CurrentCustomer):
    crud.delete_store(db, store_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
