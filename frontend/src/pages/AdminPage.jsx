import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, getApiError } from "../api/client";

const emptyPizza = { name: "", description: "", price: "", image_url: "", is_available: true };
const emptyStore = { name: "", address: "", phone: "" };

export default function AdminPage() {
  const [pizzas, setPizzas] = useState([]);
  const [stores, setStores] = useState([]);
  const [pizzaForm, setPizzaForm] = useState(emptyPizza);
  const [storeForm, setStoreForm] = useState(emptyStore);

  async function loadData() {
    const [pizzaResponse, storeResponse] = await Promise.all([
      api.get("/pizzas", { params: { include_unavailable: true } }),
      api.get("/stores"),
    ]);
    setPizzas(pizzaResponse.data);
    setStores(storeResponse.data);
  }

  useEffect(() => {
    loadData().catch((error) => toast.error(getApiError(error)));
  }, []);

  async function savePizza(event) {
    event.preventDefault();
    try {
      const payload = { ...pizzaForm, price: Number(pizzaForm.price) };
      if (pizzaForm.id) {
        await api.put(`/pizzas/${pizzaForm.id}`, payload);
      } else {
        await api.post("/pizzas", payload);
      }
      setPizzaForm(emptyPizza);
      await loadData();
      toast.success("Pizza saved");
    } catch (error) {
      toast.error(getApiError(error));
    }
  }

  async function saveStore(event) {
    event.preventDefault();
    try {
      if (storeForm.id) {
        await api.put(`/stores/${storeForm.id}`, storeForm);
      } else {
        await api.post("/stores", storeForm);
      }
      setStoreForm(emptyStore);
      await loadData();
      toast.success("Store saved");
    } catch (error) {
      toast.error(getApiError(error));
    }
  }

  async function remove(resource, id) {
    try {
      await api.delete(`/${resource}/${id}`);
      await loadData();
      toast.success("Deleted");
    } catch (error) {
      toast.error(getApiError(error));
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl font-black text-slate-950">Admin Management</h1>
      <p className="mb-8 text-slate-600">Manage pizzas and stores through protected CRUD endpoints.</p>

      <div className="grid gap-8 xl:grid-cols-2">
        <section className="glass rounded-[2rem] p-6 shadow-xl">
          <h2 className="text-2xl font-black">Pizza Menu</h2>
          <form onSubmit={savePizza} className="mt-5 grid gap-3">
            <input className="rounded-2xl border px-4 py-3" placeholder="Name" value={pizzaForm.name} onChange={(event) => setPizzaForm({ ...pizzaForm, name: event.target.value })} required />
            <textarea className="rounded-2xl border px-4 py-3" placeholder="Description" value={pizzaForm.description} onChange={(event) => setPizzaForm({ ...pizzaForm, description: event.target.value })} required />
            <input className="rounded-2xl border px-4 py-3" placeholder="Image URL" value={pizzaForm.image_url} onChange={(event) => setPizzaForm({ ...pizzaForm, image_url: event.target.value })} required />
            <input className="rounded-2xl border px-4 py-3" placeholder="Price" type="number" step="0.01" value={pizzaForm.price} onChange={(event) => setPizzaForm({ ...pizzaForm, price: event.target.value })} required />
            <label className="flex items-center gap-3 font-semibold">
              <input type="checkbox" checked={pizzaForm.is_available} onChange={(event) => setPizzaForm({ ...pizzaForm, is_available: event.target.checked })} />
              Available
            </label>
            <button className="rounded-2xl bg-tomato px-4 py-3 font-black text-white">
              {pizzaForm.id ? "Update pizza" : "Create pizza"}
            </button>
          </form>
          <div className="mt-6 space-y-3">
            {pizzas.map((pizza) => (
              <div key={pizza.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4">
                <span className="font-bold">{pizza.name}</span>
                <div className="flex gap-2">
                  <button className="rounded-full bg-orange-100 px-3 py-2 text-sm font-bold" onClick={() => setPizzaForm(pizza)}>Edit</button>
                  <button className="rounded-full bg-red-100 px-3 py-2 text-sm font-bold text-red-700" onClick={() => remove("pizzas", pizza.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass rounded-[2rem] p-6 shadow-xl">
          <h2 className="text-2xl font-black">Stores</h2>
          <form onSubmit={saveStore} className="mt-5 grid gap-3">
            <input className="rounded-2xl border px-4 py-3" placeholder="Name" value={storeForm.name} onChange={(event) => setStoreForm({ ...storeForm, name: event.target.value })} required />
            <input className="rounded-2xl border px-4 py-3" placeholder="Address" value={storeForm.address} onChange={(event) => setStoreForm({ ...storeForm, address: event.target.value })} required />
            <input className="rounded-2xl border px-4 py-3" placeholder="Phone" value={storeForm.phone} onChange={(event) => setStoreForm({ ...storeForm, phone: event.target.value })} required />
            <button className="rounded-2xl bg-slate-950 px-4 py-3 font-black text-white">
              {storeForm.id ? "Update store" : "Create store"}
            </button>
          </form>
          <div className="mt-6 space-y-3">
            {stores.map((store) => (
              <div key={store.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4">
                <span className="font-bold">{store.name}</span>
                <div className="flex gap-2">
                  <button className="rounded-full bg-orange-100 px-3 py-2 text-sm font-bold" onClick={() => setStoreForm(store)}>Edit</button>
                  <button className="rounded-full bg-red-100 px-3 py-2 text-sm font-bold text-red-700" onClick={() => remove("stores", store.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
