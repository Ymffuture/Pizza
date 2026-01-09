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
  const [ticket, setTicket] = useState(null);
  const [reply, setReply] = useState("");
  const [search, setSearch] = useState("");
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [loadingTicket, setLoadingTicket] = useState(false);

  /* -----------------------------
     Load all tickets on mount
  ----------------------------- */
  useEffect(() => {
    (async () => {
      try {
        const data = await getAllTickets();
        setTickets(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTickets(false);
      }
    })();
  }, []);

  /* -----------------------------
     Filter tickets by search
  ----------------------------- */
  const filteredTickets = useMemo(() => {
    if (!search.trim()) return tickets;

    const q = search.toLowerCase();
    return tickets.filter(
      t =>
        t.ticketId.toLowerCase().includes(q) ||
        t.subject?.toLowerCase().includes(q) ||
        t.email?.toLowerCase().includes(q)
    );
  }, [tickets, search]);

  /* -----------------------------
     Open ticket by ID
  ----------------------------- */
  const openTicket = async id => {
    try {
      setLoadingTicket(true);
      const data = await getTicket(id);
      setTicket(data);
    } catch {
      alert("Ticket not found");
      setTicket(null);
    } finally {
      setLoadingTicket(false);
    }
  };

  /* -----------------------------
     Send admin reply
  ----------------------------- */
  const sendReply = async () => {
    if (!reply.trim()) return;

    const updated = await replyTicket(ticket.ticketId, {
      sender: "admin",
      message: reply,
    });

    setTicket(updated);
    setTickets(t =>
      t.map(x => (x.ticketId === updated.ticketId ? updated : x))
    );
    setReply("");
  };

  /* -----------------------------
     Close ticket
  ----------------------------- */
  const closeCurrentTicket = async () => {
    const updated = await closeTicket(ticket.ticketId);
    setTicket(updated);
    setTickets(t =>
      t.map(x => (x.ticketId === updated.ticketId ? updated : x))
    );
  };

  /* -----------------------------
     Ticket stats
  ----------------------------- */
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    pending: tickets.filter(t => t.lastReplyBy === "user").length,
    closed: tickets.filter(t => t.status === "closed").length,
  };

  return (
    <div className="min-h-screen mt-16 bg-neutral-100 dark:bg-neutral-950 p-6 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">

        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-12 lg:col-span-4 bg-white dark:bg-neutral-900 rounded-3xl shadow-xl p-5"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Inbox size={18} /> Tickets
          </h2>

          {/* Search */}
          <div className="relative mb-4">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
            />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by ticket ID, subject, email"
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 outline-none text-sm"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Stat icon={Ticket} label="Total" value={stats.total} />
            <Stat icon={AlertCircle} label="Needs reply" value={stats.pending} />
            <Stat icon={CheckCircle2} label="Open" value={stats.open} />
            <Stat icon={XCircle} label="Closed" value={stats.closed} />
          </div>

          {/* Ticket list */}
          <div className="space-y-2 max-h-[55vh] overflow-y-auto">
            {loadingTickets ? (
              <p className="text-center text-neutral-500 mt-4">Loading tickets…</p>
            ) : filteredTickets.length === 0 ? (
              <p className="text-center text-neutral-500 mt-4">No tickets found</p>
            ) : (
              filteredTickets.map(t => {
                const needsReply = t.lastReplyBy === "user";

                return (
                  <button
                    key={t.ticketId}
                    onClick={() => openTicket(t.ticketId)}
                    className={`
                      w-full text-left p-3 rounded-xl transition
                      ${needsReply ? "bg-yellow-50 dark:bg-yellow-900/20" : "bg-neutral-100 dark:bg-neutral-800"}
                      hover:ring-2 hover:ring-blue-500
                    `}
                  >
                    <div className="flex justify-between text-sm font-mono">
                      {t.ticketId}
                      {needsReply && <span className="text-xs text-yellow-600">needs reply</span>}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{t.subject}</p>
                  </button>
                );
              })
            )}
          </div>
        </motion.aside>

        {/* Ticket view */}
        <AnimatePresence>
          {ticket && (
            <motion.section
              key={ticket.ticketId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="col-span-12 lg:col-span-8 bg-white dark:bg-neutral-900 rounded-3xl shadow-xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b dark:border-neutral-800 flex justify-between">
                <div>
                  <p className="font-mono text-sm">{ticket.ticketId}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{ticket.email}</p>
                </div>

                {ticket.status !== "closed" && (
                  <button
                    onClick={closeCurrentTicket}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Close ticket
                  </button>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {loadingTicket ? (
                  <p className="text-center text-neutral-500 mt-4">Loading ticket…</p>
                ) : (
                  ticket.messages.map((m, i) => (
                    <MessageBubble key={i} sender={m.sender} message={m.message} createdAt={m.createdAt} />
                  ))
                )}
              </div>

              {/* Reply */}
              {ticket.status !== "closed" && (
                <div className="p-4 border-t dark:border-neutral-800 flex gap-2">
                  <textarea
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    placeholder="Admin reply…"
                    className="flex-1 resize-none px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 outline-none"
                    rows={1}
                  />

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={sendReply}
                    className="p-3 rounded-full bg-blue-600 text-white"
                  >
                    <Send size={18} />
                  </motion.button>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ----------------------------------
   Small stat card
----------------------------------- */
function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-neutral-100 dark:bg-neutral-800 p-3">
      <div className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
        <Icon size={14} />
        {label}
      </div>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
