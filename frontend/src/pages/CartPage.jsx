import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { items, total, updateQuantity } = useCart();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-950">Your Cart</h1>
        <p className="text-slate-600">Review quantities before checkout.</p>
      </div>
      {items.length === 0 ? (
        <section className="rounded-[2rem] bg-white p-10 text-center shadow-xl">
          <h2 className="text-2xl font-black">Your cart is empty</h2>
          <Link to="/" className="mt-6 inline-block rounded-full bg-tomato px-6 py-3 font-black text-white">
            Browse pizzas
          </Link>
        </section>
      ) : (
        <section className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-4">
            {items.map((item) => (
              <article key={item.id} className="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-lg md:flex-row md:items-center">
                <img src={item.image_url} alt={item.name} className="h-28 w-full rounded-2xl object-cover md:w-36" />
                <div className="flex-1">
                  <h2 className="text-xl font-black">{item.name}</h2>
                  <p className="text-sm text-slate-600">${item.price.toFixed(2)} each</p>
                </div>
                <input
                  className="w-24 rounded-2xl border border-slate-200 px-4 py-3"
                  type="number"
                  min="0"
                  value={item.quantity}
                  onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                />
                <strong className="text-lg">${(item.price * item.quantity).toFixed(2)}</strong>
              </article>
            ))}
          </div>
          <aside className="h-fit rounded-[2rem] bg-slate-950 p-6 text-white">
            <p className="text-slate-300">Subtotal</p>
            <p className="mt-2 text-4xl font-black">${total.toFixed(2)}</p>
            <Link to="/checkout" className="mt-6 block rounded-2xl bg-tomato px-4 py-3 text-center font-black">
              Checkout
            </Link>
          </aside>
        </section>
      )}
    </main>
  );
}
