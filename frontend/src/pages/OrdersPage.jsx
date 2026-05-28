import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, getApiError } from "../api/client";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders")
      .then(({ data }) => setOrders(data))
      .catch((error) => toast.error(getApiError(error)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-4xl font-black text-slate-950">My Orders</h1>
      <p className="mb-8 text-slate-600">Orders are fetched from the authenticated customer endpoint.</p>
      {loading ? (
        <div className="rounded-3xl bg-white p-8 text-center font-semibold">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl bg-white p-8 text-center font-semibold">No orders yet.</div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <article key={order.id} className="rounded-[2rem] bg-white p-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">Order #{order.id}</h2>
                  <p className="text-sm text-slate-600">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-black uppercase text-tomato">
                  {order.status.replaceAll("_", " ")}
                </span>
              </div>
              <p className="mt-4 font-semibold text-slate-700">Store: {order.store.name}</p>
              <div className="mt-4 space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between rounded-2xl bg-orange-50 p-3">
                    <span>{item.quantity} x {item.pizza.name}</span>
                    <strong>${item.price.toFixed(2)}</strong>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-right text-2xl font-black">${order.total_price.toFixed(2)}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
