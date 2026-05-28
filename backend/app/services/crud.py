from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.security import hash_password, verify_password
from app.models import Customer, Order, OrderItem, PizzaMenu, Store
from app.schemas import (
    CustomerCreate,
    CustomerUpdate,
    OrderCreate,
    OrderUpdate,
    PizzaCreate,
    PizzaUpdate,
    StoreCreate,
    StoreUpdate,
)


def get_or_404(db: Session, model: type, item_id: int):
    item = db.get(model, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
    return item


def get_customer_by_email(db: Session, email: str) -> Customer | None:
    return db.scalar(select(Customer).where(Customer.email == email))


def create_customer(db: Session, payload: CustomerCreate) -> Customer:
    admin_emails = [
        "owner@pizza.com",
    ]

    if get_customer_by_email(db, payload.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )

    customer = Customer(
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        address=payload.address,
        password_hash=hash_password(payload.password),
        is_admin=payload.email in admin_emails,
    )

    db.add(customer)
    db.commit()
    db.refresh(customer)

    return customer

def authenticate_customer(db: Session, email: str, password: str) -> Customer | None:
    customer = get_customer_by_email(db, email)
    if not customer or not verify_password(password, customer.password_hash):
        return None
    return customer


def list_customers(db: Session) -> list[Customer]:
    return list(db.scalars(select(Customer).order_by(Customer.created_at.desc())))


def update_customer(db: Session, customer_id: int, payload: CustomerUpdate) -> Customer:
    customer = get_or_404(db, Customer, customer_id)
    data = payload.model_dump(exclude_unset=True)
    if "email" in data and data["email"] != customer.email and get_customer_by_email(db, data["email"]):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered")
    if "password" in data:
        data["password_hash"] = hash_password(data.pop("password"))
    for field, value in data.items():
        setattr(customer, field, value)
    db.commit()
    db.refresh(customer)
    return customer


def delete_customer(db: Session, customer_id: int) -> None:
    customer = get_or_404(db, Customer, customer_id)
    db.delete(customer)
    db.commit()


def list_pizzas(
    db: Session,
    search: str | None = None,
    include_unavailable: bool = False,
) -> list[PizzaMenu]:
    query = select(PizzaMenu)
    search_term = search.strip() if search else ""

    if not include_unavailable:
        query = query.where(PizzaMenu.is_available.is_(True))

    if search_term:
        query = query.where(PizzaMenu.name.ilike(f"%{search_term}%"))

    return list(db.scalars(query.order_by(PizzaMenu.name)))


def create_pizza(db: Session, payload: PizzaCreate) -> PizzaMenu:
    pizza = PizzaMenu(**payload.model_dump())
    db.add(pizza)
    db.commit()
    db.refresh(pizza)
    return pizza


def update_pizza(db: Session, pizza_id: int, payload: PizzaUpdate) -> PizzaMenu:
    pizza = get_or_404(db, PizzaMenu, pizza_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(pizza, field, value)
    db.commit()
    db.refresh(pizza)
    return pizza


def delete_pizza(db: Session, pizza_id: int) -> None:
    pizza = get_or_404(db, PizzaMenu, pizza_id)
    db.delete(pizza)
    db.commit()


def list_stores(db: Session) -> list[Store]:
    return list(db.scalars(select(Store).order_by(Store.name)))


def create_store(db: Session, payload: StoreCreate) -> Store:
    store = Store(**payload.model_dump())
    db.add(store)
    db.commit()
    db.refresh(store)
    return store


def update_store(db: Session, store_id: int, payload: StoreUpdate) -> Store:
    store = get_or_404(db, Store, store_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(store, field, value)
    db.commit()
    db.refresh(store)
    return store


def delete_store(db: Session, store_id: int) -> None:
    store = get_or_404(db, Store, store_id)
    db.delete(store)
    db.commit()


def order_query():
    return select(Order).options(
        selectinload(Order.store),
        selectinload(Order.items).selectinload(OrderItem.pizza),
    )


def list_orders(db: Session, customer_id: int | None = None) -> list[Order]:
    query = order_query().order_by(Order.created_at.desc())
    if customer_id is not None:
        query = query.where(Order.customer_id == customer_id)
    return list(db.scalars(query))


def list_all_orders(db: Session) -> list[Order]:
    return list(db.scalars(order_query().order_by(Order.created_at.desc())))


def get_order(db: Session, order_id: int) -> Order:
    order = db.scalar(order_query().where(Order.id == order_id))
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order


def create_order(db: Session, customer_id: int, payload: OrderCreate) -> Order:
    get_or_404(db, Store, payload.store_id)
    order = Order(customer_id=customer_id, store_id=payload.store_id, total_price=0)
    total_price = 0.0

    for item in payload.items:
        pizza = get_or_404(db, PizzaMenu, item.pizza_id)
        if not pizza.is_available:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"{pizza.name} is currently unavailable",
            )
        line_price = round(pizza.price * item.quantity, 2)
        total_price += line_price
        order.items.append(OrderItem(pizza_id=pizza.id, quantity=item.quantity, price=line_price))

    order.total_price = round(total_price, 2)
    db.add(order)
    db.commit()
    return get_order(db, order.id)


def update_order(db: Session, order_id: int, payload: OrderUpdate) -> Order:
    order = get_order(db, order_id)
    data = payload.model_dump(exclude_unset=True)
    if "store_id" in data:
        get_or_404(db, Store, data["store_id"])
    for field, value in data.items():
        setattr(order, field, value)
    db.commit()
    return get_order(db, order.id)


def delete_order(db: Session, order_id: int) -> None:
    order = get_order(db, order_id)
    db.delete(order)
    db.commit()
