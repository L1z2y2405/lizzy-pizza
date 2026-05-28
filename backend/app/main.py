from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, customers, orders, pizzas, stores
from app.core.config import get_settings
from app.core.database import Base, SessionLocal, engine
from app.seed import seed_database


settings = get_settings()

app = FastAPI(title="Pizza Ordering API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.backend_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_database(db)


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}


app.include_router(auth.router, prefix="/api")
app.include_router(customers.router, prefix="/api")
app.include_router(pizzas.router, prefix="/api")
app.include_router(stores.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
