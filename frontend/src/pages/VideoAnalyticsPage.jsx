import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import YouTubeInsightsPanel from "../components/YouTubeInsightsPanel";
import { api } from "../lib/api";
import { clearSession, getUserEmail } from "../lib/auth";

export default function VideoAnalyticsPage() {
  const [searchParams] = useSearchParams();
  const initialVideoId = searchParams.get("videoId") || "";

  const [videoId, setVideoId] = useState(initialVideoId);
  const [youtubeDetails, setYoutubeDetails] = useState(null);
  const [youtubeLoading, setYoutubeLoading] = useState(false);
  const [error, setError] = useState("");

  const email = getUserEmail() || "Unknown user";

  async function fetchYouTubeByVideoId(targetVideoId) {
    setError("");
    setYoutubeLoading(true);
    try {
      const response = await api.get("/videos/youtube/public", { params: { video_id: targetVideoId } });
      setYoutubeDetails(response.data);
      setVideoId(targetVideoId);
    } catch (err) {
      setYoutubeDetails(null);
      setError(err?.response?.data?.detail ?? "Failed to fetch YouTube data.");
    } finally {
      setYoutubeLoading(false);
    }
  }

  async function handleLookup(event) {
    event.preventDefault();
    await fetchYouTubeByVideoId(videoId);
  }

  function handleLogout() {
    clearSession();
    window.location.href = "/";
  }

  useEffect(() => {
    if (initialVideoId) {
      fetchYouTubeByVideoId(initialVideoId);
    }
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-4">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row">
        <AppSidebar email={email} onLogout={handleLogout} />

        <section className="flex-1 space-y-4">
          <form onSubmit={handleLookup} className="rounded-2xl border border-slate-200 bg-white p-5">
            <h1 className="text-xl font-bold text-slate-900">YouTube Video Analytics</h1>
            <p className="mt-1 text-sm text-slate-600">
              Submit one video ID and view statistics + graphical metrics directly from YouTube API.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <input
                value={videoId}
                onChange={(event) => setVideoId(event.target.value)}
                placeholder="Enter YouTube Video ID (e.g. clkIoVkO-Lk)"
                className="min-w-[280px] flex-1 rounded-lg border border-slate-300 px-3 py-2"
                required
              />
              <button
                type="submit"
                disabled={youtubeLoading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60"
              >
                {youtubeLoading ? "Loading..." : "Get Metrics"}
              </button>
            </div>
            {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          </form>

          <YouTubeInsightsPanel data={youtubeDetails} loading={youtubeLoading} />
        </section>
      </div>
    </main>
  );
}
