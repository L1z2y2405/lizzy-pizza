import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { getApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back");
      navigate("/");
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-4 py-12 md:grid-cols-2">
      <section className="rounded-[2rem] bg-slate-950 p-8 text-white">
        <p className="font-black uppercase tracking-[0.3em] text-orange-300">Lizzy Pizza account</p>
        <h1 className="mt-6 text-5xl font-black">Sign in for checkout and orders.</h1>
        <p className="mt-6 text-slate-300">Sign in to order your favorite pizzas faster and keep track of every hot delivery.</p>
      </section>
      <form onSubmit={handleSubmit} className="glass space-y-5 rounded-[2rem] p-8 shadow-xl">
        <h2 className="text-3xl font-black text-slate-950">Login</h2>
        <input
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />
        <input
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          required
        />
        <button disabled={saving} className="w-full rounded-2xl bg-tomato px-4 py-3 font-black text-white">
          {saving ? "Signing in..." : "Login"}
        </button>
        <p className="text-center text-sm text-slate-600">
          New here? <Link className="font-bold text-tomato" to="/register">Create an account</Link>
        </p>
      </form>
    </main>
  );
}
