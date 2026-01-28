import { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiMail, FiHash } from "react-icons/fi";
import StatusBadge from "../../components/StatusBadge";
import { api } from "../../api";

export default function ApplicationStatus() {
  const [query, setQuery] = useState("");
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setError("Please enter your ID number or email address.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setApplication(null);

      const res = await api.get("/application/search", {
        params: { query },
      });

      if (!res.data) {
        setError("No application found with the provided details.");
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

  return (
    <div className="min-h-screen flex justify-center items-start py-12 bg-gray-50 dark:bg-gray-900 px-4 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            Application Status
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Search using your ID number or email address
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-2xl px-4 h-11">
            {query.includes("@") ? (
              <FiMail className="text-gray-400" />
            ) : (
              <FiHash className="text-gray-400" />
            )}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ID number or email"
              className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-2xl bg-black dark:bg-gray-100 text-white dark:text-gray-900 font-medium flex items-center justify-center gap-2"
          >
            {loading ? "Searching…" : (
              <>
                <FiSearch />
                Search Application
              </>
            )}
          </button>
        </form>

        {/* Result */}
        {application && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 border-t pt-6 dark:border-gray-700"
          >
            <div>
              <p className="text-gray-400 text-sm">Applicant</p>
              <p className="font-medium text-gray-900 dark:text-gray-100 text-lg">
                {application.firstName} {application.lastName}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Current Status</p>
              <StatusBadge status={application.status} />
            </div>

            <div>
              <p className="text-gray-400 text-sm">Last Updated</p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {new Date(application.updatedAt).toLocaleString()}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
