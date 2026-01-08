import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTicket, replyTicket } from "../api/ticketApi";
import MessageBubble from "../components/MessageBubble";
import { Send, Ticket, Mail, Info } from "lucide-react";

export default function AdminTicket() {
  const [ticketId, setTicketId] = useState("");
  const [ticket, setTicket] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTicket = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getTicket(ticketId);
      setTicket(data);
    } catch {
      setError("Ticket not found");
      setTicket(null);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  const sendReply = async () => {
    if (!reply.trim()) return;

    const updated = await replyTicket(ticketId, {
      sender: "admin",
      message: reply,
    });

    setTicket(updated);
    setReply("");
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b">
          <h1 className="text-xl font-semibold">Admin Ticket Panel</h1>
          <p className="text-sm text-neutral-500">
            Search and reply to tickets by ID
          </p>
        </div>

        {/* Search */}
        <div className="p-6 flex gap-2">
          <input
            placeholder="TCK-XXXXXX"
            value={ticketId}
            onChange={e => setTicketId(e.target.value)}
            className="
              flex-1 px-4 py-2
              rounded-xl bg-neutral-100
              focus:ring-2 focus:ring-blue-500
              outline-none
            "
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={fetchTicket}
            className="px-5 py-2 rounded-xl bg-black text-white"
          >
            {loading ? "Loading..." : "Search"}
          </motion.button>
        </div>

        {error && (
          <p className="px-6 text-sm text-red-500">{error}</p>
        )}

        {/* Ticket Info */}
        <AnimatePresence>
          {ticket && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="px-6 pb-4"
            >
              <div className="bg-neutral-100 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-sm">
                    <Ticket size={16} />
                    {ticket.ticketId}
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      ticket.status === "open"
                        ? "bg-green-100 text-green-700"
                        : ticket.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-neutral-300 text-neutral-700"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Mail size={14} />
                  {ticket.email}
                </div>

                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Info size={14} />
                  {ticket.subject}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        {ticket && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex-1 overflow-y-auto px-6 space-y-3 pb-4"
            >
              {ticket.messages.map((msg, i) => (
                <MessageBubble
                  key={i}
                  sender={msg.sender}
                  message={msg.message}
                  createdAt={msg.createdAt}
                />
              ))}
            </motion.div>

            {/* Reply */}
            <div className="p-4 border-t flex items-center gap-2">
              <textarea
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Type admin reply..."
                className="
                  flex-1 resize-none px-4 py-2
                  rounded-xl bg-neutral-100
                  focus:ring-2 focus:ring-blue-500
                  outline-none
                "
                rows={1}
              />

              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={sendReply}
                className="p-3 rounded-full bg-blue-500 text-white"
              >
                <Send size={18} />
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
