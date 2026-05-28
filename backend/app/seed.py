from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import PizzaMenu, Store


PIZZAS = [
    {
        "name": "Margherita Classica",
        "description": "San Marzano tomato, fresh mozzarella, basil, and extra virgin olive oil.",
        "price": 12.99,
        "image_url": "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=900&q=80",
    },
    {
        "name": "Pepperoni Inferno",
        "description": "Crispy pepperoni, mozzarella, chili flakes, and house tomato sauce.",
        "price": 15.49,
        "image_url": "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=80",
    },
    {
        "name": "Garden Verde",
        "description": "Roasted peppers, mushrooms, olives, red onion, spinach, and pesto drizzle.",
        "price": 14.25,
        "image_url": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80",
    },
    {
        "name": "BBQ Chicken",
        "description": "Grilled chicken, smoked mozzarella, red onion, cilantro, and BBQ sauce.",
        "price": 16.75,
        "image_url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80",
    },
    {
        "name": "Truffle Mushroom",
        "description": "Wild mushrooms, fontina, mozzarella, garlic cream, and truffle oil.",
        "price": 18.5,
        "image_url": "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=900&q=80",
    },
]

STORES = [
    {"name": "Downtown Slice House", "address": "101 Main Street", "phone": "555-0101"},
    {"name": "Northside Pizza Bar", "address": "48 Maple Avenue", "phone": "555-0198"},
    {"name": "Riverside Oven", "address": "7 Riverwalk Plaza", "phone": "555-0177"},
]


def seed_database(db: Session) -> None:
    if not db.scalar(select(PizzaMenu).limit(1)):
        db.add_all(PizzaMenu(**pizza) for pizza in PIZZAS)

    if not db.scalar(select(Store).limit(1)):
        db.add_all(Store(**store) for store in STORES)

    db.commit()
