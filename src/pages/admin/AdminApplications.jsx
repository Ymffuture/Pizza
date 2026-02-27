import { useEffect, useState } from "react";
import { api } from "../../api";
import StatusBadge from "../../components/StatusBadge";
import DocumentPreview from "../../components/DocumentPreview";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Calendar, 
  Clock, 
  FileText, 
  ExternalLink,
  ChevronDown,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";

/* ---------------- DOCUMENT LABELS ---------------- */
const DOCUMENT_LABELS = {
  cv: "Curriculum Vitae",
  doc1: "Supporting Document 1",
  doc2: "Supporting Document 2",
  doc3: "Supporting Document 3",
  doc4: "Supporting Document 4",
  doc5: "Supporting Document 5",
};

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending Review", color: "bg-amber-100 text-amber-700 border-amber-200", icon: AlertCircle },
  { value: "SUCCESSFUL", label: "Approved", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  { value: "UNSUCCESSFUL", label: "Declined", color: "bg-rose-100 text-rose-700 border-rose-200", icon: XCircle },
  { value: "SECOND_INTAKE", label: "Second Intake", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Calendar },
];

/* ---------------- HELPER COMPONENTS ---------------- */
const InfoItem = ({ icon: Icon, label, value, href }) => (
  <div className="flex items-start gap-3 group">
    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
      <Icon size={14} className="text-gray-500" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-0.5">{label}</p>
      {href ? (
        <a 
          href={href} 
          target="_blank" 
          rel="noreferrer"
          className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
        >
          {value}
          <ExternalLink size={12} />
        </a>
      ) : (
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{value || "—"}</p>
      )}
    </div>
  </div>
);

const SectionTitle = ({ children }) => (
  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
    {children}
  </h4>
);

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedId, setExpandedId] = useState(null);

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
      const res = await api.put(`/admin/applications/${id}/status`, { status: newStatus });
      setApps((prev) => prev.map((app) => app._id === id ? { ...app, status: res.data.status } : app));
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const filteredApps = apps.filter((app) => {
    const matchesSearch = 
      `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: apps.length,
    pending: apps.filter((a) => a.status === "PENDING" || !a.status).length,
    approved: apps.filter((a) => a.status === "SUCCESSFUL").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-black dark:border-t-white rounded-full animate-spin" />
          <p className="text-sm text-gray-500 animate-pulse">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-lg border border-red-100 dark:border-red-900/30 max-w-md">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error Loading Data</h3>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button 
            onClick={fetchApplications}
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] pb-12">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Applications</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and review candidate applications</p>
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Total</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/30">
              <p className="text-[10px] uppercase tracking-wider text-amber-600 font-medium">Pending</p>
              <p className="text-lg font-semibold text-amber-700">{stats.pending}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white appearance-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
        </div>

        {/* Empty State */}
        {filteredApps.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No applications found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Applications List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredApps.map((app, index) => {
              const isExpanded = expandedId === app._id;
              const statusOption = STATUS_OPTIONS.find((s) => s.value === (app.status || "PENDING")) || STATUS_OPTIONS[0];
              const StatusIcon = statusOption.icon;

              return (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Card Header - Always Visible */}
                  <div 
                    className="p-5 flex items-center gap-4 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : app._id)}
                  >
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                        {app.firstName?.[0]}{app.lastName?.[0]}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {app.firstName} {app.lastName}
                        </h3>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusOption.color}`}>
                          <StatusIcon size={12} />
                          {statusOption.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{app.email} • {app.phone || "No phone"}</p>
                    </div>

                    {/* Meta */}
                    <div className="hidden sm:flex items-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <GraduationCap size={14} />
                        <span className="truncate max-w-[120px]">{app.qualification || "—"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Expand Icon */}
                    <div className={`w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDown size={16} className="text-gray-500" />
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-gray-100 dark:border-white/5"
                      >
                        <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Personal Info */}
                          <div className="space-y-4">
                            <SectionTitle>Personal Information</SectionTitle>
                            <div className="space-y-3">
                              <InfoItem icon={Mail} label="Email" value={app.email} />
                              <InfoItem icon={Phone} label="Phone" value={app.phone} />
                              <InfoItem icon={Users} label="ID Number" value={app.idNumber} />
                              <InfoItem icon={MapPin} label="Location" value={app.location} />
                            </div>
                          </div>

                          {/* Professional Info */}
                          <div className="space-y-4">
                            <SectionTitle>Professional Details</SectionTitle>
                            <div className="space-y-3">
                              <InfoItem icon={GraduationCap} label="Qualification" value={app.qualification} />
                              <InfoItem icon={Briefcase} label="Experience" value={app.experience} />
                              <InfoItem icon={Briefcase} label="Current Role" value={app.currentRole} />
                              {app.portfolio && (
                                <InfoItem 
                                  icon={ExternalLink} 
                                  label="Portfolio" 
                                  value="View Portfolio" 
                                  href={app.portfolio} 
                                />
                              )}
                            </div>
                          </div>

                          {/* Documents & Actions */}
                          <div className="space-y-4">
                            <SectionTitle>Documents & Status</SectionTitle>
                            
                            {/* Documents */}
                            <div className="space-y-2">
                              {app.documents && Object.entries(app.documents).some(([_, doc]) => doc?.url) ? (
                                Object.entries(app.documents).map(([key, doc]) => 
                                  doc?.url ? (
                                    <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                      <div className="flex items-center gap-2">
                                        <FileText size={14} className="text-gray-400" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{DOCUMENT_LABELS[key]}</span>
                                      </div>
                                      <DocumentPreview url={doc.url} name={doc.name} />
                                    </div>
                                  ) : null
                                )
                              ) : (
                                <p className="text-sm text-gray-400 italic">No documents uploaded</p>
                              )}
                            </div>

                            {/* Status Update */}
                            <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                              <label className="text-xs font-medium text-gray-500 mb-2 block">Update Application Status</label>
                              <div className="relative">
                                <select
                                  value={app.status || "PENDING"}
                                  onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white appearance-none cursor-pointer"
                                >
                                  {STATUS_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                              </div>
                            </div>

                            {/* Timestamps */}
                            <div className="flex items-center gap-4 text-xs text-gray-400 pt-2">
                              <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                Applied {new Date(app.createdAt).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                Updated {new Date(app.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
