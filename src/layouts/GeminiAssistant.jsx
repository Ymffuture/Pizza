import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MessageCircle, X, BotIcon, ArrowUp, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "react-hot-toast";
import { MdMic, MdMicOff } from "react-icons/md";

/* ======================================================
   GEMINI ASSISTANT – FULL PRODUCTION COMPONENT
====================================================== */

const GeminiAssistant = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  /* ================= PLACEHOLDERS ================= */

  const basePlaceholders = [
    "Ask anything…",
    "Explain this code",
    "Generate an idea",
    "Debug my issue",
  ];

  const contextualMap = {
    code: [
      "Optimize this code",
      "Explain this function",
      "Convert to TypeScript",
    ],
    explanation: [
      "Give a real-world example",
      "Simplify this explanation",
      "Show best practices",
    ],
  };

  const [placeholder, setPlaceholder] = useState("");
  const [fade, setFade] = useState(true);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);

  const getContextualPlaceholders = () => {
    const lastAI = [...messages].reverse().find(m => m.sender === "ai");
    if (!lastAI) return basePlaceholders;
    if (lastAI.text.includes("```")) return contextualMap.code;
    if (lastAI.text.length > 300) return contextualMap.explanation;
    return basePlaceholders;
  };

  /* STOP placeholder animation when suggestions are visible */
  useEffect(() => {
    if (msg || isListening || messages.length === 0) return;

    const list = getContextualPlaceholders();
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPlaceholder(list[placeholderIndex % list.length]);
        setPlaceholderIndex(i => i + 1);
        setFade(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [msg, isListening, placeholderIndex, messages]);

  /* ================= TEXTAREA AUTOGROW ================= */

  const autoGrow = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  /* ================= VOICE INPUT ================= */

  const toggleVoice = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join("");
      setMsg(transcript);
    };

    recognition.onerror = () => {
      toast.error("Voice recognition failed");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  useEffect(() => {
    setPlaceholder(isListening ? "Listening… Speak now" : "Ask anything…");
  }, [isListening]);

  /* ================= CONNECTION STRENGTH ================= */

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
        if (speed < 1 || type.includes("2g")) level = "Poor";
        else if (speed < 3 || type === "3g") level = "Average";

        setStrength(level);
      };

      evaluate();
      conn.addEventListener("change", evaluate);
      return () => conn.removeEventListener("change", evaluate);
    }, []);

    return strength;
  };

  const connectionStrength = useConnectionStrength();

  /* ================= COPY ================= */

  const copyAll = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Response copied!");
  };

  /* ================= LOADER ================= */

  const Loader = () => (
    <div className="flex items-center justify-center">
      <svg width="30" height="30" viewBox="0 0 100 100" className="animate-spin">
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          strokeDasharray="250"
          strokeDashoffset="190"
        />
        <circle cx="50" cy="50" r="10" fill="#00E5FF">
          <animate attributeName="r" values="10;14;10" dur="1.6s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );

  /* ================= SCROLL ================= */

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ================= SEND MESSAGE ================= */

  const sendMessage = async () => {
    if (!msg.trim()) return;

    const userMsg = { sender: "user", text: msg };
    setMessages(p => [...p, userMsg]);
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://swiftmeta.onrender.com/api/gemini",
        { prompt: userMsg.text }
      );
      setMessages(p => [...p, { sender: "ai", text: res.data.reply }]);
    } catch {
      setMessages(p => [...p, { sender: "ai", text: "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CLOSED STATE ================= */

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-10 right-6 z-50 p-3 rounded-full bg-purple-700 text-white shadow-xl hover:scale-105 transition"
      >
        <BotIcon size={30} />
      </button>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden">

      {/* STAR BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="stars" />
        <div className="stars2" />
        <div className="stars3" />
      </div>

      {/* HEADER */}
      <header className="flex items-center justify-between px-5 py-3 backdrop-blur bg-black/70 border-b border-white/10">
        <div className="flex items-center gap-3">
          <BotIcon className="text-cyan-400" />
          <div>
            <p className="text-white font-semibold">SwiftMeta</p>
            <p className="text-xs text-gray-400">AI Assistant</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)}>
          <X className="text-gray-400 hover:text-white" />
        </button>
      </header>

      {/* MESSAGES */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 && (
          <div className="grid sm:grid-cols-2 gap-4 mt-10">
            {[
              "Explain React hooks",
              "Generate a business idea",
              "Write NestJS snippet",
              "Tips for learning AI"
            ].map((p, i) => (
              <button
                key={i}
                onClick={() => { setMsg(p); setTimeout(sendMessage, 200); }}
                className="relative rounded-xl p-4 bg-white/5 hover:scale-105 transition hover:shadow-[0_0_30px_rgba(0,229,255,0.4)]"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} mb-4`}>
            <div className={`relative max-w-[80%] p-4 rounded-2xl ${
              m.sender === "user"
                ? "bg-blue-600 text-white"
                : "bg-white/10 text-white"
            }`}>
              {m.sender === "ai" && (
                <button
                  onClick={() => copyAll(m.text)}
                  className="absolute top-2 right-2 opacity-0 hover:opacity-100"
                >
                  <Copy size={16} />
                </button>
              )}

              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ inline, className, children }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter style={coldarkCold} language={match[1]}>
                        {String(children)}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-black/30 px-1 rounded">{children}</code>
                    );
                  },
                }}
              >
                {m.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && <Loader />}
        <div ref={chatEndRef} />
      </main>

      {/* INPUT */}
      <footer className="flex gap-2 p-4 bg-black/80">
        <textarea
          ref={textareaRef}
          value={msg}
          rows={1}
          onChange={(e) => { setMsg(e.target.value); autoGrow(); }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder={placeholder}
          className={`flex-1 resize-none rounded-xl px-4 py-2 bg-transparent text-white focus:ring-2 focus:ring-cyan-400 transition-opacity ${fade ? "opacity-100" : "opacity-0"}`}
        />

        <button
          onClick={toggleVoice}
          className={`p-3 rounded-xl ${isListening ? "bg-red-500 animate-pulse" : "bg-white/10"}`}
        >
          {isListening ? <MdMicOff /> : <MdMic />}
        </button>

        <button
          onClick={sendMessage}
          disabled={loading}
          className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 hover:shadow-[0_0_20px_rgba(0,229,255,0.6)]"
        >
          <ArrowUp />
        </button>
      </footer>
    </div>
  );
};

export default GeminiAssistant;
