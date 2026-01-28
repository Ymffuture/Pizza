import { useEffect, useState } from "react";
import { api } from "../../api";
import StatusBadge from "../../components/StatusBadge";
import DocumentPreview from "../../components/DocumentPreview";

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/applications");
      setApps(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.put(`/admin/applications/${id}/status`, {
        status: newStatus,
      });

      setApps((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status: res.data.status } : app
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  /* ---------------- STATES ---------------- */

  if (loading)
    return <p className="text-center mt-20 text-gray-500">Loading…</p>;

  if (error)
    return <p className="text-center mt-20 text-red-500">{error}</p>;

  if (!apps.length)
    return <p className="text-center mt-20">No applications found</p>;

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-6xl mx-auto p-8 space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          Job Applications
        </h1>

        {apps.map((app) => (
          <div
            key={app._id}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">
                  {app.firstName} {app.lastName}
                </h3>
                <p className="text-sm text-gray-500">{app.email}</p>
              </div>

              <StatusBadge status={app.status || "PENDING"} />
            </div>

            {/* BASIC INFO */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
              <p><strong>ID:</strong> {app.idNumber}</p>
              <p><strong>Gender:</strong> {app.gender}</p>
              <p><strong>Qualification:</strong> {app.qualification}</p>
              <p><strong>Experience:</strong> {app.experienceLevel}</p>
              <p>
                <strong>Applied:</strong>{" "}
                {new Date(app.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* DOCUMENTS */}
            <div>
              <p className="text-sm font-medium mb-2">Uploaded Documents</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.isArray(app.documents) && app.documents.length > 0 ? (
                  app.documents.map((doc, i) => (
                    <DocumentPreview
                      key={i}
                      url={doc.url}
                      name={doc.name}
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-400">
                    No documents uploaded
                  </p>
                )}
              </div>
            </div>

            {/* STATUS UPDATE */}
            <div className="flex items-center gap-4 pt-3 border-t">
              <span className="text-sm text-gray-500">
                Update Status
              </span>

              <select
                value={app.status || "PENDING"}
                onChange={(e) =>
                  handleStatusChange(app._id, e.target.value)
                }
                className="
                  px-4 py-2 rounded-xl text-sm
                  border border-gray-300
                  bg-white
                  focus:outline-none
                  focus:ring-2 focus:ring-blue-500
                  transition
                "
              >
                <option value="PENDING">Pending</option>
                <option value="SUCCESSFUL">Successful</option>
                <option value="UNSUCCESSFUL">Unsuccessful</option>
                <option value="SECOND_INTAKE">Second Intake</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
