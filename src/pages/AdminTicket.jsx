import { useState, useCallback } from "react";
import { getTicket, replyTicket } from "../api/ticketApi";
import MessageBubble from "../components/MessageBubble";
import { Send } from "lucide-react";

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
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl flex flex-col">
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
            className="flex-1 px-4 py-2 rounded-xl bg-neutral-100 focus:outline-none"
          />
          <button
            onClick={fetchTicket}
            className="px-5 py-2 rounded-xl bg-black text-white"
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>

        {error && (
          <p className="px-6 text-sm text-red-500">{error}</p>
        )}

        {/* Messages */}
        {ticket && (
          <>
            <div className="flex-1 overflow-y-auto px-6 space-y-3">
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
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Type admin reply..."
                className="flex-1 resize-none px-4 py-2 rounded-xl bg-neutral-100 focus:outline-none"
                rows={1}
              />

              <button
                onClick={sendReply}
                className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                <Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
