import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTicket, replyTicket } from "../api/ticketApi";
import { Search, Send, Ticket, Info } from "lucide-react";
import MessageBubble from "../components/MessageBubble";

export default function TrackTicket() {
  const [id, setId] = useState("");
  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    if (!id.trim()) return;
    try {
      setLoading(true);
      setError("");
      const data = await getTicket(id);
      setTicket(data);
    } catch {
      setError("Ticket not found");
      setTicket(null);
    } finally {
      setLoading(false);
    }
  };

  const reply = async () => {
    if (!message.trim()) return;
    const updated = await replyTicket(id, {
      sender: "user",
      message,
    });
    setTicket(updated);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="max-w-2xl mx-auto px-6 mt-16">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-semibold text-neutral-900">
            Track Your Ticket
          </h1>
          <p className="text-sm text-neutral-500">
            Enter your ticket ID to view updates
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-6"
        >
          <div className="relative flex-1">
            <Ticket
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              placeholder="TCK-XXXXXX"
              value={id}
              onChange={e => setId(e.target.value)}
              className="
                w-full pl-9 pr-4 py-3
                rounded-xl bg-white
                shadow-sm
                focus:ring-2 focus:ring-blue-500
                outline-none
              "
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={load}
            className="px-5 py-3 rounded-xl bg-black text-white"
          >
            {loading ? "Loading..." : <Search size={18} />}
          </motion.button>
        </motion.div>

        {error && (
          <p className="text-sm text-red-500 mb-4">{error}</p>
        )}

        {/* Ticket Content */}
        <AnimatePresence>
          {ticket && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              {/* Ticket Info */}
              <div className="p-5 border-b bg-neutral-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-sm">
                    <Ticket size={16} />
                    {ticket.ticketId}
                  </div>

                  <span
                    className={`
                      text-xs px-3 py-1 rounded-full
                      ${
                        ticket.status === "open"
                          ? "bg-green-100 text-green-700"
                          : ticket.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-neutral-200 text-neutral-700"
                      }
                    `}
                  >
                    {ticket.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-neutral-600 mt-2">
                  <Info size={14} />
                  {ticket.subject}
                </div>
              </div>

              {/* Messages */}
              <div className="p-5 space-y-3 max-h-[400px] overflow-y-auto">
                {ticket.messages.map((msg, i) => (
                  <MessageBubble
                    key={i}
                    sender={msg.sender}
                    message={msg.message}
                    createdAt={msg.createdAt}
                  />
                ))}
              </div>

              {/* Reply */}
              <div className="p-4 border-t flex items-center gap-2">
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Reply to this ticket..."
                  rows={1}
                  className="
                    flex-1 resize-none px-4 py-2
                    rounded-xl bg-neutral-100
                    focus:ring-2 focus:ring-blue-500
                    outline-none
                  "
                />

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={reply}
                  className="p-3 rounded-full bg-blue-500 text-white"
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
