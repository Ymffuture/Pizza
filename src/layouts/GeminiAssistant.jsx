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

  /* =============================
     DO NOT TOUCH – loader kept
     ============================= */
  const Loader = () => (
    <div className="flex items-center justify-center">
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

  /* =============================
     Scroll behavior
     ============================= */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* =============================
     Lock body scroll
     ============================= */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, [open]);

  /* =============================
     Send message
     ============================= */
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
        { sender: "ai", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Bot Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-black dark:bg-white text-white dark:text-black shadow-xl hover:scale-110 transition"
        >
          <BotIcon size={22} />
        </button>
      )}

      {/* Fullscreen ChatGPT-style modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-black flex flex-col h-20">
          
          {/* HEADER */}
          <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <BotIcon size={20} />
              <span className="font-semibold">SwiftMeta AI</span>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X size={18} />
            </button>
          </header>

          {/* CHAT BODY */}
          <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
            {messages.length === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {[
                  "Explain React hooks",
                  "Generate a startup idea",
                  "Write a Python function",
                  "How to learn AI fast",
                ].map((p, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setMsg(p);
                      setTimeout(sendMessage, 200);
                    }}
                    className="border rounded-xl px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-900"
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
                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm ${
                    m.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-900"
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
                            PreTag="div"
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-gray-300 dark:bg-gray-700 px-1 rounded">
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
                <span className="text-sm text-gray-500">Thinking…</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </main>

          {/* INPUT BAR */}
          <footer className="border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex gap-2">
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Message SwiftMeta AI…"
              rows={1}
              className="flex-1 resize-none rounded-xl border px-3 py-2 focus:outline-none dark:bg-black"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="p-3 rounded-xl bg-black dark:bg-white text-white dark:text-black"
            >
              <Send size={18} />
            </button>
          </footer>
        </div>
      )}
    </>
  );
}
