import { useEffect, useState } from "react";
import { api } from "../../api";
import StatusBadge from "../../components/StatusBadge";
import DocumentPreview from "../../components/DocumentPreview";

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/applications")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setApps(res.data);
        } else {
          setApps([]);
        }
      })
      .catch(() => setError("Failed to load applications"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-center mt-20 text-gray-500">Loading…</p>;

  if (error)
    return <p className="text-center mt-20 text-red-500">{error}</p>;

  if (!apps.length)
    return <p className="text-center mt-20">No applications</p>;

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6 bg-[#f5f5f7]">
      <h1 className="text-3xl font-semibold">Applications</h1>

      {apps.map((app) => (
        <div
          key={app._id}
          className="bg-white rounded-2xl shadow-sm border p-6"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              {app.firstName} {app.lastName}
            </h3>
            <StatusBadge status={app.status} />
          </div>

          <p className="text-sm text-gray-500 mt-1">{app.email}</p>

          {/* DOCUMENTS */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {Array.isArray(app.documents) &&
              app.documents.map((doc, i) => (
                <DocumentPreview key={i} url={doc.url} name={doc.name} />
              ))}
          </div>

          {/* STATUS UPDATE */}
          <select
            value={app.status}
            onChange={(e) =>
              api.patch(`/admin/applications/${app._id}/status`, {
                status: e.target.value,
              })
            }
            className="mt-4 px-3 py-2 border rounded-xl text-sm"
          >
            <option value="successfully">Successfully</option>
            <option value="unsuccessfully">Unsuccessfully</option>
            <option value="second intake">Second Intake</option>
          </select>
        </div>
      ))}
    </div>
  );
}
