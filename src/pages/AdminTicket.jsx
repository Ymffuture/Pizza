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

  /* -------------------------------
     Load all tickets
  -------------------------------- */
  useEffect(() => {
    loadAllTickets();
  }, []);

  const loadAllTickets = async () => {
    try {
      setLoadingTickets(true);
      setError(null);

      const data = await getAllTickets();

      // ✅ FIX: backend returns { tickets, pagination }
      setTickets(Array.isArray(data?.tickets) ? data.tickets : []);
    } catch (err) {
      console.error("Failed to load tickets:", err);
      setError("Failed to load tickets.");
    } finally {
      setLoadingTickets(false);
    }
  };

  /* -------------------------------
     Search filter
  -------------------------------- */
  const filteredTickets = useMemo(() => {
    if (!search.trim()) return tickets;

    const q = search.toLowerCase();
    return tickets.filter((t) =>
      [t.ticketId, t.subject, t.email].some((v) =>
        v?.toLowerCase().includes(q)
      )
    );
  }, [tickets, search]);

  /* -------------------------------
     Open ticket
  -------------------------------- */
  const openTicket = async (ticketId) => {
    try {
      setLoadingDetail(true);
      setError(null);

      const data = await getTicket(ticketId);
      setSelectedTicket(data);
      setReplyText("");
    } catch {
      setError("Ticket not found.");
      setSelectedTicket(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  /* -------------------------------
     Reply
  -------------------------------- */
  const handleSendReply = async () => {
    if (!selectedTicket || !replyText.trim()) return;

    try {
      const updated = await replyTicket(selectedTicket.ticketId, {
        sender: "admin",
        message: replyText.trim(),
      });

      // ✅ sync detail
      setSelectedTicket(updated);

      // ✅ sync list (status + lastReplyBy)
      setTickets((prev) =>
        prev.map((t) =>
          t.ticketId === updated.ticketId
            ? { ...t, status: updated.status, lastReplyBy: updated.lastReplyBy }
            : t
        )
      );

      setReplyText("");
    } catch {
      setError("Failed to send reply.");
    }
  };

  /* -------------------------------
     Close ticket
  -------------------------------- */
  const handleCloseTicket = async () => {
    try {
      const updated = await closeTicket(selectedTicket.ticketId);

      // ✅ sync detail
      setSelectedTicket(updated);

      // ✅ sync list
      setTickets((prev) =>
        prev.map((t) =>
          t.ticketId === updated.ticketId
            ? { ...t, status: "closed" }
            : t
        )
      );
    } catch {
      setError("Failed to close ticket.");
    }
  };

  /* -------------------------------
     Stats (fixed)
  -------------------------------- */
  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    pending: tickets.filter((t) => t.status === "pending").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };

  return (
    <div className="min-h-screen mt-16 bg-neutral-100 dark:bg-neutral-950 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* LEFT */}
        <aside className="col-span-12 lg:col-span-4 bg-white dark:bg-neutral-900 rounded-3xl p-5 shadow">
          <h2 className="font-semibold flex items-center gap-2 mb-4">
            <Inbox size={18} /> Support Tickets
          </h2>

          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-3 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
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
                className={`w-full text-left p-3 rounded-xl border ${
                  selectedTicket?.ticketId === t.ticketId
                    ? "bg-blue-50 dark:bg-blue-900/30"
                    : "bg-neutral-50 dark:bg-neutral-800"
                }`}
              >
                <p className="font-mono text-sm">{t.ticketId}</p>
                <p className="text-xs truncate">{t.subject}</p>
              </button>
            ))}
          </div>
        </aside>

        {/* RIGHT */}
        <section className="col-span-12 lg:col-span-8 bg-white dark:bg-neutral-900 rounded-3xl shadow flex flex-col">
          {!selectedTicket ? (
            <div className="flex-1 flex items-center justify-center text-neutral-500">
              Select a ticket
            </div>
          ) : (
            <>
              <div className="p-5 border-b flex justify-between">
                <div>
                  <p className="font-mono">{selectedTicket.ticketId}</p>
                  <p className="text-sm">{selectedTicket.email}</p>
                </div>

                {selectedTicket.status !== "closed" && (
                  <button
                    onClick={handleCloseTicket}
                    className="text-red-500 text-sm"
                  >
                    Close Ticket
                  </button>
                )}
              </div>

              <div className="flex-1 p-5 space-y-4 overflow-y-auto">
                {selectedTicket.messages.map((m, i) => (
                  <MessageBubble key={i} {...m} />
                ))}
              </div>

              {selectedTicket.status !== "closed" && (
                <div className="p-4 border-t flex gap-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 rounded-xl p-3 bg-neutral-100 dark:bg-neutral-800"
                  />
                  <button
                    onClick={handleSendReply}
                    className="bg-blue-600 text-white p-3 rounded-xl"
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
    <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-center">
      <Icon size={16} className="mx-auto mb-1" />
      <p className="text-xs">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
