import { NavLink } from "react-router-dom";

export default function AppSidebar({ email, onLogout }) {
  const linkClass = ({ isActive }) =>
    `block rounded-lg px-3 py-2 text-sm font-semibold ${
      isActive ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-800 hover:bg-slate-200"
    }`;

  return (
    <aside className="w-full rounded-2xl border border-slate-200 bg-white p-4 md:max-w-[220px] md:self-start">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">AdSync Pro</p>
      <p className="mt-1 text-sm font-semibold text-slate-900 break-all">{email}</p>

      <nav className="mt-4 space-y-2">
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/video-analytics" className={linkClass}>
          Video Analytics
        </NavLink>
        <NavLink to="/compare" className={linkClass}>
          Compare Videos
        </NavLink>
      </nav>

      <button
        type="button"
        onClick={onLogout}
        className="mt-4 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        Logout
      </button>
    </aside>
  );
}
