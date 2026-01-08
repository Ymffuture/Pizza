import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ShieldCheck,
  Clock,
  User,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../api";

const PAGE_LIMIT = 5;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  /* -----------------------------
     FETCH CONTACT HISTORY
  ------------------------------ */
  const fetchHistory = async (pageNumber = 1) => {
    try {
      setLoadingHistory(true);
      const { data } = await api.get(`/contact?page=${pageNumber}&limit=${PAGE_LIMIT}`);
      setHistory(data.data);
      setPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch contact history.");
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory(page);
  }, [page]);

  /* -----------------------------
     SUBMIT FORM
  ------------------------------ */
  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.email || !form.message) {
      return setError("Please fill in all required fields.");
    }

    try {
      setLoading(true);
      await api.post("/contact", form);
      setForm({ name: "", email: "", subject: "", message: "" });
      fetchHistory(1);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-900 py-20 px-6">
      <Helmet>
        <title>Contact Us | SwiftMeta</title>
      </Helmet>

      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <header className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
            Contact SwiftMeta
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Let’s talk about your idea, project, or question.
          </p>

          <div className="mt-6 flex justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-2">
              <Clock size={16} /> Replies within 24 hours
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} /> Secure & private
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* INFO */}
          <aside className="space-y-8">
            <InfoCard icon={Mail} title="Email" value="support@swiftmeta.dev" />
            <InfoCard icon={Phone} title="Phone" value="+27 63 441 4863" />
            <InfoCard icon={MapPin} title="Location" value="Johannesburg, SA" />
          </aside>

          {/* FORM */}
          <section className="lg:col-span-2 bg-white dark:bg-white/5 rounded-3xl p-8 shadow-xl border border-black/5 dark:border-white/10">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              Send us a message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input label="Full Name" value={form.name} onChange={v => updateField("name", v)} />
              <Input label="Email" type="email" value={form.email} onChange={v => updateField("email", v)} />
              <Input label="Subject" value={form.subject} onChange={v => updateField("subject", v)} />
              <Textarea label="Message" value={form.message} onChange={v => updateField("message", v)} />

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600 flex items-center gap-1"
                >
                  <AlertCircle size={16} /> {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <motion.div
                    className="flex items-center gap-2"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Loader2 size={16} /> Sending...
                  </motion.div>
                ) : (
                  <>
                    Send Message <Send size={16} />
                  </>
                )}
              </button>
            </form>

            {/* CONTACT HISTORY */}
            <div className="mt-10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Contacts
              </h3>

              <AnimatePresence>
                {loadingHistory
                  ? [...Array(PAGE_LIMIT)].map((_, i) => <SkeletonRow key={i} />)
                  : history.length === 0
                  ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-gray-500 dark:text-gray-400"
                    >
                      No contacts yet.
                    </motion.p>
                  )
                  : history.map(item => (
                      <motion.li
                        key={item._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-xl bg-gray-50 dark:bg-white/10 mb-2"
                      >
                        <div className="flex items-center gap-3">
                          <User className="text-blue-600" size={18} />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-300">
                              {item.subject || "No subject"}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-400">
                          {new Date(item.createdAt).toLocaleString()}
                        </span>
                      </motion.li>
                    ))}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/* -----------------------------
   COMPONENTS
------------------------------ */

function InfoCard({ icon: Icon, title, value }) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-white/5 shadow border">
      <Icon className="text-blue-600" size={22} />
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{value}</p>
      </div>
    </div>
  );
}

function Input({ label, type = "text", value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={label}
        className="w-full h-12 mt-1 px-4 rounded-xl border bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-400">{label}</label>
      <textarea
        rows={5}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={label}
        className="w-full mt-1 px-4 py-3 rounded-xl border bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white resize-none"
      />
    </div>
  );
}

/* -----------------------------
   SKELETON LOADER
------------------------------ */
function SkeletonRow() {
  return (
    <motion.li
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-xl bg-gray-100 dark:bg-gray-700 mb-2 animate-pulse"
    >
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 bg-gray-300 dark:bg-gray-500 rounded-full" />
        <div className="flex flex-col gap-1">
          <div className="h-3 w-24 bg-gray-300 dark:bg-gray-500 rounded" />
          <div className="h-2 w-16 bg-gray-200 dark:bg-gray-600 rounded" />
        </div>
      </div>
      <div className="h-3 w-12 bg-gray-300 dark:bg-gray-500 rounded" />
    </motion.li>
  );
}
