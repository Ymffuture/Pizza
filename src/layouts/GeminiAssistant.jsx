import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { BotIcon, Send, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "react-hot-toast";

export default function GeminiAssistant() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  /* ---------------- LOADER (UNCHANGED) ---------------- */
  const Loader = () => (
    <div className="flex items-center">
      <svg
        width="30"
        height="30"
        viewBox="0 0 100 100"
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

  const scrollToBottom = () =>
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages, loading]);

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = async () => {
    if (!msg.trim()) return;

    const userMsg = { sender: "user", text: msg };
    setMessages((p) => [...p, userMsg]);
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://swiftmeta.onrender.com/api/gemini",
        { prompt: userMsg.text }
      );
      setMessages((p) => [...p, { sender: "ai", text: res.data.reply }]);
    } catch {
      setMessages((p) => [
        ...p,
        { sender: "ai", text: "Oops! Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black shadow-xl flex items-center justify-center hover:scale-105 transition"
        >
          <BotIcon size={22} />
        </button>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="relative w-full sm:w-[420px] md:w-[460px] h-full bg-white dark:bg-gray-900 flex flex-col shadow-xl">
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <div>
                <p className="text-xs text-blue-500 font-semibold">
                  SwiftMeta AI
                </p>
                <p className="text-[11px] text-gray-500">Ask anything</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.length === 0 && (
                <div className="grid grid-cols-1 gap-3">
                  {[
                    "Explain React hooks",
                    "Generate a website idea",
                    "Write a Python snippet",
                    "Tips for learning AI",
                  ].map((p, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setMsg(p);
                        setTimeout(sendMessage, 200);
                      }}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-left"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                      m.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      className="prose prose-sm max-w-none dark:prose-invert"
                      components={{
                        code({ inline, className, children }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={coldarkCold}
                              language={match[1]}
                              customStyle={{ borderRadius: 10 }}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
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
                <div className="flex gap-2 items-center">
                  <Loader />
                  <span className="text-xs text-gray-500 animate-pulse">
                    Thinking…
                  </span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 dark:border-gray-800 p-3 flex gap-2">
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  (e.preventDefault(), sendMessage())
                }
                placeholder="Ask anything…"
                rows={1}
                className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
