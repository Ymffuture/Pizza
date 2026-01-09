import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createTicket } from "../api/ticketApi";
import { CheckCircle, Copy, Check, Loader2 } from "lucide-react";

export default function CreateTicket() {
  const [data, setData] = useState({
    email: "",
    subject: "",
    message: "",
  });
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const submit = async () => {
    if (!data.email || !data.message) return;

    setLoading(true);
    const res = await createTicket(data);
    setTicket(res);
    setLoading(false);
  };

  const copyId = async () => {
    if (!ticket) return;
    await navigator.clipboard.writeText(ticket.ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="
          w-full max-w-md
          bg-white/80 backdrop-blur-xl
          rounded-3xl shadow-2xl
          p-8
        "
      >
        <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
          Create Support Ticket
        </h1>
        <p className="text-sm text-neutral-500 mb-6">
          Describe your issue and we’ll get back to you.
        </p>

        {/* Inputs */}
        <div className="space-y-4">
          <input
            placeholder="Email address"
            value={data.email}
            onChange={e => setData({ ...data, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-neutral-100 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            placeholder="Subject"
            value={data.subject}
            onChange={e => setData({ ...data, subject: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-neutral-100 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <textarea
            placeholder="Describe your issue..."
            value={data.message}
            onChange={e => setData({ ...data, message: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-neutral-100 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          onClick={submit}
          className="
            mt-6 w-full h-11
            flex items-center justify-center
            rounded-xl
            bg-black text-white
            font-medium
            disabled:opacity-60
          "
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.span
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader2 className="animate-spin" size={18} />
              </motion.span>
            ) : (
              <motion.span
                key="text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Submit Ticket
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Success */}
        <AnimatePresence>
          {ticket && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="
                mt-6
                p-4 rounded-2xl
                bg-neutral-100
                flex items-start gap-3
              "
            >
              <CheckCircle className="text-green-500 mt-1" size={20} />

              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900">
                  Ticket created successfully
                </p>

                <div
                  role="button"
                  tabIndex={0}
                  onClick={copyId}
                  onKeyDown={e => e.key === "Enter" && copyId()}
                  className="
                    mt-1
                    flex items-center gap-2
                    text-sm font-mono
                    cursor-pointer
                    select-none
                  "
                >
                  <span>{ticket.ticketId}</span>

                  <motion.span
                    key={copied ? "check" : "copy"}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {copied ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <Copy size={16} className="text-neutral-500" />
                    )}
                  </motion.span>
                </div>

                <p className="text-xs text-neutral-500 mt-1">
                  Tap to copy your ticket ID
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
