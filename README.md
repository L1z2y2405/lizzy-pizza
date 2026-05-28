# FireCrust Pizza Ordering App

Complete fullstack pizza ordering application built with FastAPI, SQLAlchemy, SQLite, JWT auth, React, Vite, TailwindCSS, and Axios.

## Features

- Customer signup and login with bcrypt password hashing and JWT bearer tokens.
- Full CRUD API for customers, pizzas, stores, orders, and order items through order creation.
- SQLite database with SQLAlchemy ORM relationships.
- Pydantic validation for all request and response models.
- Seed data for 5 pizzas and 3 stores on backend startup.
- Responsive React UI with menu, cart, checkout, orders, and admin management pages.
- Axios API integration, localStorage auth token, React Router, and toast notifications.

## Project Structure

```text
backend/
  app/
    api/
      routes/
    core/
    models/
    schemas/
    services/
    main.py
    seed.py
frontend/
  src/
    api/
    components/
    context/
    pages/
```

## Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`. Interactive docs are available at `http://localhost:8000/docs`.

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend runs at `http://localhost:5173`.

## API Overview

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET|POST /api/customers`
- `GET|PUT|DELETE /api/customers/{customer_id}`
- `GET|POST /api/pizzas`
- `GET|PUT|DELETE /api/pizzas/{pizza_id}`
- `GET|POST /api/stores`
- `GET|PUT|DELETE /api/stores/{store_id}`
- `GET|POST /api/orders`
- `GET /api/orders/all`
- `GET|PUT|DELETE /api/orders/{order_id}`

Protected write/admin endpoints require:

```text
Authorization: Bearer <access_token>
```

## Local Workflow

1. Start the backend first so the SQLite database and seed data are created.
2. Start the frontend.
3. Register a customer account.
4. Add pizzas to the cart, checkout, then view orders.
5. Use the Admin page to manage pizzas and stores.
