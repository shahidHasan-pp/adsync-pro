import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import VideoTable from "../components/VideoTable";
import { api } from "../lib/api";
import { clearSession, getUserEmail } from "../lib/auth";

export default function DashboardPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const email = getUserEmail() || "Unknown user";

  async function loadVideos() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/videos");
      setVideos(response.data);
    } catch {
      setError("Could not load saved videos.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    clearSession();
    window.location.href = "/";
  }

  function handleSelectVideo(video) {
    navigate(`/video-analytics?videoId=${encodeURIComponent(video.platform_video_id)}`);
  }

  useEffect(() => {
    loadVideos();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-4">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row">
        <AppSidebar email={email} onLogout={handleLogout} />

        <section className="flex-1 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-slate-900">My Saved Videos</h1>
                <p className="mt-1 text-sm text-slate-600">
                  Platform, Video ID, Title, and Created date. Click any row to open it in Video Analytics.
                </p>
              </div>
              <button
                type="button"
                onClick={loadVideos}
                disabled={loading}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
            {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          </div>

          <VideoTable videos={videos} selectedVideoId={null} onSelect={handleSelectVideo} />
        </section>
      </div>
    </main>
  );
}
