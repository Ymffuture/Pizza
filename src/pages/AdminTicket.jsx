import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getTicket,
  replyTicket,
  getAllTickets,
  closeTicket,
} from "../api/ticketApi";
import MessageBubble from "../components/MessageBubble";
import {
  Send,
  Ticket,
  Mail,
  Info,
  XCircle,
  Inbox,
  AlertCircle,
  CheckCircle2,
  Search,
} from "lucide-react";

export default function AdminTicket() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [search, setSearch] = useState("");
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState(null);

  // Load all tickets once on mount
  useEffect(() => {
    loadAllTickets();
  }, []);

  const loadAllTickets = async () => {
    try {
      setLoadingTickets(true);
      setError(null);
      const data = await getAllTickets();
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load tickets:", err);
      setError("Failed to load tickets. Please try again.");
    } finally {
      setLoadingTickets(false);
    }
  };

  // Filter tickets with safe access
  const filteredTickets = useMemo(() => {
    if (!search.trim()) return tickets;

    const query = search.toLowerCase();
    return tickets.filter((ticket) => {
      const id = ticket?.ticketId?.toLowerCase() || "";
      const subject = ticket?.subject?.toLowerCase() || "";
      const email = ticket?.email?.toLowerCase() || "";
      return id.includes(query) || subject.includes(query) || email.includes(query);
    });
  }, [tickets, search]);

  const openTicket = async (ticketId) => {
    if (!ticketId) return;

    try {
      setLoadingDetail(true);
      setError(null);
      const data = await getTicket(ticketId);
      setSelectedTicket(data);
      setReplyText("");
    } catch (err) {
      console.error("Failed to load ticket:", err);
      setError("Ticket not found or failed to load");
      setSelectedTicket(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyText.trim()) return;

    try {
      const updatedTicket = await replyTicket(selectedTicket.ticketId, {
        sender: "admin",
        message: replyText.trim(),
      });

      // Update both selected ticket and list
      setSelectedTicket(updatedTicket);
      setTickets((prev) =>
        prev.map((t) => (t.ticketId === updatedTicket.ticketId ? updatedTicket : t))
      );
      setReplyText("");
    } catch (err) {
      console.error("Failed to send reply:", err);
      setError("Failed to send reply. Please try again.");
    }
  };

  const handleCloseTicket = async () => {
    if (!selectedTicket) return;

    try {
      const updated = await closeTicket(selectedTicket.ticketId);
      setSelectedTicket(updated);
      setTickets((prev) =>
        prev.map((t) => (t.ticketId === updated.ticketId ? updated : t))
      );
    } catch (err) {
      console.error("Failed to close ticket:", err);
      setError("Failed to close ticket");
    }
  };

  // Quick stats with safe access
  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t?.status === "open").length,
    pending: tickets.filter((t) => t?.lastReplyBy === "user").length,
    closed: tickets.filter((t) => t?.status === "closed").length,
  };

  return (
    <div className="min-h-screen mt-16 bg-neutral-100 dark:bg-neutral-950 p-6 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* LEFT SIDEBAR - Ticket List */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-12 lg:col-span-4 bg-white dark:bg-neutral-900 rounded-3xl shadow-xl p-5"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Inbox size={18} /> Support Tickets
          </h2>

          {/* Search */}
          <div className="relative mb-5">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ticket ID, subject, email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-sm"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Stat icon={Ticket} label="Total" value={stats.total} />
            <Stat icon={AlertCircle} label="Needs Reply" value={stats.pending} />
            <Stat icon={CheckCircle2} label="Open" value={stats.open} />
            <Stat icon={XCircle} label="Closed" value={stats.closed} />
          </div>

          {/* Ticket list */}
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {loadingTickets ? (
              <div className="text-center py-8 text-neutral-500">Loading tickets...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">No tickets found</div>
            ) : (
              filteredTickets.map((t) => {
                const isPending = t?.lastReplyBy === "user";
                const isSelected = selectedTicket?.ticketId === t.ticketId;

                return (
                  <button
                    key={t.ticketId}
                    onClick={() => openTicket(t.ticketId)}
                    className={`
                      w-full text-left p-3.5 rounded-xl transition-all duration-200
                      ${isSelected 
                        ? "bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800" 
                        : isPending 
                          ? "bg-yellow-50 dark:bg-yellow-900/20" 
                          : "bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800"}
                      border border-transparent
                    `}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-sm font-medium">{t.ticketId}</span>
                      {isPending && (
                        <span className="text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 rounded-full">
                          Needs reply
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                      {t.subject || "No subject"}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </motion.aside>

        {/* RIGHT PANEL - Ticket Detail */}
        <AnimatePresence mode="wait">
          <motion.section
            key={selectedTicket?.ticketId || "empty"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="col-span-12 lg:col-span-8 bg-white dark:bg-neutral-900 rounded-3xl shadow-xl flex flex-col min-h-[70vh] overflow-hidden"
          >
            {!selectedTicket ? (
              <div className="flex-1 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                <div className="text-center">
                  <Inbox size={48} className="mx-auto mb-4 opacity-40" />
                  <p className="text-lg">Select a ticket to view details</p>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-6 border-b dark:border-neutral-800 flex justify-between items-start gap-4">
                  <div>
                    <p className="font-mono text-sm font-medium">{selectedTicket.ticketId}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      {selectedTicket.email}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {selectedTicket.subject || "No subject"}
                    </p>
                  </div>

                  {selectedTicket.status !== "closed" && (
                    <button
                      onClick={handleCloseTicket}
                      className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      Close Ticket
                    </button>
                  )}
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-neutral-50/50 dark:bg-neutral-950/30">
                  {loadingDetail ? (
                    <div className="text-center py-12 text-neutral-500">Loading messages...</div>
                  ) : !Array.isArray(selectedTicket.messages) || selectedTicket.messages.length === 0 ? (
                    <div className="text-center py-12 text-neutral-500">
                      No messages yet
                    </div>
                  ) : (
                    selectedTicket.messages.map((msg, index) => (
                      <MessageBubble
                        key={msg._id || index}
                        sender={msg.sender}
                        message={msg.message || ""}
                        createdAt={msg.createdAt}
                      />
                    ))
                  )}
                </div>

                {/* Reply Input */}
                {selectedTicket.status !== "closed" && (
                  <div className="p-5 border-t dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <div className="flex gap-3">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply here..."
                        className="flex-1 resize-none px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 min-h-[76px]"
                        rows={2}
                      />
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendReply}
                        disabled={!replyText.trim()}
                        className="p-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end"
                      >
                        <Send size={20} />
                      </motion.button>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.section>
        </AnimatePresence>
      </div>

      {/* Global error message */}
      {error && (
        <div className="fixed bottom-6 right-6 bg-red-600/10 text-white px-6 py-3 rounded-xl shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-neutral-100 dark:bg-neutral-800 p-4 text-center">
      <div className="flex items-center justify-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-1">
        <Icon size={20} />
        {label}
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
