import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { api, getApiError } from "../api/client";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [stores, setStores] = useState([]);
  const [storeId, setStoreId] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/stores")
      .then(({ data }) => {
        setStores(data);
        setStoreId(data[0]?.id || "");
      })
      .catch((error) => toast.error(getApiError(error)));
  }, []);

  async function handleCheckout(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await api.post("/orders", {
        store_id: Number(storeId),
        items: items.map((item) => ({ pizza_id: item.id, quantity: item.quantity })),
      });
      clearCart();
      toast.success("Order placed");
      navigate("/orders");
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setSaving(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <section className="rounded-[2rem] bg-white p-10 text-center shadow-xl">
          <h1 className="text-3xl font-black">No pizzas to checkout</h1>
          <Link to="/" className="mt-6 inline-block rounded-full bg-tomato px-6 py-3 font-black text-white">
            Go to menu
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <form onSubmit={handleCheckout} className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <section className="glass space-y-5 rounded-[2rem] p-8 shadow-xl">
          <h1 className="text-4xl font-black text-slate-950">Checkout</h1>
          <label className="block">
            <span className="mb-2 block font-bold text-slate-700">Pickup or delivery store</span>
            <select
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              value={storeId}
              onChange={(event) => setStoreId(event.target.value)}
              required
            >
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name} - {store.address}
                </option>
              ))}
            </select>
          </label>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between rounded-2xl bg-white p-4">
                <span>{item.quantity} x {item.name}</span>
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
              </div>
            ))}
          </div>
        </section>
        <aside className="h-fit rounded-[2rem] bg-slate-950 p-6 text-white">
          <p className="text-slate-300">Order total</p>
          <p className="mt-2 text-4xl font-black">${total.toFixed(2)}</p>
          <button disabled={saving} className="mt-6 w-full rounded-2xl bg-tomato px-4 py-3 font-black">
            {saving ? "Placing..." : "Place Order"}
          </button>
        </aside>
      </form>
    </main>
  );
}
