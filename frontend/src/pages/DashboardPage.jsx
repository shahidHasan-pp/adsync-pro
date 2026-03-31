import { useEffect, useMemo, useState } from "react";
import AddVideoForm from "../components/AddVideoForm";
import MetricsPanel from "../components/MetricsPanel";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import VideoTable from "../components/VideoTable";
import { api } from "../lib/api";
import { clearSession, getUserEmail } from "../lib/auth";

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("video_intake");
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [metrics, setMetrics] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [syncUrl, setSyncUrl] = useState("");
  const [syncMessage, setSyncMessage] = useState("");

  const email = useMemo(() => getUserEmail() || "Unknown user", []);

  async function loadVideos() {
    const response = await api.get("/videos");
    setVideos(response.data);
    if (response.data.length && !selectedVideoId) {
      setSelectedVideoId(response.data[0].id);
    }
  }

  async function handleAddVideo(payload) {
    const response = await api.post("/videos", payload);
    setSyncUrl(response.data.creator_oauth_url);
    setSyncMessage("Creator link generated. Click it once to simulate approval.");
    setActiveSection("creator_sync");
    await loadVideos();
  }

  async function loadMetrics(videoId) {
    if (!videoId) {
      setMetrics(null);
      return;
    }
    setMetricsLoading(true);
    try {
      const response = await api.get(`/videos/${videoId}/metrics`);
      setMetrics(response.data);
    } catch {
      setMetrics(null);
    } finally {
      setMetricsLoading(false);
    }
  }

  async function simulateCreatorApproval() {
    if (!syncUrl) return;
    await fetch(syncUrl, { method: "GET" });
    setSyncMessage("Creator approved successfully. Refreshing data...");
    await loadVideos();
  }

  function handleLogout() {
    clearSession();
    window.location.href = "/";
  }

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    loadMetrics(selectedVideoId);
  }, [selectedVideoId]);

  return (
    <main className="min-h-screen bg-slate-100 p-4">
      <div className="mx-auto flex max-w-7xl gap-4">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <section className="flex-1">
          <TopBar email={email} onLogout={handleLogout} />
          <div className="space-y-4">
            {activeSection === "video_intake" ? <AddVideoForm onAdd={handleAddVideo} /> : null}
            {activeSection === "creator_sync" && syncUrl ? (
              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                <p className="text-sm text-orange-800">{syncMessage}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <code className="rounded bg-white px-2 py-1 text-xs text-slate-700">{syncUrl}</code>
                  <button
                    type="button"
                    onClick={simulateCreatorApproval}
                    className="rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-500"
                  >
                    Simulate Creator Approval
                  </button>
                </div>
              </div>
            ) : null}
            {activeSection === "creator_sync" && !syncUrl ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
                No creator sync link yet. Go to <strong>Video Intake</strong> and add a video first.
              </div>
            ) : null}
            {activeSection === "performance" ? (
              <>
                <VideoTable videos={videos} selectedVideoId={selectedVideoId} onSelect={setSelectedVideoId} />
                <MetricsPanel metrics={metrics} loading={metricsLoading} />
              </>
            ) : null}
            {activeSection === "compliance" ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-lg font-bold text-slate-900">Compliance Snapshot</h2>
                <p className="mt-2 text-sm text-slate-600">
                  This section is ready for policy checks, disclosure validation, and audit logs. You can add those
                  rules in the next phase.
                </p>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
