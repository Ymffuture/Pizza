import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Mail, Phone, MapPin, Send, ShieldCheck, Clock, User } from "lucide-react";
import { motion } from "framer-motion";
import { Spin } from "antd";
import { api } from "../api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const LIMIT = 4;

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  // Fetch contact history
  const fetchHistory = async (reset = false) => {
    try {
      setFetching(true);
      const { data } = await api.get(`/contact?skip=${reset ? 0 : skip}&limit=${LIMIT}`);
      if (reset) {
        setHistory(data);
        setSkip(LIMIT);
      } else {
        setHistory(prev => [...prev, ...data]);
        setSkip(prev => prev + LIMIT);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchHistory(true);
  }, []);

  // Submit form
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
      fetchHistory(true);
    } catch (err) {
      setError("Failed to send message. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Skeleton loader
  const SkeletonItem = () => (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse">
      <div className="w-6 h-6 bg-gray-400 dark:bg-gray-600 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded w-1/2" />
        <div className="h-3 bg-gray-300 dark:bg-gray-500 rounded w-1/3" />
      </div>
    </div>
  );

  // Status dot component
  const StatusDot = ({ status }) => {
    const color =
      status === "pending" ? "bg-yellow-400 animate-pulse dark:text-white" :
      status === "approved" ? "bg-green-500 dark:text-white" :
      "bg-gray-400";
    const label =
      status === "pending" ? "Pending" :
      status === "approved" ? "Approved" :
      "Sending...";
    return (
      <span className="flex items-center gap-1 text-xs dark:text-white">
        <span className={`w-2 h-2 rounded-full dark:text-white ${color}`} />
        {label}
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-900 py-20 px-6">
      <Helmet><title>Contact Us | SwiftMeta</title></Helmet>

      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <header className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white glow">
            Contact SwiftMeta
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Let’s talk about your idea, project, or question.
          </p>

          <div className="mt-6 flex justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-2"><Clock size={16}/> Replies within 24h</span>
            <span className="flex items-center gap-2"><ShieldCheck size={16}/> Secure & private</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* INFO */}
          <aside className="space-y-8">
            <InfoCard icon={Mail} title="Email" value="support@swiftmeta.dev" />
            <InfoCard icon={Phone} title="Phone" value="+27 63 441 4863" />
            <InfoCard icon={MapPin} title="Location" value="Johannesburg, SA" />
          </aside>

          {/* FORM + HISTORY */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 bg-white dark:bg-white/5 rounded-3xl p-8 shadow-xl border border-black/5 dark:border-white/10"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              Send us a message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input label="Full Name" value={form.name} onChange={v=>updateField("name",v)} />
              <Input label="Email" type="email" value={form.email} onChange={v=>updateField("email",v)} />
              <Input label="Subject" value={form.subject} onChange={v=>updateField("subject",v)} />
              <Textarea label="Message" value={form.message} onChange={v=>updateField("message",v)} />

              {error && <p className="text-sm text-red-600 p-2 bg-red-600/10 rounded">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-[#666] hover:bg-gray-700 text-white flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Spin size={18}/> : "Send Message"}
                {!loading && <Send size={16}/>}
              </button>
            </form>

            {/* CONTACT HISTORY */}
            <div className="mt-10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Contacts
              </h3>

              <ul className="space-y-3">
                {fetching
                  ? Array(4).fill(0).map((_, idx) => <SkeletonItem key={idx}/>)
                  : history.length === 0
                    ? <p className="text-sm text-gray-500 dark:text-gray-400">No contacts yet.</p>
                    : history.map(item => (
                      <motion.li
                        key={item._id}
                        initial={{ opacity:0, x:-20 }}
                        animate={{ opacity:1, x:0 }}
                        transition={{ duration:0.3 }}
                        className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <User className="text-gray-400 dark:text-gray-500" size={18} />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
                            {item.subject && <span className="text-xs text-gray-500 dark:text-gray-400">{item.subject}</span>}
                          </div>
                        </div>
                        <StatusDot status={item.status} />
                      </motion.li>
                    ))
                }
              </ul>

              {/* LOAD MORE BUTTON */}
              {history.length % LIMIT === 0 && history.length > 0 &&
                <div className="flex justify-center mt-4">
                  <button
                    onClick={()=>fetchHistory(false)}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition"
                    disabled={fetching}
                  >
                    {fetching ? <Spin size={12}/> : "Load More"}
                  </button>
                </div>
              }
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}

/* COMPONENTS */
function InfoCard({ icon: Icon, title, value }) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-white/5 shadow border">
      <Icon className="text-blue-600 dark:text-gray-400" size={22} />
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{value}</p>
      </div>
    </div>
  );
}

function Input({ label, type="text", value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e=>onChange(e.target.value)}
        placeholder={label}
        className="w-full h-12 mt-1 px-4 rounded-xl bg-white dark:bg-[#222] text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <textarea
        rows={5}
        value={value}
        onChange={e=>onChange(e.target.value)}
        placeholder={label}
        className="w-full mt-1 px-4 py-3 rounded-xl bg-white dark:bg-[#222] text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
      />
    </div>
  );
}
