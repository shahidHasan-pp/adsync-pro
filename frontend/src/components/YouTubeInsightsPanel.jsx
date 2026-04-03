import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function YouTubeInsightsPanel({ data, loading }) {
  if (loading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">Loading YouTube details...</div>;
  }

  if (!data) {
    return null;
  }

  const chartData = [
    { metric: "Views", value: data.view_count },
    { metric: "Likes", value: data.like_count },
    { metric: "Dislikes", value: data.dislike_count ?? 0 },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-red-700">YouTube Public Snapshot</p>
      <div className="mt-3 grid gap-4 md:grid-cols-[220px_1fr]">
        <img
          src={data.thumbnail_url || "https://via.placeholder.com/220x124?text=No+Thumbnail"}
          alt={data.title}
          className="h-32 w-full rounded-xl object-cover"
        />
        <div>
          <h3 className="text-lg font-bold text-slate-900">{data.title}</h3>
          <p className="mt-1 text-sm text-slate-600">Published: {new Date(data.published_at).toLocaleString()}</p>
          <a
            href={data.channel_url}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block text-sm font-medium text-blue-700 underline"
          >
            Channel: {data.channel_id}
          </a>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <Stat label="Views" value={data.view_count.toLocaleString()} />
            <Stat label="Likes" value={data.like_count.toLocaleString()} />
            <Stat label="Dislikes" value={data.dislike_count === null ? "N/A" : data.dislike_count.toLocaleString()} />
          </div>
        </div>
      </div>

      <div className="mt-5 h-64 rounded-xl border border-slate-100 p-3">
        <p className="mb-2 text-sm font-semibold text-slate-700">Statistical Comparison</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis dataKey="metric" />
            <YAxis />
            <Tooltip formatter={(value) => Number(value).toLocaleString()} />
            <Bar dataKey="value" fill="#dc2626" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-2">
      <p className="text-xs uppercase tracking-[0.08em] text-slate-500">{label}</p>
      <p className="text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}
