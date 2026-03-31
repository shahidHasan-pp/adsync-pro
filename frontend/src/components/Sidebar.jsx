import { BarChart3, Film, Link2, ShieldCheck } from "lucide-react";

const items = [
  { icon: Film, label: "Video Intake", key: "video_intake" },
  { icon: Link2, label: "Creator Sync", key: "creator_sync" },
  { icon: BarChart3, label: "Performance", key: "performance" },
  { icon: ShieldCheck, label: "Compliance", key: "compliance" },
];

export default function Sidebar({ activeSection, onSectionChange }) {
  return (
    <aside className="w-full max-w-xs border-r border-slate-200 bg-white/80 p-5 backdrop-blur">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">AdSync Pro</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Control Room</h1>
      </div>
      <nav className="space-y-3">
        {items.map((item) => (
          <button
            type="button"
            key={item.label}
            onClick={() => onSectionChange(item.key)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left ${
              activeSection === item.key
                ? "bg-orange-100 text-orange-900"
                : "bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <item.icon size={16} />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
