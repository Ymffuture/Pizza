import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MessageCircle, Send, X, BotIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "react-hot-toast";
import { MdMic, MdMicOff } from "react-icons/md";
import { Copy, Check } from "lucide-react";
import { ArrowUp } from "lucide-react";
import Lottie from "lottie-react";
import aiAnim from "../assets/ai.json";
import aiAnimation from "../assets/button.json";
import { motion } from "framer-motion";
import AuthModal from "./AiLogin";
import Sidebar from "./Sidebar" ;
import Loader from "./Loader";
import { useConnectionStrength } from "../hooks/useConnectionStrength";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

const GeminiAssistant = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
// Auth
const [authToken, setAuthToken] = useState(null);
const [showAuthModal, setShowAuthModal] = useState(false);
const [sidebarOpen, setSidebarOpen] = useState(false);

// Conversations
const [conversations, setConversations] = useState([]);
const [currentConversationId, setCurrentConversationId] = useState(null);
const API_BASE = "https://swiftmeta.onrender.com/api";


  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

const {
  transcript,
  isListening,
  toggle: toggleVoice,
} = useSpeechRecognition();


  useEffect(() => {
  if (transcript) {
    setMsg(transcript);
  }
}, [transcript]);

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
const [showStatus, setShowStatus] = useState(false);

const cleanCode = (code) =>
  code
    .replace(/^\s*\d+\s?/gm, "") // remove line numbers
    .trim();

const handleOpen = () => {
  setOpen(true);
  setShowStatus(true);

  setTimeout(() => setShowStatus(false), 10000);
};
  
const copyAll = (text) => {
  navigator.clipboard.writeText(text);
  toast.success("Response copied!");
};

  const getContextualPlaceholders = () => {
    const lastAI = [...messages].reverse().find(m => m.sender === "ai");
    if (!lastAI) return basePlaceholders;

    if (lastAI.text.includes("```")) return contextualMap.code;
    if (lastAI.text.length > 300) return contextualMap.explanation;

    return basePlaceholders;
  };

  useEffect(() => {
    if (msg || isListening || messages.length === 0) return;
          const list = getContextualPlaceholders();

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPlaceholder(list[placeholderIndex % list.length]);
        setPlaceholderIndex(i => i + 1);
        setFade(true);
      }, 3000);
    }, 3000);

    return () => clearInterval(interval);
  }, [msg, isListening, placeholderIndex, messages]);

  const autoGrow = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  // ... (rest of the code unchanged: connectionStrength hook, Loader, scrollToBottom, sendMessage, etc.)
const statusMap = {
  Good: {
    color: "text-green-400",
    bg: "bg-green-500/10",
    ring: "ring-black",
    label: "Connection speed: Good",
  },
  Average: {
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    ring: "ring-orange-600",
    label: "Connection speed: Average",
  },
  Poor: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    ring: "ring-red-600",
    label: "Connection speed: Poor",
  },
};

const StarBackground = () => (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <style>{`@keyframes moveStars {from { transform: translate3d(0,0,0);} to { transform: translate3d(-600px,-300px,0);} }`}</style>
      <div style={{ position: 'absolute', width: '200%', height: '200%', backgroundImage: 'radial-gradient(rgba(9, 97, 248, 0.9) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)', backgroundSize: '490px 160px, 80px 90px', opacity: 0.3, animation: 'moveStars 120s linear infinite' }} />
      <div style={{ position: 'absolute', width: '200%', height: '200%', backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '120px 120px', opacity: 0.2, animation: 'moveStars 220s linear infinite' }} />
    </div>
  );


    const connectionStrength = useConnectionStrength();
  
  useEffect(() => {
  if (connectionStrength === "Checking" || connectionStrength === "Unknown") return;

  setShowStatus(true);
  const timer = setTimeout(() => setShowStatus(false), 10000);

  return () => clearTimeout(timer);
}, [connectionStrength]);


  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, loading]);
  
  useEffect(() => {
    if (!authToken || !currentConversationId) return;

    axios
      .get(`${API_BASE}/messages/${currentConversationId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((res) => {
        setMessages(
          res.data.map((m) => ({
            id: m._id,
            sender: m.role === "user" ? "user" : "ai",
            text: m.content,
          }))
        );
      })
      .catch(() => toast.error("Failed to load messages"));
  }, [currentConversationId, authToken]);

const sendMessage = async () => {
    if (!msg.trim()) return;

    if (!authToken) {
      setShowAuthModal(true);
      return;
    }

    const userMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: msg,
    };

    setMessages((p) => [...p, userMessage]);
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE}/gemini`,
        {
          prompt: userMessage.text,
          conversationId: currentConversationId,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (!currentConversationId && res.data.conversationId) {
        setCurrentConversationId(res.data.conversationId);
      }

      setMessages((p) => [
        ...p,
        {
          id: crypto.randomUUID(),
          sender: "ai",
          text: res.data.reply,
        },
      ]);
    } catch (err) {
      setMessages((p) => [
        ...p,
        {
          id: crypto.randomUUID(),
          sender: "ai",
          text: "Something went wrong. Please try again.",
        },
      ]);
      toast.error("AI request failed");
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
<div className="fixed bottom-6 right-4 z-50 flex items-center gap-3">
  {/* Slide-out status */}
  <div
    className={`
      px-4 py-2 rounded-full
      text-sm font-medium
      backdrop-blur
      border
      transition-all duration-300 ease-out
      ${statusMap[connectionStrength]?.bg}
      ${statusMap[connectionStrength]?.color}
      ${showStatus
        ? "opacity-100 translate-x-0"
        : "opacity-0 translate-x-6 pointer-events-none"}
    `}
  >
    {statusMap[connectionStrength]?.label}
  </div>

  {/* AI Button */}
<button
  onClick={handleOpen}
  aria-label="Open AI Assistant"
  className={`
    relative
    p-3 rounded-full
    shadow-xl
    transition
    hover:scale-110
    active:scale-100
    overflow-hidden
  `}
>
  {/* AI LOTTIE */}
  <Lottie
  animationData={aiAnim}
  loop
  autoplay
  className={`
    w-6 h-6
    drop-shadow-lg
    scale-220
    ${statusMap[connectionStrength]?.color}
  `}
  aria-hidden="true"
/>
</button>

</div>

    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-black flex flex-col">

      {/* Stars background */}
<StarBackground/>

      {/* HEADER unchanged */}
      <header className="flex items-center justify-between px-5 py-3 backdrop-blur-xl bg-white/80 dark:bg-gray-900/70 border-b border-gray-200/70 dark:border-gray-800 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center justify-center w-9 h-9 rounded-full bg-sky-500/10 overflow-hidden"
            onClick={() => {
    if (!authToken) setShowAuthModal(true);
    else setSidebarOpen((v) => !v);
  }}
            >
  <Lottie
    animationData={aiAnim}
    loop
    autoplay
    className="w-full h-full scale-[1.15]"
    aria-hidden="true"
  />
</div>

          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">SwiftMeta</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">AI Assistant</p>
          </div>

        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${connectionStrength === "Good" ? "bg-green-500/10 text-green-600 border-green-500/20" : connectionStrength === "Average" ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}>
            {connectionStrength}
          </span>
          <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </header>

      {/* MESSAGES unchanged */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-my-4 dark:text-white">
        {/* ... messages rendering unchanged ... */}
        {messages.length === 0 && (
  <>
    {/* AI LOTTIE ANIMATION */}
    <div className="mt-1 flex justify-center">
      <Lottie
        animationData={aiAnimation}
        loop
        autoplay
        className="w-80 h-80 opacity-90"
        aria-hidden="true"
      />
    </div>
    {/* PROMPT BUTTONS */}
    <div className="grid sm:grid-cols-2 gap-3 mt-10">
      {[
        "Explain React hooks",
        "Generate a website idea for business",
        "Write a NestJS snippet",
        "Tips for learning AI",
      ].map((p, i) => (
        <motion.button
          whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
          key={i}
          onClick={() => {
            setMsg(p);
            setTimeout(sendMessage, 200);
          }}
          className="
            relative rounded-xl p-4 text-sm text-center 
            bg-white/60 dark:bg-white/5 backdrop-blur-xl
            transition-all duration-300
            hover:scale-[1.03]
            hover:shadow-[0_0_30px_rgba(0,229,255,0.35)]
            border border-white/10
          "
        >
          <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/20 to-purple-500/20 opacity-0 hover:opacity-100 transition" />
          <span className="relative z-10">{p}</span>
        </motion.button>
      ))}
    </div>

    
  </>
)}

      {messages.map((m, i) => (
  <div
    key={i}
    className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
  >
   <div
  className={`
    group relative max-w-[100%] rounded-2xl px-4 py-3 text-sm shadow
    ${m.sender === "user"
      ? "bg-[#87CEEB] text-white dark:bg-blue-700 m-3"
      : "bg-gray-200 dark:bg-gray-700 dark:text-white"}
  `}
>

      {/* COPY FULL MESSAGE (AI ONLY) */}
      {m.sender !== "user" && (
       <button
  onClick={() => copyAll(m.text)}
  className="
    absolute top-2 right-2
    opacity-0 group-hover:opacity-100
    transition
    bg-black/70 text-white
    p-1.5 rounded-lg
  "
>
  <Copy size={16} />
</button>

      )}

   <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  className="prose prose-sm max-w-none dark:prose-invert"
 components={{
  code({ inline, className, children }) {
    const match = /language-(\w+)/.exec(className || "");

    if (!inline && match) {
      const [copied, setCopied] = React.useState(false);

      const handleCopy = () => {
        const text = cleanCode(String(children));
        navigator.clipboard.writeText(text);

        // Mobile haptic feedback
        if (navigator.vibrate) navigator.vibrate(20);

        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      };

      return (
        <div className="relative group">
          {/* COPY BUTTON (sticky follows scroll) */}
          <button
            onClick={handleCopy}
            aria-label="Copy code"
            className={`
              sticky top-2 ml-auto mr-2 z-20
              flex items-center gap-1
              px-2 py-1 rounded-md
              text-xs font-medium
              transition-all duration-200
              ${
                copied
                  ? "bg-green-600 text-white animate-pop"
                  : "bg-black/70 text-white"
              }
              opacity-0 group-hover:opacity-100
            `}
          >
            {copied ? (
              <>
                <Check size={14} />
                <span className="text-[10px]">Copied!</span>
              </>
            ) : (
              <Copy size={14} className="opacity-100" />
            )}
          </button>

          {/* TOOLTIP */} 
          {copied && (
            <div
              className="
                absolute -top-7 right-3
                px-2 py-1 rounded-md
                text-[10px]
                bg-black text-white
                shadow-lg
                animate-pop
                flex gap-2
              "
            >
             <Check size={16} /> Copied!
            </div>
          )}
          

          <SyntaxHighlighter
            style={coldarkCold}
            language={match[1]}
            PreTag="div"
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      );
    }

    return (
      <code className="bg-gray-300 dark:bg-gray-600 px-1 rounded">
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
          <div className="flex justify-start gap-2 items-center animate-pulse">
            <Loader />
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      {/* INPUT */}
      <footer className="bg-gray-200 dark:bg-gray-800 p-4 flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={msg}
          rows={1}
          onChange={(e) => { setMsg(e.target.value); autoGrow(); }}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder={isListening ? "Listening… Speak now" : placeholder}
          className={`flex-1 resize-none rounded-xl px-4 py-2 bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}
        />

        <button
          onClick={toggleVoice}
          className={`p-3 rounded-full transition ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-gray-300 dark:bg-gray-700"}`}
        >
          {isListening ? <MdMicOff size={28} /> : <MdMic size={28} />}
        </button>

        <button
          onClick={sendMessage}
          disabled={loading}
          className="p-3 rounded-full bg-gradient-to-tr from-black to-black/10 text-white"
        >
          <ArrowUp size={28} />
        </button>
      </footer>

      {showAuthModal && (
  <AuthModal
    onClose={() => setShowAuthModal(false)}
    onLoginSuccess={(token) => {
      setAuthToken(token);
      setOpen(true);
    }}
  />
)}

{authToken && sidebarOpen && (
  <Sidebar
    token={authToken}
    onSelectConversation={(id) => {
      setCurrentConversationId(id);
      setSidebarOpen(false);
    }}
  />
)}
 </div>
  );
};

export default GeminiAssistant;
