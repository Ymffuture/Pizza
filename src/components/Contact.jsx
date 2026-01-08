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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../api";

const PAGE_LIMIT = 5;

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const updateField = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  /* -----------------------------
     FETCH HISTORY (SAFE)
  ------------------------------ */
  const fetchHistory = async (pageNumber = 1) => {
    setLoadingHistory(true);
    try {
      const res = await api.get(
        `/contact?page=${pageNumber}&limit=${PAGE_LIMIT}`
      );

      const payload = res?.data || {};
      setHistory(Array.isArray(payload.data) ? payload.data : []);
      setPage(payload.page ?? 1);
      setTotalPages(payload.totalPages ?? 1);
    } catch (err) {
      console.error("History fetch failed:", err);
      setHistory([]);
      setPage(1);
      setTotalPages(1);
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
    setRateLimited(false);

    try {
      setLoading(true);
      await api.post("/contact", form);

      setForm({ name: "", email: "", subject: "", message: "" });
      fetchHistory(1);
    } catch (err) {
      if (err.response?.status === 429) {
        setRateLimited(true);
      }
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
     INITIAL LOADING GUARD
  ------------------------------ */
  if (loadingHistory && history.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-gray-400">
        <p className="animate-pulse text-sm">Loading contact data…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-900 py-20 px-6">
      <Helmet>
        <title>Contact | SwiftMeta</title>
      </Helmet>

      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <header className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Contact SwiftMeta
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            We usually reply within 24 hours.
          </p>

          <div className="mt-6 flex justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-2">
              <Clock size={16} /> Fast replies
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} /> Secure
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* INFO */}
          <aside className="space-y-8">
            <InfoCard icon={Mail} title="Email" value="support@swiftmeta.dev" />
            <InfoCard icon={Phone} title="Phone" value="+27 63 441 4863" />
            <InfoCard icon={MapPin} title="Location" value="Johannesburg" />
          </aside>

          {/* FORM */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white dark:bg-white/5 rounded-3xl p-8 shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-6 dark:text-white">
              Send a message
            </h2>

            {rateLimited && (
              <div className="mb-4 text-sm bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 p-3 rounded-xl">
                Too many requests. Please wait a moment.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input label="Name" value={form.name} onChange={v => updateField("name", v)} />
              <Input label="Email" value={form.email} onChange={v => updateField("email", v)} />
              <Input label="Subject" value={form.subject} onChange={v => updateField("subject", v)} />
              <Textarea label="Message" value={form.message} onChange={v => updateField("message", v)} />

              <button
                disabled={loading || rateLimited}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send"}
                <Send size={16} />
              </button>
            </form>

            {/* HISTORY */}
            <div className="mt-10">
              <h3 className="font-semibold mb-4 dark:text-white">
                Contact History
              </h3>

              <AnimatePresence mode="wait">
                {loadingHistory ? (
                  [...Array(PAGE_LIMIT)].map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                ) : history.length === 0 ? (
                  <motion.p
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-gray-500 dark:text-gray-400"
                  >
                    No contacts yet
                  </motion.p>
                ) : (
                  history.map(item => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/10 mb-2"
                    >
                      <User className="text-gray-400" size={18} />
                      <div>
                        <p className="text-sm font-medium dark:text-white">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.subject || "No subject"}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>

              {/* PAGINATION */}
              <div className="flex justify-between mt-4">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="flex items-center gap-1 text-sm disabled:opacity-40 dark:text-gray-300"
                >
                  <ChevronLeft size={16} /> Prev
                </button>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="flex items-center gap-1 text-sm disabled:opacity-40 dark:text-gray-300"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.section>
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
    <div className="flex gap-4 p-5 rounded-2xl bg-white dark:bg-white/5 shadow">
      <Icon className="text-blue-600" size={22} />
      <div>
        <h3 className="font-semibold dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{value}</p>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-600 dark:text-gray-400">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-12 mt-1 px-4 rounded-xl border
        bg-white dark:bg-black
        text-gray-900 dark:text-white
        placeholder-gray-400 dark:placeholder-gray-600"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-600 dark:text-gray-400">{label}</label>
      <textarea
        rows={5}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full mt-1 px-4 py-3 rounded-xl border
        bg-white dark:bg-black
        text-gray-900 dark:text-white
        placeholder-gray-400 dark:placeholder-gray-600"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
}

/* -----------------------------
   SKELETON (DARK MODE SAFE)
------------------------------ */
function SkeletonRow() {
  return (
    <div className="flex gap-3 p-3 rounded-xl bg-gray-100 dark:bg-white/5 animate-pulse mb-2">
      <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
      </div>
    </div>
  );
}
