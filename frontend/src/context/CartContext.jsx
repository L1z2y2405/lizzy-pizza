import { createContext, useCallback, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem("pizza_cart") || "[]"));

  const persist = useCallback((nextItems) => {
    setItems(nextItems);
    localStorage.setItem("pizza_cart", JSON.stringify(nextItems));
  }, []);

  const addToCart = useCallback((pizza) => {
    const existing = items.find((item) => item.id === pizza.id);
    const nextItems = existing
      ? items.map((item) => (item.id === pizza.id ? { ...item, quantity: item.quantity + 1 } : item))
      : [...items, { ...pizza, quantity: 1 }];
    persist(nextItems);
  }, [items, persist]);

  const updateQuantity = useCallback((pizzaId, quantity) => {
    const nextItems = items
      .map((item) => (item.id === pizzaId ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0);
    persist(nextItems);
  }, [items, persist]);

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo(
    () => ({ items, count, total, addToCart, updateQuantity, clearCart }),
    [items, count, total, addToCart, updateQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}
