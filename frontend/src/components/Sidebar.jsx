import { BarChart3, Film, Link2, ShieldCheck } from "lucide-react";

const items = [
  { icon: Film, label: "Video Intake" },
  { icon: Link2, label: "Creator Sync" },
  { icon: BarChart3, label: "Performance" },
  { icon: ShieldCheck, label: "Compliance" },
];

export default function Sidebar() {
  return (
    <aside className="w-full max-w-xs border-r border-slate-200 bg-white/80 p-5 backdrop-blur">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">AdSync Pro</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Control Room</h1>
      </div>
      <nav className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2 text-slate-700">
            <item.icon size={16} />
            <span className="text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}
