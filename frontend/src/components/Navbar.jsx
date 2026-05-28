import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const linkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive ? "bg-tomato text-white" : "text-slate-700 hover:bg-orange-100"
  }`;

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { count } = useCart();
  const isAdmin = user?.is_admin === true;

  return (
    <header className="sticky top-0 z-20 border-b border-orange-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="flex items-center gap-3 text-xl font-black text-slate-950">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-tomato text-white shadow-glow">
            LP
          </span>
          Lizzy Pizza
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <NavLink to="/" className={linkClass}>
            Menu
          </NavLink>
          <NavLink to="/cart" className={linkClass}>
            Cart ({count})
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/orders" className={linkClass}>
                Orders
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className={linkClass}>
                  Admin
                </NavLink>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-slate-600 sm:inline">Hi, {user?.name}</span>
              <button
                onClick={logout}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="text-sm font-semibold text-slate-700" to="/login">
                Login
              </Link>
              <Link className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
