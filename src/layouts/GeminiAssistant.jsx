import React, { useState } from "react";
import axios from "axios";
import { MessageCircle, Send, X } from "lucide-react";

const GeminiAssistant = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!msg.trim()) return;

    const userMsg = { sender: "user", text: msg };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);
    setMsg("");

    try {
      const res = await axios.post("http://localhost:5000/api/gemini", {
        prompt: msg,
      });

      const aiMsg = { sender: "ai", text: res.data.reply };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
          onClick={() => setOpen(true)}
        >
          <MessageCircle />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 w-80 bg-white dark:bg-black shadow-xl rounded-xl border p-4 flex flex-col h-96">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-blue-600">SwiftMeta Assistant</h3>
            <button onClick={() => setOpen(false)}>
              <X />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[80%] ${
                  m.sender === "user"
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                }`}
              >
                {m.text}
              </div>
            ))}

            {loading && <p className="text-sm text-gray-400">Thinking...</p>}
          </div>

          <div className="flex gap-2 mt-3">
            <input
              className="flex-1 border rounded-lg p-2 dark:bg-gray-800 dark:text-white"
              placeholder="Ask me anything..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiAssistant;
