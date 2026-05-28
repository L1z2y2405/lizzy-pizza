from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.entities import OrderStatus


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class CustomerBase(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: str = Field(min_length=7, max_length=30)
    address: str = Field(min_length=5)


class CustomerCreate(CustomerBase):
    password: str = Field(min_length=8, max_length=72)


class CustomerUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=120)
    email: EmailStr | None = None
    phone: str | None = Field(default=None, min_length=7, max_length=30)
    address: str | None = Field(default=None, min_length=5)
    password: str | None = Field(default=None, min_length=8, max_length=72)


class CustomerRead(CustomerBase):
    id: int
    is_admin: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class PizzaBase(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    description: str = Field(min_length=5)
    price: float = Field(gt=0)
    image_url: str = Field(min_length=5, max_length=500)
    is_available: bool = True


class PizzaCreate(PizzaBase):
    pass

class PizzaUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=120)
    description: str | None = Field(default=None, min_length=5)
    price: float | None = Field(default=None, gt=0)
    image_url: str | None = Field(default=None, min_length=5, max_length=500)
    is_available: bool | None = None


class PizzaRead(PizzaBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class StoreBase(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    address: str = Field(min_length=5)
    phone: str = Field(min_length=7, max_length=30)


class StoreCreate(StoreBase):
    pass


class StoreUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=120)
    address: str | None = Field(default=None, min_length=5)
    phone: str | None = Field(default=None, min_length=7, max_length=30)


class StoreRead(StoreBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class OrderItemCreate(BaseModel):
    pizza_id: int
    quantity: int = Field(gt=0, le=20)


class OrderItemRead(BaseModel):
    id: int
    pizza_id: int
    quantity: int
    price: float
    pizza: PizzaRead

    model_config = ConfigDict(from_attributes=True)


class OrderCreate(BaseModel):
    store_id: int
    items: list[OrderItemCreate] = Field(min_length=1)


class OrderUpdate(BaseModel):
    status: OrderStatus | None = None
    store_id: int | None = None


class OrderRead(BaseModel):
    id: int
    customer_id: int
    store_id: int
    total_price: float
    status: OrderStatus
    created_at: datetime
    store: StoreRead
    items: list[OrderItemRead]

    model_config = ConfigDict(from_attributes=True)
