import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import AppSidebar from "../components/AppSidebar";
import { api } from "../lib/api";
import { clearSession, getUserEmail } from "../lib/auth";

export default function ComparePage() {
  const [videoId1, setVideoId1] = useState("");
  const [videoId2, setVideoId2] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const email = getUserEmail() || "Unknown user";

  function handleLogout() {
    clearSession();
    window.location.href = "/";
  }

  async function handleCompare(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.get("/videos/youtube/compare", {
        params: { video_id_1: videoId1, video_id_2: videoId2 },
      });
      setResult(response.data);
    } catch (err) {
      setResult(null);
      setError(err?.response?.data?.detail ?? "Comparison failed.");
    } finally {
      setLoading(false);
    }
  }

  const chartData = result
    ? [
        { metric: "Views", first: result.first.view_count, second: result.second.view_count },
        { metric: "Likes", first: result.first.like_count, second: result.second.like_count },
        { metric: "Comments", first: result.first.comment_count || 0, second: result.second.comment_count || 0 },
      ]
    : [];

  return (
    <main className="min-h-screen bg-slate-100 p-4">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row">
        <AppSidebar email={email} onLogout={handleLogout} />

        <section className="flex-1 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h1 className="text-xl font-bold text-slate-900">Compare Two YouTube Videos</h1>
          </div>

          <form onSubmit={handleCompare} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={videoId1}
                onChange={(event) => setVideoId1(event.target.value)}
                placeholder="First video ID"
                className="rounded-lg border border-slate-300 px-3 py-2"
                required
              />
              <input
                value={videoId2}
                onChange={(event) => setVideoId2(event.target.value)}
                placeholder="Second video ID"
                className="rounded-lg border border-slate-300 px-3 py-2"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-3 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60"
            >
              {loading ? "Comparing..." : "Compare"}
            </button>
            {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          </form>

          {result ? (
            <>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-slate-500">
                      <tr>
                        <th className="pb-2">Metric</th>
                        <th className="pb-2">Video 1 ({result.first.video_id})</th>
                        <th className="pb-2">Video 2 ({result.second.video_id})</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-slate-100"><td className="py-2">Title</td><td>{result.first.title}</td><td>{result.second.title}</td></tr>
                      <tr className="border-t border-slate-100"><td className="py-2">Published</td><td>{new Date(result.first.published_at).toLocaleString()}</td><td>{new Date(result.second.published_at).toLocaleString()}</td></tr>
                      <tr className="border-t border-slate-100"><td className="py-2">Views</td><td>{result.first.view_count.toLocaleString()}</td><td>{result.second.view_count.toLocaleString()}</td></tr>
                      <tr className="border-t border-slate-100"><td className="py-2">Likes</td><td>{result.first.like_count.toLocaleString()}</td><td>{result.second.like_count.toLocaleString()}</td></tr>
                      <tr className="border-t border-slate-100"><td className="py-2">Dislikes</td><td>{result.first.dislike_count ?? "N/A"}</td><td>{result.second.dislike_count ?? "N/A"}</td></tr>
                      <tr className="border-t border-slate-100"><td className="py-2">Comments</td><td>{(result.first.comment_count || 0).toLocaleString()}</td><td>{(result.second.comment_count || 0).toLocaleString()}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="mb-2 text-sm font-semibold text-slate-700">Graphical Comparison</p>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="4 4" />
                      <XAxis dataKey="metric" />
                      <YAxis />
                      <Tooltip formatter={(value) => Number(value).toLocaleString()} />
                      <Bar dataKey="first" fill="#f97316" name={result.first.video_id} />
                      <Bar dataKey="second" fill="#0f172a" name={result.second.video_id} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : null}
        </section>
      </div>
    </main>
  );
}
