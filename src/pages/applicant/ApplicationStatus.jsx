import { useEffect, useState } from "react";
import StatusBadge from "../../components/StatusBadge";
import { api } from "../../api";

export default function ApplicationStatus() {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        setError("");

        // ✅ CORRECT ENDPOINT
        const res = await api.get("/application/latest");

        if (!res.data) {
          setError("No application found");
        } else {
          setApplication(res.data);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to fetch application status.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  /* ---------------- STATES ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <p className="text-gray-500 text-sm">
          Loading application status…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="bg-white rounded-2xl border p-6 max-w-md text-center">
          <h2 className="text-lg font-medium mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white rounded-xl text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <p className="text-gray-500 text-sm">
          No application found
        </p>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex justify-center py-10">
      <div className="w-full max-w-xl bg-white border rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-semibold mb-1">
          Application Status
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Track your job application progress
        </p>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Applicant</p>
            <p className="font-medium">
              {application.firstName} {application.lastName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Current Status</p>
            <StatusBadge status={application.status} />
          </div>

          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-sm text-gray-700">
              {new Date(application.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
