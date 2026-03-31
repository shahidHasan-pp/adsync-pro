import { LogOut } from "lucide-react";

export default function TopBar({ email, onLogout }) {
  return (
    <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Advertiser Workspace</p>
        <p className="text-sm font-semibold text-slate-900">{email}</p>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
      >
        <LogOut size={15} />
        Logout
      </button>
    </div>
  );
}
