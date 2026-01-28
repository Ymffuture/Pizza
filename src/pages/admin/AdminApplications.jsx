import { useEffect, useState } from "react";
import { api } from "../../api";
import StatusBadge from "../../components/StatusBadge";
import DocumentPreview from "../../components/DocumentPreview";

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/applications")
      .then((res) => setApplications(res.data))
      .catch(() => setError("Failed to load applicants"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-20">Loading…</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-6">Applications</h1>

      <div className="space-y-6">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-medium text-lg">
                {app.firstName} {app.lastName}
              </h2>
              <StatusBadge status={app.status} />
            </div>

            <p className="text-sm text-gray-600">
              {app.email} • {app.qualification}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {app.documents.map((doc, i) => (
                <DocumentPreview key={i} {...doc} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
