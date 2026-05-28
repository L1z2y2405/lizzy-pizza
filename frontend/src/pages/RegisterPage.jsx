import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { getApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const hasConfirmPassword = form.confirmPassword.length > 0;
  const passwordsMatch = hasConfirmPassword && form.password === form.confirmPassword;
  const passwordsDoNotMatch = hasConfirmPassword && form.password !== form.confirmPassword;
  const disableSubmit = saving || form.password !== form.confirmPassword;

  async function handleSubmit(event) {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSaving(true);
    const payload = { ...form };
    delete payload.confirmPassword;
    try {
      await register(payload);
      toast.success("Account created");
      navigate("/");
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <form onSubmit={handleSubmit} className="glass space-y-5 rounded-[2rem] p-8 shadow-xl">
        <div>
          <p className="font-black uppercase tracking-[0.3em] text-tomato">Join Lizzy Pizza</p>
          <h1 className="mt-3 text-4xl font-black text-slate-950">Create your pizza profile</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required />
          <div className="relative">
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-12"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-tomato"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                {showPassword ? (
                  <>
                    <path d="M3 3l18 18" strokeLinecap="round" />
                    <path d="M10.6 10.6A2 2 0 0 0 12 14a2 2 0 0 0 1.4-.6" />
                    <path d="M9.9 4.3A9.7 9.7 0 0 1 12 4c5 0 8.5 4 10 8a16.5 16.5 0 0 1-3 4.7" />
                    <path d="M6.1 6.1A16.2 16.2 0 0 0 2 12c1.5 4 5 8 10 8 1.5 0 2.8-.3 4-.9" />
                  </>
                ) : (
                  <>
                    <path d="M2 12s3.5-8 10-8 10 8 10 8-3.5 8-10 8S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
        <div>
          <div className="relative">
            <input
              className={`w-full rounded-2xl border px-4 py-3 pr-12 ${
                passwordsDoNotMatch ? "border-red-500" : "border-slate-200"
              }`}
              placeholder="Confirm Password"
              type={showPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
              required
              minLength={8}
            />
            {passwordsMatch && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600" aria-label="Passwords match">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                  <path d="M5 12.5 10 17l9-10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </div>
          {passwordsDoNotMatch && <p className="mt-2 text-sm font-semibold text-red-600">Passwords do not match</p>}
        </div>
        <textarea className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Delivery address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} required />
        <button disabled={disableSubmit} className="w-full rounded-2xl bg-tomato px-4 py-3 font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300">
          {saving ? "Creating..." : "Register"}
        </button>
        <p className="text-center text-sm text-slate-600">
          Already have an account? <Link className="font-bold text-tomato" to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}
