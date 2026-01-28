import { useEffect, useState } from "react";
import StatusBadge from "../../components/StatusBadge";
import { api } from "../../api";
import { motion } from "framer-motion";

export default function ApplicationStatus() {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        setError("");

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-400">
        <p className="text-white text-lg font-semibold animate-pulse">
          Loading application status…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-400 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl"
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-900">
            Oops!
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 text-white rounded-2xl font-medium hover:scale-105 transition-transform"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-400 px-4">
        <p className="text-white text-lg font-semibold">
          No application found
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-start py-12 bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-400 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl p-8 bg-white rounded-3xl shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Application Status
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Track your job application progress
        </p>

        <div className="space-y-6">
          {/* Applicant */}
          <div>
            <p className="text-gray-400 text-sm">Applicant</p>
            <p className="font-medium text-gray-900 text-lg">
              {application.firstName} {application.lastName}
            </p>
          </div>

          {/* Status */}
          <div>
            <p className="text-gray-400 text-sm">Current Status</p>
            <StatusBadge status={application.status} />
          </div>

          {/* Last Updated */}
          <div>
            <p className="text-gray-400 text-sm">Last Updated</p>
            <p className="text-gray-700 text-sm">
              {new Date(application.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
