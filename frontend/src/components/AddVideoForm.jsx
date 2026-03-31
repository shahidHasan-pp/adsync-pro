import { useState } from "react";

const defaultForm = { platform: "youtube", platform_video_id: "" };

export default function AddVideoForm({ onAdd }) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onAdd(form);
      setForm(defaultForm);
    } catch (err) {
      setError(err?.response?.data?.detail ?? "Failed to create video");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-bold text-slate-900">Add Sponsored Video</h2>
      <p className="mt-1 text-sm text-slate-600">Create a pending sync request and share the creator link.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="text-sm text-slate-700">
          Platform
          <select
            value={form.platform}
            onChange={(e) => setForm((prev) => ({ ...prev, platform: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
          >
            <option value="youtube">YouTube</option>
            <option value="facebook">Facebook</option>
            <option value="tiktok">TikTok</option>
          </select>
        </label>
        <label className="text-sm text-slate-700">
          Platform Video ID
          <input
            value={form.platform_video_id}
            onChange={(e) => setForm((prev) => ({ ...prev, platform_video_id: e.target.value }))}
            placeholder="dQw4w9WgXcQ"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            required
          />
        </label>
      </div>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="mt-4 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Generate Creator Sync Link"}
      </button>
    </form>
  );
}
