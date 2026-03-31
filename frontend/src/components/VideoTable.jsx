const statusClass = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
};

export default function VideoTable({ videos, selectedVideoId, onSelect }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-bold text-slate-900">Videos</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="pb-2">Platform</th>
              <th className="pb-2">Video ID</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Title</th>
              <th className="pb-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr
                key={video.id}
                onClick={() => onSelect(video.id)}
                className={`cursor-pointer border-t border-slate-100 ${
                  selectedVideoId === video.id ? "bg-orange-50" : ""
                }`}
              >
                <td className="py-3 capitalize">{video.platform}</td>
                <td className="py-3 font-mono text-xs">{video.platform_video_id}</td>
                <td className="py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass[video.status]}`}>
                    {video.status}
                  </span>
                </td>
                <td className="py-3">{video.title || "Pending sync title"}</td>
                <td className="py-3">{new Date(video.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!videos.length ? <p className="mt-4 text-sm text-slate-500">No videos yet. Add one above.</p> : null}
    </div>
  );
}
