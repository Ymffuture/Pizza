import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createTicket } from "../api/ticketApi";
import { CheckCircle } from "lucide-react";

export default function CreateTicket() {
  const [data, setData] = useState({
    email: "",
    subject: "",
    message: "",
  });
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!data.email || !data.message) return;

    setLoading(true);
    const res = await createTicket(data);
    setTicket(res);
    setLoading(false);
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
            className="
              w-full px-4 py-3
              rounded-xl
              bg-neutral-100
              focus:bg-white
              focus:ring-2 focus:ring-blue-500
              outline-none
              transition
            "
          />

          <input
            placeholder="Subject"
            value={data.subject}
            onChange={e => setData({ ...data, subject: e.target.value })}
            className="
              w-full px-4 py-3
              rounded-xl
              bg-neutral-100
              focus:bg-white
              focus:ring-2 focus:ring-blue-500
              outline-none
              transition
            "
          />

          <textarea
            placeholder="Describe your issue..."
            value={data.message}
            onChange={e => setData({ ...data, message: e.target.value })}
            rows={4}
            className="
              w-full px-4 py-3
              rounded-xl
              bg-neutral-100
              focus:bg-white
              focus:ring-2 focus:ring-blue-500
              outline-none
              transition resize-none
            "
          />
        </div>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          disabled={loading}
          onClick={submit}
          className="
            mt-6 w-full
            py-3 rounded-xl
            bg-black text-white
            font-medium
            disabled:opacity-50
            transition
          "
        >
          {loading ? "Submitting..." : "Submit Ticket"}
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
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  Ticket created successfully
                </p>
                <p className="text-sm text-neutral-600 mt-1">
                  Ticket ID:
                  <span className="ml-1 font-mono font-semibold">
                    {ticket.ticketId}
                  </span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
