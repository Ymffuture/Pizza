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
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [search, setSearch] = useState("");
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState(null);

  /* -------------------------
     Load tickets
  ------------------------- */
  useEffect(() => {
    loadAllTickets();
  }, []);

  const loadAllTickets = async () => {
    try {
      setLoadingTickets(true);
      setError(null);

      const res = await getAllTickets();

      // ✅ FIX: normalize backend response
      setTickets(Array.isArray(res?.tickets) ? res.tickets : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load tickets");
    } finally {
      setLoadingTickets(false);
    }
  };

  /* -------------------------
     Search filter
  ------------------------- */
  const filteredTickets = useMemo(() => {
    if (!search.trim()) return tickets;

    const q = search.toLowerCase();
    return tickets.filter(
      (t) =>
        t.ticketId?.toLowerCase().includes(q) ||
        t.subject?.toLowerCase().includes(q) ||
        t.email?.toLowerCase().includes(q)
    );
  }, [tickets, search]);

  /* -------------------------
     Open ticket
  ------------------------- */
  const openTicket = async (ticketId) => {
    try {
      setLoadingDetail(true);
      const data = await getTicket(ticketId);
      setSelectedTicket(data);
      setReplyText("");
    } catch {
      setError("Failed to load ticket");
    } finally {
      setLoadingDetail(false);
    }
  };

  /* -------------------------
     Reply (ADMIN)
  ------------------------- */
  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;

    try {
      const updated = await replyTicket(selectedTicket.ticketId, {
        sender: "admin",
        message: replyText.trim(),
      });

      // ✅ FORCE status back to open (UI truth)
      updated.status = "open";
      updated.lastReplyBy = "admin";

      setSelectedTicket(updated);
      setTickets((prev) =>
        prev.map((t) =>
          t.ticketId === updated.ticketId ? updated : t
        )
      );

      setReplyText("");
    } catch {
      setError("Reply failed");
    }
  };

  /* -------------------------
     Close ticket
  ------------------------- */
  const handleCloseTicket = async () => {
    try {
      const updated = await closeTicket(selectedTicket.ticketId);

      setSelectedTicket(updated);
      setTickets((prev) =>
        prev.map((t) =>
          t.ticketId === updated.ticketId ? updated : t
        )
      );
    } catch {
      setError("Failed to close ticket");
    }
  };

  /* -------------------------
     Stats (status-driven)
  ------------------------- */
  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    pending: tickets.filter((t) => t.status === "pending").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };

  return (
    <div className="min-h-screen mt-16 p-6 bg-neutral-100 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">

        {/* SIDEBAR */}
        <aside className="col-span-12 lg:col-span-4 bg-white dark:bg-neutral-900 rounded-3xl p-5 shadow-xl">
          <h2 className="flex items-center gap-2 mb-4 font-semibold">
            <Inbox size={18} /> Tickets
          </h2>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800"
              placeholder="Search..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <Stat icon={Ticket} label="Total" value={stats.total} />
            <Stat icon={AlertCircle} label="Pending" value={stats.pending} />
            <Stat icon={CheckCircle2} label="Open" value={stats.open} />
            <Stat icon={XCircle} label="Closed" value={stats.closed} />
          </div>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filteredTickets.map((t) => (
              <button
                key={t.ticketId}
                onClick={() => openTicket(t.ticketId)}
                className={`w-full text-left p-3 rounded-xl border transition
                  ${selectedTicket?.ticketId === t.ticketId
                    ? "bg-blue-50 border-blue-300"
                    : "bg-neutral-50 hover:bg-neutral-100"}
                `}
              >
                <div className="flex justify-between">
                  <span className="font-mono text-sm">{t.ticketId}</span>
                  {t.status === "pending" && (
                    <span className="text-xs bg-yellow-200 px-2 rounded-full">
                      Needs reply
                    </span>
                  )}
                </div>
                <p className="text-xs truncate">{t.subject}</p>
              </button>
            ))}
          </div>
        </aside>

        {/* DETAIL */}
        <section className="col-span-12 lg:col-span-8 bg-white dark:bg-neutral-900 rounded-3xl shadow-xl flex flex-col">
          {!selectedTicket ? (
            <div className="flex-1 flex items-center justify-center opacity-60">
              Select a ticket
            </div>
          ) : (
            <>
              <div className="p-6 border-b flex justify-between">
                <div>
                  <p className="font-mono">{selectedTicket.ticketId}</p>
                  <p className="text-xs">{selectedTicket.email}</p>
                </div>
                {selectedTicket.status !== "closed" && (
                  <button
                    onClick={handleCloseTicket}
                    className="text-red-500"
                  >
                    Close Ticket
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedTicket.messages.map((m, i) => (
                  <MessageBubble key={i} {...m} />
                ))}
              </div>

              {selectedTicket.status !== "closed" && (
                <div className="p-4 border-t flex gap-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 rounded-xl p-3 bg-neutral-100"
                    placeholder="Reply..."
                  />
                  <button
                    onClick={handleSendReply}
                    className="bg-blue-600 text-white p-4 rounded-xl"
                  >
                    <Send size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-xl text-center">
      <Icon size={16} className="mx-auto mb-1" />
      <p className="text-xs">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}
