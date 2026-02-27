import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSearch, 
  FiMail, 
  FiHash, 
  FiFileText, 
  FiUser, 
  FiClock, 
  FiCheckCircle, 
  FiAlertCircle,
  FiArrowRight,
  FiShield
} from "react-icons/fi";
import { api } from "../../api";
import { Helmet } from "react-helmet";

/* ------------------------------------
   Status Config
------------------------------------ */
const STATUS_CONFIG = {
  PENDING: {
    icon: FiClock,
    title: "Under Review",
    description: "Your application is being reviewed by our team. We'll notify you once a decision is made.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    progress: 33
  },
  SUCCESSFUL: {
    icon: FiCheckCircle,
    title: "Approved",
    description: "Congratulations! Your application has been approved. Check your email for next steps.",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    progress: 100
  },
  UNSUCCESSFUL: {
    icon: FiAlertCircle,
    title: "Not Approved",
    description: "We regret to inform you that your application was not successful at this time.",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    progress: 100
  },
  SECOND_INTAKE: {
    icon: FiShield,
    title: "Second Intake",
    description: "Your application has been moved to our second intake pool for further consideration.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    progress: 66
  }
};

/* ------------------------------------
   Helpers
------------------------------------ */
const maskIdNumber = (id = "") => {
  if (id.length < 4) return id;
  return `${id[0]}****${id.slice(-3)}`;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/* ------------------------------------
   Components
------------------------------------ */
const DocumentCard = ({ label, doc, index }) => {
  if (!doc) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center flex-shrink-0">
        <FiFileText size={24} className="text-gray-600 dark:text-gray-300" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {doc.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
      </div>
      <FiArrowRight size={18} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
    </motion.div>
  );
};

const StatusTracker = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  const StatusIcon = config.icon;
  
  return (
    <div className={`relative overflow-hidden rounded-3xl ${config.bg} dark:bg-opacity-10 border ${config.border} p-6`}>
      {/* Progress Bar Background */}
      <div className="absolute top-0 left-0 h-1 bg-gray-200 dark:bg-gray-700 w-full">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${config.progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${config.color.replace('text-', 'bg-')}`}
        />
      </div>
      
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-2xl bg-white dark:bg-gray-800 shadow-sm ${config.color}`}>
          <StatusIcon size={28} />
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-bold ${config.color}`}>
            {config.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 leading-relaxed">
            {config.description}
          </p>
        </div>
      </div>
      
      {/* Status Steps */}
      <div className="mt-6 flex items-center justify-between">
        {['Received', 'Review', 'Decision'].map((step, idx) => {
          const stepProgress = (idx + 1) * 33;
          const isActive = config.progress >= stepProgress;
          const isCurrent = config.progress >= stepProgress && config.progress < stepProgress + 33;
          
          return (
            <div key={step} className="flex flex-col items-center gap-2">
              <div className={`w-3 h-3 rounded-full transition-colors duration-500 ${
                isActive ? config.color.replace('text-', 'bg-') : 'bg-gray-300 dark:bg-gray-600'
              } ${isCurrent ? 'ring-4 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ' + config.color.replace('text-', 'ring-') : ''}`} />
              <span className={`text-xs font-medium ${
                isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
              }`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ------------------------------------
   Main Component
------------------------------------ */
export default function ApplicationStatus() {
  const [query, setQuery] = useState("");
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter your ID number or email address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setApplication(null);

      const res = await api.get("/application/search", { params: { query } });
      
      if (!res.data) {
        setError("No application found with those details");
      } else {
        setApplication(res.data);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to fetch application status");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setApplication(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <Helmet>
        <title>Check Application Status</title>
      </Helmet>

      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              Check Your Status
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your ID number or email to view your application
            </p>
          </div>

          {/* Search Card */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-black/5 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 p-2">
            <form onSubmit={handleSearch} className="p-4 space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {query.includes("@") ? <FiMail size={20} /> : <FiHash size={20} />}
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ID number or email address"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all text-base"
                />
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-950/30 p-3 rounded-xl"
                  >
                    <FiAlertCircle size={16} />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <FiSearch size={20} />
                    Search Application
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {application && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Status Tracker */}
                <StatusTracker status={application.status} />

                {/* Applicant Card */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg shadow-black/5 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <FiUser size={20} className="text-gray-400" />
                        Applicant Details
                      </h2>
                      <button
                        onClick={clearSearch}
                        className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        New Search
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Name */}
                    <div className="text-center pb-6 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Applicant Name</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {application.firstName} {application.lastName}
                      </p>
                    </div>

                    {/* Grid Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">ID Number</p>
                        <div className="flex items-center gap-2 text-gray-900 dark:text-white font-mono">
                          <FiShield size={16} className="text-gray-400" />
                          {maskIdNumber(application.idNumber)}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email</p>
                        <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                          <FiMail size={16} className="text-gray-400" />
                          <span className="truncate">{application.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Last Updated */}
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Last Updated</p>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <FiClock size={16} className="text-gray-400" />
                        {formatDate(application.updatedAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                {application.documents && Object.values(application.documents).some(d => d) && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <FiFileText size={20} className="text-gray-400" />
                      Uploaded Documents
                    </h3>
                    <div className="space-y-3">
                      {application.documents?.cv && (
                        <DocumentCard 
                          label="Curriculum Vitae" 
                          doc={application.documents.cv} 
                          index={0} 
                        />
                      )}
                      {application.documents?.doc1 && (
                        <DocumentCard 
                          label="Matric / School Report" 
                          doc={application.documents.doc1} 
                          index={1} 
                        />
                      )}
                      {application.documents?.doc2 && (
                        <DocumentCard 
                          label="Certified ID Copy" 
                          doc={application.documents.doc2} 
                          index={2} 
                        />
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
