import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSearch, 
  FiMail, 
  FiHash, 
  FiFileText, 
  FiCopy, 
  FiCheck, 
  FiUser, 
  FiCalendar, 
  FiShield,
  FiAlertCircle,
  FiExternalLink,
  FiDownload
} from "react-icons/fi";
import StatusBadge from "../../components/StatusBadge";
import { api } from "../../api";
import { Helmet } from "react-helmet";
import Loader from "./Loader";

/* ------------------------------------
   Smart Copy Hook
------------------------------------ */
const useClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (err) {
      return false;
    }
  };

  return { copy, copied };
};

/* ------------------------------------
   Smart Components
------------------------------------ */

const CopyableField = ({ label, value, maskedValue, icon: Icon, isSensitive = false }) => {
  const { copy, copied } = useClipboard();
  const displayValue = maskedValue || value;

  return (
    <motion.div 
      className="group relative p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-blue-500/30 transition-all duration-300"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs uppercase tracking-wider font-semibold">
        {Icon && <Icon size={14} />}
        {label}
      </div>
      
      <div className="flex items-center justify-between gap-4">
        <span className={`font-mono text-lg ${isSensitive ? 'tracking-wider' : ''} text-gray-900 dark:text-gray-100`}>
          {displayValue}
        </span>
        
        <motion.button
          onClick={() => copy(value)}
          whileTap={{ scale: 0.95 }}
          className={`p-2 rounded-xl transition-all duration-300 ${
            copied 
              ? 'bg-green-100 text-green-600 dark:bg-green-900/30' 
              : 'bg-white dark:bg-gray-700 text-gray-400 hover:text-blue-500 shadow-sm opacity-0 group-hover:opacity-100'
          }`}
          title="Copy to clipboard"
        >
          {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -top-8 right-0 px-3 py-1 bg-green-500 text-white text-xs rounded-lg shadow-lg flex items-center gap-1"
          >
            <FiCheck size={12} />
            Copied!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const DocumentCard = ({ label, doc, onCopyId }) => {
  if (!doc) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500" />
      
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
            <FiFileText size={24} />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
              {label}
            </p>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate mb-2">
              {doc.name}
            </h4>
            
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
              <span className="text-xs text-gray-400 font-mono truncate flex-1">
                ID: {doc.publicId}
              </span>
              <motion.button
                onClick={() => onCopyId(doc.publicId)}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-md hover:bg-white dark:hover:bg-gray-800 text-gray-400 hover:text-blue-500 transition-colors"
                title="Copy document ID"
              >
                <FiCopy size={14} />
              </motion.button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FiExternalLink size={16} />
            View
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-500 text-sm font-medium text-white hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/25"
          >
            <FiDownload size={16} />
            Download
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const StatusTimeline = ({ status, updatedAt }) => {
  const steps = [
    { id: 'submitted', label: 'Submitted', icon: FiCheck },
    { id: 'reviewing', label: 'Under Review', icon: FiSearch },
    { id: 'interview', label: 'Interview', icon: FiUser },
    { id: 'decision', label: 'Decision', icon: FiShield },
  ];

  const currentStep = steps.findIndex(s => s.id === status) || 0;

  return (
    <div className="py-6">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 rounded-full" />
        <motion.div 
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 -translate-y-1/2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index <= currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <motion.div 
                key={step.id}
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
                  } ${isCurrent ? 'ring-4 ring-blue-500/20 scale-110' : ''}`}
                  animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <step.icon size={18} />
                </motion.div>
                <span className={`text-xs font-medium ${isCompleted ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
        Last updated: {new Date(updatedAt).toLocaleString()}
      </p>
    </div>
  );
};

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-16 px-6 rounded-3xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 border border-dashed border-gray-300 dark:border-gray-700"
  >
    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
      <FiSearch className="text-gray-400" size={32} />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      Ready to Search
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
      Enter your ID number or email address above to view your application status
    </p>
  </motion.div>
);

/* ------------------------------------
   Helpers
------------------------------------ */
const maskIdNumber = (id = "") => {
  if (id.length < 6) return id;
  return `${id.slice(0, 2)}••••••${id.slice(-4)}`;
};

/* ------------------------------------
   Main Component
------------------------------------ */
export default function ApplicationStatus() {
  const [query, setQuery] = useState("");
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { copy: copyToClipboard, copied } = useClipboard();

  const isEmail = query.includes("@");

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
      setError("Unable to fetch application status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyDocId = (id) => {
    copyToClipboard(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20 py-12 px-4">
      <Helmet>
        <title>Application Status | Track Your Application</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 mb-4"
          >
            <FiShield size={32} />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Application Status
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Track your job application in real-time
          </p>
        </div>

        {/* Search Card */}
        <motion.div
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-6"
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
        >
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isEmail ? 'text-blue-500' : 'text-gray-400'}`}>
                {isEmail ? <FiMail size={20} /> : <FiHash size={20} />}
              </div>
              
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter ID number or email address..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
              />

              <AnimatePresence>
                {query && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 transition-colors"
                  >
                    <FiAlertCircle size={18} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm"
                >
                  <FiAlertCircle size={18} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading || !query.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-gray-900 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader />
              ) : (
                <>
                  <FiSearch size={20} />
                  {isEmail ? "Search by Email" : "Search by ID Number"}
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {application ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Applicant Card */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-6 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                      {application.firstName[0]}{application.lastName[0]}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {application.firstName} {application.lastName}
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">Applicant</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Copyable Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CopyableField
                      label="ID Number"
                      value={application.idNumber}
                      maskedValue={maskIdNumber(application.idNumber)}
                      icon={FiHash}
                      isSensitive
                    />
                    <CopyableField
                      label="Email Address"
                      value={application.email}
                      icon={FiMail}
                    />
                  </div>

                  {/* Status Timeline */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <FiCalendar size={16} />
                      Application Progress
                    </h3>
                    <StatusTimeline status={application.status} updatedAt={application.updatedAt} />
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiFileText size={20} />
                  Uploaded Documents
                </h3>
                <div className="grid gap-4">
                  <DocumentCard
                    label="Curriculum Vitae"
                    doc={application.documents?.cv}
                    onCopyId={handleCopyDocId}
                  />
                  <DocumentCard
                    label="Matric / School Report"
                    doc={application.documents?.doc1}
                    onCopyId={handleCopyDocId}
                  />
                  <DocumentCard
                    label="Certified ID Copy"
                    doc={application.documents?.doc2}
                    onCopyId={handleCopyDocId}
                  />
                </div>
              </div>
            </motion.div>
          ) : !loading && !error && query === "" ? (
            <EmptyState key="empty" />
          ) : null}
        </AnimatePresence>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-gray-400 dark:text-gray-600"
        >
          Protected by enterprise-grade encryption • POPIA Compliant
        </motion.p>
      </motion.div>
    </div>
  );
}
