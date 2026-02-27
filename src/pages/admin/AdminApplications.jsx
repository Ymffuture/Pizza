import { useEffect, useState } from "react";
import { api } from "../../api";
import StatusBadge from "../../components/StatusBadge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  ExternalLink, 
  Calendar, 
  Clock, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  User, 
  Mail, 
  Phone, 
  Shield,
  ChevronDown,
  Filter,
  Search
} from "lucide-react";

/* ---------------- DOCUMENT CONFIG ---------------- */
const DOCUMENT_CONFIG = {
  cv: { label: "Curriculum Vitae", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
  doc1: { label: "Supporting Document 1", icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
  doc2: { label: "Supporting Document 2", icon: FileText, color: "text-green-600", bg: "bg-green-50" },
  doc3: { label: "Supporting Document 3", icon: FileText, color: "text-orange-600", bg: "bg-orange-50" },
  doc4: { label: "Supporting Document 4", icon: FileText, color: "text-pink-600", bg: "bg-pink-50" },
  doc5: { label: "Supporting Document 5", icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50" },
};

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending Review", color: "bg-yellow-100 text-yellow-800" },
  { value: "SUCCESSFUL", label: "Approved", color: "bg-green-100 text-green-800" },
  { value: "UNSUCCESSFUL", label: "Declined", color: "bg-red-100 text-red-800" },
  { value: "SECOND_INTAKE", label: "Second Intake", color: "bg-blue-100 text-blue-800" },
];

/* ---------------- COMPONENTS ---------------- */

const InfoCard = ({ icon: Icon, label, value, href }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
    <div className="p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
      <Icon size={16} className="text-gray-600 dark:text-gray-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {label}
      </p>
      {href ? (
        <a 
          href={href} 
          target="_blank" 
          rel="noreferrer"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 mt-0.5 truncate"
        >
          {value}
          <ExternalLink size={12} />
        </a>
      ) : (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5 truncate">
          {value || "—"}
        </p>
      )}
    </div>
  </div>
);

const DocumentLink = ({ type, url, name }) => {
  const config = DOCUMENT_CONFIG[type] || DOCUMENT_CONFIG.doc1;
  const Icon = config.icon;
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200"
    >
      <div className={`p-3 rounded-lg ${config.bg} dark:bg-opacity-10`}>
        <Icon size={20} className={config.color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {name || config.label}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {config.label}
        </p>
      </div>
      <ExternalLink size={16} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors flex-shrink-0" />
    </a>
  );
};

const StatusSelect = ({ value, onChange }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className="appearance-none w-full pl-4 pr-10 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
  </div>
);

/* ---------------- MAIN COMPONENT ---------------- */

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredApps = apps.filter((app) => {
    const matchesFilter = filter === "ALL" || app.status === filter;
    const matchesSearch = 
      `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-3 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error Loading Data</h3>
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] py-8 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Applications
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Manage and review candidate applications
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {apps.length}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total
              </span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              >
                <option value="ALL">All Status</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Applications Grid */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredApps.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700"
              >
                <p className="text-gray-500 dark:text-gray-400">No applications found</p>
              </motion.div>
            ) : (
              filteredApps.map((app, index) => (
                <motion.article
                  key={app._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white dark:bg-[#111] rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_20px_-4px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-white/5 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-lg font-bold text-gray-600 dark:text-gray-300">
                        {app.firstName?.[0]}{app.lastName?.[0]}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {app.firstName} {app.lastName}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          <Mail size={14} />
                          {app.email}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <StatusBadge status={app.status || "PENDING"} />
                      <StatusSelect 
                        value={app.status || "PENDING"}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-6">
                    
                    {/* Personal Info */}
                    <section>
                      <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <User size={14} />
                        Personal Information
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <InfoCard icon={Phone} label="Phone" value={app.phone} />
                        <InfoCard icon={Shield} label="ID Number" value={app.idNumber} />
                        <InfoCard icon={User} label="Gender" value={app.gender} />
                        <InfoCard icon={MapPin} label="Location" value={app.location} />
                      </div>
                    </section>

                    {/* Professional Info */}
                    <section>
                      <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Briefcase size={14} />
                        Professional
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <InfoCard icon={GraduationCap} label="Qualification" value={app.qualification} />
                        <InfoCard icon={Clock} label="Experience" value={app.experience} />
                        <InfoCard icon={Briefcase} label="Current Role" value={app.currentRole} />
                        {app.portfolio && (
                          <InfoCard 
                            icon={ExternalLink} 
                            label="Portfolio" 
                            value="View Profile" 
                            href={app.portfolio} 
                          />
                        )}
                      </div>
                    </section>

                    {/* Documents */}
                    {app.documents && Object.values(app.documents).some(d => d?.url) && (
                      <section>
                        <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <FileText size={14} />
                          Documents
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {Object.entries(app.documents).map(([key, doc]) => 
                            doc?.url ? (
                              <DocumentLink 
                                key={key} 
                                type={key} 
                                url={doc.url} 
                                name={doc.name} 
                              />
                            ) : null
                          )}
                        </div>
                      </section>
                    )}

                    {/* Meta Footer */}
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>Applied: {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        <span>Updated: {new Date(app.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
