import React, { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-hot-toast";

const Newsletter = () => {
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  // ---------------------------
  // COOLDOWN INIT
  // ---------------------------
  useEffect(() => {
    const lastSent = localStorage.getItem("newsletter_last_sent");
    if (lastSent) {
      const diff = Math.floor((Date.now() - Number(lastSent)) / 1000);
      const remaining = 7200 - diff;
      if (remaining > 0) setCooldown(remaining);
    }
  }, []);

  // ---------------------------
  // COOLDOWN TICK
  // ---------------------------
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}h ${m}m ${s}s`;
  };

  // ---------------------------
  // SUBMIT
  // ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cooldown > 0) return;

    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      await emailjs.send(
        "service_kw38oux",
        "template_etyg50k",
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        "IolitXztFVvhZg6PX"
      );

      toast.success("Message sent successfully");
      setForm({ name: "", email: "", message: "" });
      localStorage.setItem("newsletter_last_sent", Date.now().toString());
      setCooldown(7200);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#f5f5f7] dark:bg-black py-24">
      <div
        className="
          max-w-3xl mx-auto px-8 py-16
          rounded-[32px]
          bg-white/70 dark:bg-white/5
          backdrop-blur-xl
          border border-black/5 dark:border-white/10
          shadow-[0_10px_40px_rgba(0,0,0,0.08)]
        "
      >
        {/* HEADER */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold tracking-widest uppercase text-blue-500 mb-3">
            Newsletter
          </p>

          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-4">
            Stay Inspired
          </h2>

          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl mx-auto">
            Thoughtful updates, insights, and resources — delivered occasionally.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NAME */}
          <InputField
            label="Full Name"
            placeholder="John Appleseed"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />

          {/* EMAIL */}
          <InputField
            label="Email Address"
            type="email"
            placeholder="you@icloud.com"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />

          {/* MESSAGE */}
          <TextareaField
            label="Message"
            placeholder="Write something thoughtful…"
            value={form.message}
            onChange={(v) => setForm({ ...form, message: v })}
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className={`
              w-full h-12 rounded-2xl text-lg font-medium
              transition-all duration-300
              ${
                cooldown > 0
                  ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500"
              }
              text-white
              focus:outline-none focus:ring-4 focus:ring-blue-500/30
            `}
          >
            {loading
              ? "Sending…"
              : cooldown > 0
              ? `Wait ${formatTime(cooldown)}`
              : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
};

/* ----------------------------------
   REUSABLE INPUTS (Apple-style)
----------------------------------- */

const InputField = ({ label, type = "text", value, onChange, placeholder }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="
        w-full h-12 px-4 rounded-2xl
        bg-white/80 dark:bg-white/5
        border border-black/10 dark:border-white/10
        text-gray-900 dark:text-white
        placeholder:text-gray-400
        focus:outline-none focus:ring-4 focus:ring-blue-500/20
        transition
      "
    />
  </div>
);

const TextareaField = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
      {label}
    </label>
    <textarea
      rows={5}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="
        w-full px-4 py-3 rounded-2xl
        bg-white/80 dark:bg-white/5
        border border-black/10 dark:border-white/10
        text-gray-900 dark:text-white
        placeholder:text-gray-400
        focus:outline-none focus:ring-4 focus:ring-blue-500/20
        transition
      "
    />
  </div>
);

export default Newsletter;
