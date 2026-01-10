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
  Inbox,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Search,
} from "lucide-react";

export default function AdminTicket() {
  const [tickets, setTickets] = useState([]);
  const [ticket, setTicket] = useState(null);
  const [reply, setReply] = useState("");
  const [search, setSearch] = useState("");
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [closing, setClosing] = useState(false);

  /* -----------------------------
     Load tickets
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
     Search filter
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
     Open ticket
  ----------------------------- */
  const openTicket = async id => {
    try {
      setLoadingTicket(true);
      const data = await getTicket(id);
      setTicket(data);
    } catch {
      alert("Ticket not found");
    } finally {
      setLoadingTicket(false);
    }
  };

  /* -----------------------------
     Reply
  ----------------------------- */
  const sendReply = async () => {
    if (!reply.trim() || ticket.status === "closed") return;

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
     Close ticket (FIXED)
  ----------------------------- */
  const closeCurrentTicket = async () => {
    try {
      setClosing(true);
      const updated = await closeTicket(ticket.ticketId);
      setTicket(updated);
      setTickets(t =>
        t.map(x => (x.ticketId === updated.ticketId ? updated : x))
      );
    } finally {
      setClosing(false);
    }
  };

  /* -----------------------------
     Stats (FIXED)
  ----------------------------- */
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    closed: tickets.filter(t => t.status === "closed").length,
    pending: tickets.filter(
      t => t.status !== "closed" && t.lastReplyBy === "user"
    ).length,
  };

  return (
    <div className="min-h-screen mt-16 bg-neutral-100 dark:bg-neutral-950 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">

        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-4 bg-white dark:bg-neutral-900 rounded-3xl p-5 shadow-xl">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Inbox size={18} /> Tickets
          </h2>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tickets"
              className="w-full pl-9 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <Stat icon={Ticket} label="Total" value={stats.total} />
            <Stat icon={AlertCircle} label="Needs reply" value={stats.pending} />
            <Stat icon={CheckCircle2} label="Open" value={stats.open} />
            <Stat icon={XCircle} label="Closed" value={stats.closed} />
          </div>

          <div className="space-y-2 max-h-[55vh] overflow-y-auto">
            {loadingTickets ? (
              <p className="text-center text-sm">Loading…</p>
            ) : (
              filteredTickets.map(t => {
                const needsReply =
                  t.status !== "closed" && t.lastReplyBy === "user";

                return (
                  <button
                    key={t.ticketId}
                    onClick={() => openTicket(t.ticketId)}
                    className={`
                      w-full p-3 rounded-xl text-left
                      ${
                        t.status === "closed"
                          ? "opacity-50 bg-neutral-200 dark:bg-neutral-800"
                          : needsReply
                          ? "bg-yellow-50 dark:bg-yellow-900/20"
                          : "bg-neutral-100 dark:bg-neutral-800"
                      }
                    `}
                  >
                    <div className="flex justify-between font-mono text-sm">
                      {t.ticketId}
                      {needsReply && <span className="text-xs text-yellow-600">needs reply</span>}
                    </div>
                    <p className="text-xs truncate">{t.subject}</p>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Ticket View */}
        <AnimatePresence>
          {ticket && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-12 lg:col-span-8 bg-white dark:bg-neutral-900 rounded-3xl shadow-xl flex flex-col"
            >
              <div className="p-6 border-b flex justify-between">
                <div>
                  <p className="font-mono text-sm">{ticket.ticketId}</p>
                  <p className="text-xs text-neutral-500">{ticket.email}</p>
                </div>

                {ticket.status !== "closed" && (
                  <button
                    onClick={closeCurrentTicket}
                    disabled={closing}
                    className="text-sm text-red-600 disabled:opacity-50"
                  >
                    {closing ? "Closing…" : "Close ticket"}
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {ticket.messages.map((m, i) => (
                  <MessageBubble key={i} {...m} />
                ))}
              </div>

              {ticket.status !== "closed" && (
                <div className="p-4 border-t flex gap-2">
                  <textarea
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    placeholder="Admin reply…"
                    className="flex-1 rounded-xl px-4 py-2 bg-neutral-100 dark:bg-neutral-800"
                  />
                  <button
                    onClick={sendReply}
                    className="p-3 bg-blue-600 rounded-full text-white"
                  >
                    <Send size={18} />
                  </button>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-3">
      <div className="flex items-center gap-2 text-sm">
        <Icon size={14} /> {label}
      </div>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
