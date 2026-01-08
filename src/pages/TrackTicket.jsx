import { useState } from "react";
import { getTicket, replyTicket } from "../api/ticketApi";

export default function TrackTicket() {
  const [id, setId] = useState("");
  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState("");

  const load = async () => setTicket(await getTicket(id));

  const reply = async () => {
    const updated = await replyTicket(id, { sender: "user", message });
    setTicket(updated);
    setMessage("");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <input placeholder="Enter Ticket ID" className="input" onChange={e => setId(e.target.value)} />
      <button onClick={load} className="btn-primary mt-2">Track</button>

      {ticket && (
        <div className="mt-6 space-y-3">
          {ticket.messages.map((m, i) => (
            <div key={i} className={`p-3 rounded-xl ${m.sender === "admin" ? "bg-gray-200" : "bg-blue-100"}`}>
              {m.message}
            </div>
          ))}

          <textarea value={message} onChange={e => setMessage(e.target.value)} className="input" />
          <button onClick={reply} className="btn-primary">Reply</button>
        </div>
      )}
    </div>
  );
}
