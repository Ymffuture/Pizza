import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MessageCircle, Send, X, BotIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "react-hot-toast";

const GeminiAssistant = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  /* ---------------- LOADER (UNCHANGED) ---------------- */
  const Loader = () => (
    <div className="flex flex-col items-center justify-center bg-transparent">
      <svg
        width="30"
        height="30"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-spin text-gray-300 dark:text-gray-700"
      >
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="250"
          strokeDashoffset="190"
        />
        <circle cx="50" cy="50" r="10" fill="#00E5FF">
          <animate attributeName="r" values="10;14;10" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.6;1" dur="1.6s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, loading]);

  /* ---------------- NETWORK STRENGTH (UNCHANGED LOGIC) ---------------- */
  const useConnectionStrength = () => {
    const [strength, setStrength] = useState("Checking...");

    useEffect(() => {
      const conn =
        navigator.connection ||
        navigator.webkitConnection ||
        navigator.mozConnection;

      if (!conn) {
        setStrength("Unknown");
        return;
      }

      const evaluate = () => {
        const speed = conn.downlink;
        const type = conn.effectiveType;

        let level = "Good";
        if (speed < 1 || type === "2g" || type === "slow-2g") level = "Poor";
        else if (speed < 3 || type === "3g") level = "Average";

        setStrength(level);

        if (level === "Good") {
          toast((t) => (
            <span className="flex items-center gap-2 text-[10px]">
              NETWORK: <b className="text-green-500">Connected</b>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="ml-2 px-2 py-1 bg-white text-black rounded text-xs"
              >
                Close
              </button>
            </span>
          ), { style: { background: "#000", color: "#fff" } });
        }
      };

      evaluate();
      conn.addEventListener("change", evaluate);
      return () => conn.removeEventListener("change", evaluate);
    }, []);

    return strength;
  };

  const connectionStrength = useConnectionStrength();

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = async () => {
    if (!msg.trim()) return;

    const userMsg = { sender: "user", text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://swiftmeta.onrender.com/api/gemini",
        { prompt: msg }
      );

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: res.data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Oops! Something went wrong." },
      ]);
    }

    setLoading(false);
  };

  /* ---------------- UI ---------------- */
  return (
    <>
      {/* Floating Bot Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-xl hover:scale-110 transition"
        >
          <BotIcon size={22} />
        </button>
      )}

      {/* FULLSCREEN MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex flex-col">
          
          {/* HEADER */}
          <div className="flex items-center justify-between px-5 py-4 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
            <div>
              <p className="text-sm text-blue-500 font-semibold">
                SwiftMeta AI
              </p>
              <p
                className={`text-xs font-medium ${
                  connectionStrength === "Good"
                    ? "text-green-500"
                    : connectionStrength === "Average"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                Connection: {connectionStrength}
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X size={18} />
            </button>
          </div>

          {/* CHAT BODY */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-50 dark:bg-black">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow ${
                    m.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-900 border dark:border-gray-800"
                  }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="prose prose-sm dark:prose-invert max-w-none"
                    components={{
                      code({ inline, className, children }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={coldarkCold}
                            language={match[1]}
                            customStyle={{
                              borderRadius: "10px",
                              padding: "16px",
                              fontSize: "0.85rem",
                            }}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {m.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2">
                <Loader />
                <span className="text-sm text-gray-500 animate-pulse">
                  Thinking…
                </span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* INPUT */}
          <div className="px-4 py-3 bg-white dark:bg-gray-900 border-t dark:border-gray-800 flex gap-2">
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Ask anything…"
              rows={2}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())
              }
              className="flex-1 resize-none rounded-xl px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 focus:outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:opacity-50"
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
