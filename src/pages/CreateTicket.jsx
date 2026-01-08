import { useState } from "react";
import { createTicket } from "../api/ticketApi";

export default function CreateTicket() {
  const [data, setData] = useState({});
  const [ticket, setTicket] = useState(null);

  const submit = async () => {
    const res = await createTicket(data);
    setTicket(res);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Create Ticket</h1>

        <input placeholder="Email" className="input" onChange={e => setData({ ...data, email: e.target.value })} />
        <input placeholder="Subject" className="input" onChange={e => setData({ ...data, subject: e.target.value })} />
        <textarea placeholder="Message" className="input" onChange={e => setData({ ...data, message: e.target.value })} />

        <button onClick={submit} className="btn-primary mt-4">Submit</button>

        {ticket && (
          <p className="mt-4 text-sm text-gray-600">
            Your Ticket ID: <strong>{ticket.ticketId}</strong>
          </p>
        )}
      </div>
    </div>
  );
}
