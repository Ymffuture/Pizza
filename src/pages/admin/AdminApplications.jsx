import { useEffect, useState } from "react";
import { api } from "../../api";
import StatusBadge from "../../components/StatusBadge";
import DocumentPreview from "../../components/DocumentPreview";
import { motion } from "framer-motion";

/* ---------------- DOCUMENT LABELS ---------------- */
const DOCUMENT_LABELS = {
  cv: "Curriculum Vitae (CV)",
  doc1: "Supporting Document 1",
  doc2: "Supporting Document 2",
  doc3: "Supporting Document 3",
  doc4: "Supporting Document 4",
  doc5: "Supporting Document 5",
};

/* ---------------- SMALL HELPER ---------------- */
const Info = ({ label, value }) => (
  <p className="text-gray-700 text-sm">
    <span className="font-medium">{label}:</span>{" "}
    {value || "—"}
  </p>
);

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------------- FETCH ---------------- */
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

  /* ---------------- STATUS UPDATE ---------------- */
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
        Loading applications…
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-20 text-red-500 text-lg">
        {error}
      </p>
    );

  if (!apps.length)
    return (
      <p className="text-center mt-20 text-gray-500 text-lg">
        No applications found
      </p>
    );

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 pt-20">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 tracking-tight">
          Job Applications
        </h1>

        {apps.map((app) => (
          <motion.div
            key={app._id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-3xl shadow-md p-6 space-y-6"
          >
            {/* ---------------- HEADER ---------------- */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {app.firstName} {app.lastName}
                </h3>
                <p className="text-sm text-gray-500">
                  {app.email}
                </p>
              </div>
              <StatusBadge status={app.status || "PENDING"} />
            </div>

            {/* ---------------- PERSONAL INFO ---------------- */}
            <div>
              <p className="font-semibold text-gray-800 mb-2">
                Personal Information
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <Info label="Email" value={app.email} />
                <Info label="Phone" value={app.phone} />
                <Info label="ID Number" value={app.idNumber} />
                <Info label="Gender" value={app.gender} />
                <Info label="Location" value={app.location} />
              </div>
            </div>

            {/* ---------------- PROFESSIONAL INFO ---------------- */}
            <div>
              <p className="font-semibold text-gray-800 mb-2">
                Professional Information
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <Info label="Qualification" value={app.qualification} />
                <Info label="Experience" value={app.experience} />
                <Info label="Current Role" value={app.currentRole} />

                {app.portfolio && (
                  <p className="text-sm">
                    <span className="font-medium">Portfolio:</span>{" "}
                    <a
                      href={app.portfolio}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>
                  </p>
                )}
              </div>
            </div>

            {/* ---------------- META ---------------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-500">
              <p>
                <span className="font-medium">Applied:</span>{" "}
                {new Date(app.createdAt).toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Last Updated:</span>{" "}
                {new Date(app.updatedAt).toLocaleString()}
              </p>
            </div>

            {/* ---------------- DOCUMENTS ---------------- */}
            <div>
              <p className="font-semibold text-gray-800 mb-3">
                Uploaded Documents
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {app.documents &&
                Object.entries(app.documents).some(
                  ([_, doc]) => doc?.url
                ) ? (
                  Object.entries(app.documents).map(([key, doc]) =>
                    doc?.url ? (
                      <div key={key} className="space-y-1">
                        <p className="text-sm font-medium text-gray-600">
                          {DOCUMENT_LABELS[key] || key}
                        </p>
                        <DocumentPreview
                          url={doc.url}
                          name={doc.name}
                        />
                      </div>
                    ) : null
                  )
                ) : (
                  <p className="text-gray-400 text-sm">
                    No documents uploaded
                  </p>
                )}
              </div>
            </div>

            {/* ---------------- STATUS UPDATE ---------------- */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-3">
              <span className="text-gray-500 text-sm font-medium">
                Update Status
              </span>

              <select
                value={app.status || "PENDING"}
                onChange={(e) =>
                  handleStatusChange(app._id, e.target.value)
                }
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-400"
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
