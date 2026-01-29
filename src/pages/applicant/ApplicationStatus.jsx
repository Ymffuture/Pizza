import { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiMail, FiHash, FiFileText } from "react-icons/fi";
import StatusBadge from "../../components/StatusBadge";
import { api } from "../../api";
import { Helmet } from "react-helmet";
import Loader from "./Loader";

/* ------------------------------------
   Helpers
------------------------------------ */
const maskIdNumber = (id = "") => {
  if (id.length < 4) return id;
  return `${id[0]}****${id.slice(-3)}`;
};

const renderDocument = (label, doc) => {
  if (!doc) return null;

  return (
    <div className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm">
      <FiFileText className="text-gray-400 mt-1" />
      <div className="space-y-1">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {doc.name}
        </p>
        <p className="text-xs text-gray-500 break-all">
          Public ID: {doc.publicId}
        </p>
      </div>
    </div>
  );
};

/* ------------------------------------
   Component
------------------------------------ */
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
    <div className="min-h-screen flex justify-center items-start dark:bg-gray-900 transition-colors">
      <Helmet>
        <title>Application Status</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl space-y-8"
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

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-2xl bg-black dark:bg-gray-100 text-white dark:text-gray-900 font-medium flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader />
            ) : (
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
            {/* Applicant */}
            <div>
              <p className="text-gray-400 text-sm">Applicant</p>
              <p className="font-medium text-gray-900 dark:text-gray-100 text-lg">
                {application.firstName} {application.lastName}
              </p>
            </div>

            {/* ID + Email */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">ID Number</p>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {maskIdNumber(application.idNumber)}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-gray-700 dark:text-gray-300 text-sm truncate">
                  {application.email}
                </p>
              </div>
            </div>

            {/* Status */}
            <div>
              <p className="text-gray-400 text-sm">Current Status</p>
              <StatusBadge status={application.status} />
            </div>

            {/* Updated */}
            <div>
              <p className="text-gray-400 text-sm">Last Updated</p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {new Date(application.updatedAt).toLocaleString()}
              </p>
            </div>

            {/* Documents */}
            <div className="space-y-3">
              <p className="text-gray-400 text-sm">Uploaded Documents</p>

              {renderDocument(
                "Curriculum Vitae (CV)",
                application.documents?.cv
               
              )}

              {renderDocument(
                "Matric / Latest School Report",
                application.documents?.doc1
              )}

              {renderDocument(
                "Certified ID Copy",
                application.documents?.doc2
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
