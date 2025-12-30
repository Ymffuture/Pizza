import React, { useState } from "react";
import { Helmet } from "react-helmet";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ShieldCheck,
  Clock,
} from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setLoading(true);

    // You can connect this to EmailJS, API route, or backend later
    setTimeout(() => {
      setLoading(false);
      alert("Message sent successfully. We'll get back to you shortly.");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-900 py-20 px-6">
      <Helmet>
        <title>Contact Us | SwiftMeta</title>
        <meta
          name="description"
          content="Contact SwiftMeta for support, partnerships, or project inquiries. We usually respond within 24 hours."
        />
      </Helmet>

      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <header className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
            Contact SwiftMeta
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Have a question, idea, or project in mind?  
            We’d love to hear from you.
          </p>

          <div className="mt-6 flex justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-2">
              <Clock size={16} /> Replies within 24 hours
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} /> Your data stays private
            </span>
          </div>
        </header>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT INFO */}
          <aside className="space-y-8">
            <InfoCard
              icon={Mail}
              title="Email"
              value="support@swiftmeta.dev"
              description="Best for detailed questions or support."
            />

            <InfoCard
              icon={Phone}
              title="Phone"
              value="+27 63 441 4863"
              description="Available during business hours."
            />

            <InfoCard
              icon={MapPin}
              title="Location"
              value="Johannesburg, South Africa"
              description="Remote-first. Working globally."
            />
          </aside>

          {/* FORM */}
          <section className="lg:col-span-2 bg-white dark:bg-white/5 rounded-3xl p-8 md:p-10 shadow-xl border border-black/5 dark:border-white/10">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Send us a message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Full Name"
                value={form.name}
                onChange={(v) => updateField("name", v)}
                placeholder="John Appleseed"
                required
              />

              <Input
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(v) => updateField("email", v)}
                placeholder="you@company.com"
                required
              />

              <Input
                label="Subject (optional)"
                value={form.subject}
                onChange={(v) => updateField("subject", v)}
                placeholder="How can we help?"
              />

              <Textarea
                label="Message"
                value={form.message}
                onChange={(v) => updateField("message", v)}
                placeholder="Tell us about your project, issue, or question…"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2 transition disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send Message"}
                <Send size={16} />
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                By submitting, you agree to our privacy policy.
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

/* ----------------------------------
   COMPONENTS
----------------------------------- */

function InfoCard({ icon: Icon, title, value, description }) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-white/5 shadow border border-black/5 dark:border-white/10">
      <Icon className="text-blue-600 mt-1" size={22} />
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      </div>
    </div>
  );
}

function Input({ label, type = "text", value, onChange, placeholder, required }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 px-4 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black text-gray-900 dark:text-white placeholder:text-purple-400 focus:ring-4 focus:ring-blue-500/20 outline-none"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, required }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <textarea
        rows={5}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black text-gray-900 dark:text-white placeholder:text-purple-400 focus:ring-4 focus:ring-blue-500/20 outline-none resize-none"
      />
    </div>
  );
}
