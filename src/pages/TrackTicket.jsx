import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTicket, replyTicket } from "../api/ticketApi";
import { Search, Send, Ticket, Info, Printer } from "lucide-react";
import MessageBubble from "../components/MessageBubble";
import { Tooltip } from "antd";

/* ---------------------------
   Small debounce hook
---------------------------- */
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

export default function TrackTicket() {
  const [id, setId] = useState("");
  const debouncedId = useDebounce(id);

  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------------------
     Load ticket by ID
  ---------------------------- */
  useEffect(() => {
    if (!debouncedId.trim()) {
      setTicket(null);
      setError("");
      return;
    }

    let active = true;

    const loadTicket = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getTicket(debouncedId.trim());
        if (active) setTicket(data);
      } catch {
        if (active) {
          setTicket(null);
          setError("Ticket not found");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadTicket();

    return () => {
      active = false;
    };
  }, [debouncedId]);

  /* ---------------------------
     Auto refresh ticket
     (stops when closed)
  ---------------------------- */
  useEffect(() => {
    if (!ticket || ticket.status === "closed") return;

    const interval = setInterval(async () => {
      try {
        const fresh = await getTicket(ticket.ticketId);
        setTicket(fresh);
      } catch {
        // silent fail
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [ticket?.ticketId, ticket?.status]);

  /* ---------------------------
     Reply handler
  ---------------------------- */
  const reply = async () => {
    if (!message.trim() || !ticket || ticket.status === "closed") return;

    try {
      const updated = await replyTicket(ticket.ticketId, {
        sender: "user",
        message: message.trim(),
      });

      setTicket(updated);
      setMessage("");
      setError("");
    } catch {
      setError("Unable to send reply. Ticket may be closed.");
    }
  };

const isClosed = ticket?.status === "closed";
const isPending = ticket?.status === "pending";


  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 transition-colors">
      <div className="max-w-2xl mx-auto px-6 pt-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Track Your Ticket
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Enter your ticket ID to view updates
          </p>
        </motion.div>

        {/* Search */}
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Ticket
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              placeholder="XXX-XXX-XXXX"
              value={id}
              onChange={e => setId(e.target.value)}
              className="
                w-full pl-9 pr-4 py-3 rounded-xl
                bg-white dark:bg-neutral-900
                text-neutral-900 dark:text-neutral-100
                border border-neutral-200 dark:border-neutral-800
                focus:ring-2 focus:ring-blue-500
                outline-none
              "
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setId(id)}
            className="
              px-5 py-3 rounded-xl
              bg-neutral-900 dark:bg-neutral-100
              text-white dark:text-neutral-900
            "
          >
             {loading? <Loader2 className="animate-spin-slow" size={18}/>:<Search size={18} />}
          </motion.button>
        </div>

        {loading && (
          <p className="text-sm text-neutral-500">Loading ticket…</p>
        )}

        {error && (
          <p className="text-sm text-red-500 ">{error}</p>
        )}

        {/* Ticket */}
        <AnimatePresence>
          {ticket && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="
                bg-white dark:bg-neutral-900
                rounded-3xl shadow-xl
                border border-neutral-200 dark:border-neutral-800
                overflow-hidden
              "
            >
              {/* Info */}
              <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => window.print()}
                    className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                    title="Print conversation"
                  >
                    <Printer size={18} />
                  </button>

                  <div className="flex items-center gap-2 font-mono text-sm text-neutral-700 dark:text-neutral-300">
                    <Ticket size={16} />
                    {!isClosed? :ticket.ticketId:"" }
                  </div>                  
<Tooltip
  title={
    isClosed
      ? "This ticket is closed and no longer available. Please create a new ticket if you need further assistance."
      : isPending ? "Support will respond soon" :"You're Currently viewing your ticket" 
  }
  placement={isClosed? "right" :"top"} 
   overlayInnerStyle={{
    backgroundColor: "#202124",
    color: "#fff",
    fontSize: "12px",
    borderRadius: "8px",
    padding: "8px 12px",
    maxWidth: 240,
  }}
>
  <span
    className={`
      inline-flex items-center
      text-xs px-3 py-1 rounded-full font-medium
      ${
        ticket.status === "open"
          ? "bg-green-100 text-green-700"
          : ticket.status === "pending"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-neutral-200 text-neutral-700 cursor-not-allowed"
      }
    `}
  >
    {ticket.status}
  </span>
</Tooltip>

                </div>

                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                  <Info size={14} />
                  {ticket.subject}
                </div>
              </div>

              {/* Messages */}
              <div className="p-5 space-y-3 max-h-[400px] overflow-y-auto">
                {(ticket.messages || []).map((msg, i) => (
                  <MessageBubble key={i} {...msg} />
                ))}
              </div>

              {/* Reply */}
              {ticket.status !== "closed" && (
                <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex gap-2">
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Reply to this ticket..."
                    rows={1}
                    className="
                      flex-1 resize-none px-4 py-2 rounded-xl
                      bg-neutral-100 dark:bg-neutral-800
                      text-neutral-900 dark:text-neutral-100
                      focus:ring-2 focus:ring-blue-500
                      outline-none
                    "
                  />

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={reply}
                    disabled={!message.trim()}
                    className="
                      p-3 rounded-full
                      bg-blue-500 text-white
                      disabled:opacity-50
                    "
                  >
                    <Send size={18} />
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
