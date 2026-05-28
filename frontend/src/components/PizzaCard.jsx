import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

export default function PizzaCard({ pizza }) {
  const { addToCart } = useCart();

  function handleAdd() {
    addToCart(pizza);
    toast.success(`${pizza.name} added to cart`);
  }

  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-orange-950/10 ring-1 ring-orange-100">
      <img src={pizza.image_url} alt={pizza.name} className="h-56 w-full object-cover" />
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-950">{pizza.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{pizza.description}</p>
          </div>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-black text-tomato">
            ${pizza.price.toFixed(2)}
          </span>
        </div>
        <button
          disabled={!pizza.is_available}
          onClick={handleAdd}
          className="w-full rounded-2xl bg-tomato px-4 py-3 font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {pizza.is_available ? "Add to Cart" : "Unavailable"}
        </button>
      </div>
    </article>
  );
}
