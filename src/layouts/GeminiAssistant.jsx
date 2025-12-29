import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { BotIcon, X, ArrowUp, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "react-hot-toast";
import { MdMic, MdMicOff } from "react-icons/md";

const GeminiAssistant = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  /* -------------------- PLACEHOLDER LOGIC -------------------- */
  const basePlaceholders = [
    "Ask anything…",
    "Explain this code",
    "Generate an idea",
    "Debug my issue",
  ];

  const [placeholder, setPlaceholder] = useState(basePlaceholders[0]);
  const [fade, setFade] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (msg || isListening || messages.length === 0) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPlaceholder(basePlaceholders[index % basePlaceholders.length]);
        setIndex((i) => i + 1);
        setFade(true);
      }, 250);
    }, 3000);

    return () => clearInterval(interval);
  }, [msg, isListening, index, messages]);

  /* -------------------- UTILS -------------------- */
  const scrollToBottom = () =>
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages, loading]);

  const autoGrow = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const copyAll = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  /* -------------------- VOICE -------------------- */
  const toggleVoice = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Voice not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;

    recognition.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join("");
      setMsg(transcript);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  /* -------------------- SEND MESSAGE -------------------- */
  const sendMessage = async () => {
    if (!msg.trim() || loading) return;

    const userMsg = { sender: "user", text: msg };
    setMessages((p) => [...p, userMsg]);
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://swiftmeta.onrender.com/api/gemini",
        { prompt: userMsg.text }
      );

      setMessages((p) => [
        ...p,
        { sender: "ai", text: res.data.reply },
      ]);
    } catch {
      setMessages((p) => [
        ...p,
        { sender: "ai", text: "Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- CLOSED BUTTON -------------------- */
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-6 z-50 p-3 rounded-full bg-purple-700 text-white shadow-xl"
      >
        <BotIcon size={28} />
      </button>
    );
  }

  /* -------------------- UI -------------------- */
  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col overflow-hidden">
      {/* ⭐ STAR BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="stars" />
        <div className="stars2" />
        <div className="stars3" />
      </div>

      {/* HEADER */}
      <header className="flex items-center justify-between px-5 py-3 backdrop-blur-xl bg-black/70 border-b border-white/10">
        <div className="flex items-center gap-3">
          <BotIcon />
          <span className="font-semibold">SwiftMeta AI</span>
        </div>
        <button onClick={() => setOpen(false)}>
          <X />
        </button>
      </header>

      {/* MESSAGES */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="grid sm:grid-cols-2 gap-4 mt-12">
            {[
              "Explain React hooks",
              "Generate a business website idea 💡",
              "Write a NestJS snippet",
              "Tips for learning AI",
            ].map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  setMsg(p);
                  setTimeout(sendMessage, 100);
                }}
                className="relative rounded-xl p-4 bg-black/60 border border-white/10
                hover:border-cyan-400/40
                hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]
                transition"
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
              className={`relative max-w-[90%] rounded-xl px-4 py-3 text-sm ${
                m.sender === "user"
                  ? "bg-blue-600"
                  : "bg-gray-800"
              }`}
            >
              {m.sender === "ai" && (
                <button
                  onClick={() => copyAll(m.text)}
                  className="absolute top-2 right-2 opacity-60 hover:opacity-100"
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
                      <SyntaxHighlighter
                        style={coldarkCold}
                        language={match[1]}
                      >
                        {String(children)}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-black/40 px-1 rounded">
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
          <div className="text-gray-400 animate-pulse">Thinking…</div>
        )}

        <div ref={chatEndRef} />
      </main>

      {/* INPUT */}
      <footer className="p-4 bg-black/80 flex gap-2 items-end border-t border-white/10">
        <textarea
          ref={textareaRef}
          value={msg}
          rows={1}
          onChange={(e) => {
            setMsg(e.target.value);
            autoGrow();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder={isListening ? "Listening…" : placeholder}
          className={`flex-1 resize-none bg-transparent outline-none ${
            fade ? "opacity-100" : "opacity-0"
          } transition`}
        />

        <button
          onClick={toggleVoice}
          className={`p-3 rounded-xl ${
            isListening ? "bg-red-600" : "bg-gray-700"
          }`}
        >
          {isListening ? <MdMicOff /> : <MdMic />}
        </button>

        <button
          onClick={sendMessage}
          disabled={loading}
          className="p-3 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600"
        >
          <ArrowUp />
        </button>
      </footer>
    </div>
  );
};

export default GeminiAssistant;
