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

  // -------------------------

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
      const speed = conn.downlink; // Mbps
      const type = conn.effectiveType; // 4g, 3g, etc.

      let level = "Good";

      if (speed < 1 || type === "2g" || type === "slow-2g") level = "Poor";
      else if (speed < 3 || type === "3g") level = "Average";

      setStrength(level);

      if (level === "Poor") {
        toast((t) => (
  <span className="flex items-center justify-between gap-2 text-[10px]">
    <span>
      NETWORK: <b className="text-red-600" >Your connection is weak. AI responses may be slow.</b>
    </span>

    <button
      onClick={() => toast.dismiss(t.id)}
      className="px-2 py-1 text-xs rounded bg-white text-black font-medium"
    >
      Close
    </button>
  </span>
), {
  style: { background: "#000", color: "#fff", padding: "10px 14px" },
});

      }
      if (level === "Good") {
        toast((t) => (
  <span className="flex items-center justify-between gap-2 text-[10px]">
    <span>
      NETWORK: <b className="text-green-600" >Connected</b>
    </span>

    <button
      onClick={() => toast.dismiss(t.id)}
      className="px-2 py-1 text-xs rounded bg-white text-black font-medium"
    >
      Close
    </button>
  </span>
), {
  style: { background: "#000", color: "#fff", padding: "10px 14px" },
});

      }
    };

    evaluate();
    conn.addEventListener("change", evaluate);

    return () => conn.removeEventListener("change", evaluate);
  }, []);

  return strength;
};

 const connectionStrength = useConnectionStrength();
  
  
  // Loader (UNCHANGED)
  // -------------------------
  const Loader = () => (
    <div className="flex items-center justify-center">
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

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, loading]);

  // -------------------------
  // Send message
  // -------------------------
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
      setMessages((p) => [...p, { sender: "ai", text: "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Floating button
  // -------------------------
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-black text-white shadow-xl hover:scale-110 transition"
      >
        <BotIcon size={22} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-black flex flex-col">
      
      {/* HEADER (ChatGPT style) */}
      <header className="flex items-center justify-between px-5 py-3
  backdrop-blur-xl bg-white/80 dark:bg-gray-900/70
  border-b border-gray-200/70 dark:border-gray-800
  sticky top-0 z-20"
>
  {/* Left: Bot Identity */}
  <div className="flex items-center gap-3">
    <div className="flex items-center justify-center w-9 h-9 rounded-full
      bg-sky-500/10 text-sky-500">
      <BotIcon size={20} />
    </div>

    <div className="leading-tight">
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        SwiftMeta
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        AI Assistant
      </p>
    </div>
  </div>

  {/* Right: Connection + Close */}
  <div className="flex items-center gap-3">
    {/* Connection Badge */}
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border
        ${
          connectionStrength === "Good"
            ? "bg-green-500/10 text-green-600 border-green-500/20"
            : connectionStrength === "Average"
            ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
            : "bg-red-500/10 text-red-600 border-red-500/20"
        }`}
    >
      {connectionStrength}
    </span>

    {/* Close Button */}
    <button
      onClick={() => setOpen(false)}
      className="p-2 rounded-full
        hover:bg-gray-100 dark:hover:bg-gray-800
        transition-colors"
    >
      <X size={18} className="text-gray-600 dark:text-gray-300" />
    </button>
  </div>
</header>


      {/* MESSAGES */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="grid sm:grid-cols-2 gap-3 mt-10">
            {[
              "Explain React hooks",
              "Generate a website idea 💡 for business",
              "Write a nestjs snippet ",
              "Tips for learning AI",
            ].map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  setMsg(p);
                  setTimeout(sendMessage, 200);
                }}
                className="border-gray-100 shadow-2xl rounded-xl p-4 text-sm hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[100%] rounded-2xl px-4 py-3 text-sm shadow
                ${
                  m.sender === "user"
                    ? "bg-[#87CEEB] text-white dark:bg-blue-300"
                    : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                }
              `}
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
                        PreTag="div"
                      >
                        {String(children)}
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
          <div className="flex justify-start gap-2 items-center">
            <Loader />
            <span className="text-sm text-gray-500"></span>
          </div>
        )}

        <div ref={chatEndRef} />
      </main>

      {/* INPUT (sticky) */}
      <footer className="bg-gray-200 dark:bg-gray-800 p-4 flex gap-2 dark:text-white ">
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Ask anything"
          rows={1}
          className="flex-1 resize-none rounded-xl px-4 py-2 bg-transparent focus:outline-none dark:text-white "
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="p-3 rounded-xl bg-black text-white disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </footer>
    </div>
  );
};

export default GeminiAssistant;
