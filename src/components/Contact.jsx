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
} from "lucide-react";
import { api } from "../api";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  const updateField = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  /* -----------------------------
     FETCH CONTACT HISTORY
  ------------------------------ */
  const fetchHistory = async () => {
    try {
      const { data } = await api.get("/contact");
      setHistory(data); // expects array
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

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
      fetchHistory();
    } catch (err) {
      setError("Failed to send message. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-900 py-20 px-6 dark:text-white">
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
                <p className="text-sm text-red-600 bg-red-600/10 p-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Message"}
                <Send size={16} />
              </button>
            </form>

            {/* CONTACT HISTORY */}
            <div className="mt-10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Contacts
              </h3>

              <ul className="space-y-3">
                {history.length === 0 && (
                  <p className="text-sm text-gray-500">No contacts yet.</p>
                )}

                {history.map(item => (
                  <li
                    key={item._id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/10"
                  >
                    <User className="text-blue-600" size={18} />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.name} | {item.subject} 
                    </span>
                  </li>
                ))}
              </ul>
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
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-12 mt-1 px-4 rounded-xl border bg-white dark:bg-black"
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
        onChange={e => onChange(e.target.value)}
        className="w-full mt-1 px-4 py-3 rounded-xl border bg-white dark:bg-black resize-none"
      />
    </div>
  );
}
