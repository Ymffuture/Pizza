import { useEffect, useState } from "react";
import { api } from "../../api";
import StatusBadge from "../../components/StatusBadge";
import DocumentPreview from "../../components/DocumentPreview";
import { motion } from "framer-motion";

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
    return (
      <p className="text-center mt-20 text-gray-500 text-lg animate-pulse">
        Loading…
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-20 text-red-500 text-lg">{error}</p>
    );

  if (!apps.length)
    return (
      <p className="text-center mt-20 text-gray-500 text-lg">
        No applications found
      </p>
    );

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 pt-16">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 tracking-tight mb-6">
          Job Applications
        </h1>

        {apps.map((app) => (
          <motion.div
            key={app._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-md p-6 space-y-6"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {app.firstName} {app.lastName}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-medium text-gray-700">Email:</span>{" "}
                  {app.email}
                </p>
              </div>
              <StatusBadge status={app.status || "PENDING"} />
            </div>

            {/* BASIC INFO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <p className="text-gray-700 text-sm">
                <span className="font-medium">ID:</span> {app.idNumber}
              </p>
              <p className="text-gray-700 text-sm">
                <span className="font-medium">Gender:</span> {app.gender}
              </p>
              <p className="text-gray-700 text-sm">
                <span className="font-medium">Qualification:</span>{" "}
                {app.qualification}
              </p>
              <p className="text-gray-700 text-sm">
                <span className="font-medium">Experience:</span>{" "}
                {app.experienceLevel}
              </p>
              <p className="text-gray-700 text-sm">
                <span className="font-medium">Applied:</span>{" "}
                {new Date(app.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* DOCUMENTS */}
            <div className="space-y-3">
              <p className="text-gray-700 font-semibold">Uploaded Documents</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {app.documents &&
                Object.values(app.documents).filter(Boolean).length > 0 ? (
                  Object.values(app.documents)
                    .filter((doc) => doc?.url)
                    .map((doc, i) => (
                      <DocumentPreview key={i} url={doc.url} name={doc.name} />
                    ))
                ) : (
                  <p className="text-gray-400 text-sm">
                    No documents uploaded
                  </p>
                )}
              </div>
            </div>

            {/* STATUS UPDATE */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-3">
              <span className="text-gray-500 text-sm font-medium">
                Update Status
              </span>

              <select
                value={app.status || "PENDING"}
                onChange={(e) =>
                  handleStatusChange(app._id, e.target.value)
                }
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              >
                <option value="PENDING">Pending</option>
                <option value="SUCCESSFUL">Successful</option>
                <option value="UNSUCCESSFUL">Unsuccessful</option>
                <option value="SECOND_INTAKE">Second Intake</option>
              </select>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
