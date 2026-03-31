import {
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

const colors = ["#ea580c", "#fb923c", "#f97316", "#fdba74"];

export default function MetricsPanel({ metrics, loading }) {
  if (loading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">Loading metrics...</div>;
  }

  if (!metrics) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
        Select an approved video to view metrics.
      </div>
    );
  }

  const demographicData = Object.entries(metrics.demographics ?? {}).map(([name, value]) => ({ name, value }));
  const retentionData = (metrics.retention_curve ?? []).map((point) => ({
    time: point.time,
    value: point.value,
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-bold text-slate-900">Latest Performance Snapshot</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <MetricCard label="Total Views" value={metrics.total_views.toLocaleString()} />
        <MetricCard label="Unique Viewers" value={metrics.unique_viewers.toLocaleString()} />
        <MetricCard label="Engagement Rate" value={`${metrics.engagement_rate}%`} />
        <MetricCard label="Avg Watch Time" value={`${metrics.avg_watch_time_seconds}s`} />
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="h-72 rounded-xl border border-slate-100 p-3">
          <p className="mb-2 text-sm font-semibold text-slate-700">Demographics</p>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={demographicData} dataKey="value" nameKey="name" outerRadius={90} label>
                {demographicData.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="h-72 rounded-xl border border-slate-100 p-3">
          <p className="mb-2 text-sm font-semibold text-slate-700">Retention Curve</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="4 4" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#ea580c" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}
