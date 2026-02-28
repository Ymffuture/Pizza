import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { 
  MessageCircle, 
  Send, 
  X, 
  BotIcon, 
  Copy, 
  Check, 
  ArrowUp, 
  Sparkles,
  History,
  Plus,
  Trash2,
  Wifi,
  WifiOff,
  AlertCircle
} from "lucide-react";
import { MdMic, MdMicOff } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import aiAnim from "../assets/ai.json";
import aiAnimation from "../assets/button.json";
import AuthModal from "./AiLogin";
import Sidebar from "./Sidebar";
import Loader from "./Loader";
import { useConnectionStrength } from "../hooks/useConnectionStrength";
import { usePuterSpeechRecognition } from "../hooks/useSpeechRecognition";

// SVG Connection Status Component - Shows for 5s then auto-hides
const ConnectionStatusSVG = ({ status, onHide }) => {
  const [progress, setProgress] = useState(100);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const duration = 5000;
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      
      if (elapsed >= duration) {
        clearInterval(interval);
        setVisible(false);
        onHide?.();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onHide]);

  if (!visible) return null;

  const config = {
    Good: {
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.15)",
      border: "rgba(16, 185, 129, 0.3)",
      bars: [1, 0.8, 0.6],
      label: "Connected",
      sublabel: "AI Ready"
    },
    Average: {
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.15)",
      border: "rgba(245, 158, 11, 0.3)",
      bars: [1, 0.6, 0.3],
      label: "Slow Connection",
      sublabel: "Latency High"
    },
    Poor: {
      color: "#ef4444",
      bg: "rgba(239, 68, 68, 0.15)",
      border: "rgba(239, 68, 68, 0.3)",
      bars: [1, 0.3, 0.1],
      label: "Poor Connection",
      sublabel: "Check Network"
    },
    Checking: {
      color: "#3b82f6",
      bg: "rgba(59, 130, 246, 0.15)",
      border: "rgba(59, 130, 246, 0.3)",
      bars: [0.5, 0.5, 0.5],
      label: "Checking...",
      sublabel: "Please wait"
    }
  }[status] || config.Checking;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className="fixed top-6 left-4 z-[60] flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-xl border shadow-2xl"
      style={{ 
        backgroundColor: config.bg,
        borderColor: config.border,
        color: config.color
      }}
    >
      {/* Animated Signal Bars SVG */}
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="overflow-visible">
        <rect x="2" y="14" width="4" height="6" rx="1" fill={config.color} opacity={config.bars[0]}>
          <animate attributeName="opacity" values={`${config.bars[0]};${config.bars[0] * 0.4};${config.bars[0]}`} dur="1.2s" repeatCount="indefinite" />
        </rect>
        <rect x="9" y="8" width="4" height="12" rx="1" fill={config.color} opacity={config.bars[1]}>
          <animate attributeName="opacity" values={`${config.bars[1]};${config.bars[1] * 0.4};${config.bars[1]}`} dur="1.2s" begin="0.15s" repeatCount="indefinite" />
        </rect>
        <rect x="16" y="2" width="4" height="18" rx="1" fill={config.color} opacity={config.bars[2]}>
          <animate attributeName="opacity" values={`${config.bars[2]};${config.bars[2] * 0.4};${config.bars[2]}`} dur="1.2s" begin="0.3s" repeatCount="indefinite" />
        </rect>
      </svg>

      <div className="flex flex-col min-w-[100px]">
        <span className="text-sm font-bold leading-tight">{config.label}</span>
        <span className="text-xs opacity-80 leading-tight">{config.sublabel}</span>
      </div>

      {/* Progress bar countdown */}
      <div className="w-12 h-1 bg-black/20 rounded-full overflow-hidden">
        <motion.div 
          className="h-full rounded-full"
          style={{ backgroundColor: config.color }}
          initial={{ width: "100%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>

      {/* Status Icon */}
      <div className="opacity-80">
        {status === "Good" ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : status === "Poor" ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        )}
      </div>
    </motion.div>
  );
};

// Copy Button Component
const CopyButton = ({ text, onCopy, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e?.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.();
      toast.success("Copied to clipboard!", { duration: 2000 });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${className} ${
        copied 
          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
          : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white border border-white/10"
      }`}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
};

// Enhanced Code Block with Horizontal Scroll
const CodeBlock = ({ code, language, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied!", { duration: 2000 });
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden bg-[#1e1e1e] border border-gray-700/50 shadow-lg group">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#252526] border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
            {language || "plaintext"}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            copied 
              ? "bg-emerald-500/20 text-emerald-400" 
              : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      
      {/* Code with horizontal scroll */}
      <div className="overflow-x-auto custom-scrollbar">
        <SyntaxHighlighter
          style={coldarkCold}
          language={language || "text"}
          PreTag="div"
          customStyle={{ 
            margin: 0, 
            padding: "1rem 1.25rem", 
            background: "transparent",
            minWidth: "100%"
          }}
          showLineNumbers={true}
          lineNumberStyle={{ 
            minWidth: "2.5em", 
            paddingRight: "1em", 
            color: "#6e7681",
            textAlign: "right"
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

// Star Background Component
const StarBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <style>{`
      @keyframes moveStars {
        from { transform: translate3d(0,0,0); }
        to { transform: translate3d(-600px,-300px,0); }
      }
      @keyframes pulse-glow {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.6; }
      }
    `}</style>
    <div 
      className="absolute w-[200%] h-[200%] opacity-30"
      style={{
        backgroundImage: 'radial-gradient(rgba(9, 97, 248, 0.9) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)',
        backgroundSize: '490px 160px, 80px 90px',
        animation: 'moveStars 120s linear infinite'
      }}
    />
    <div 
      className="absolute w-[200%] h-[200%] opacity-20"
      style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
        backgroundSize: '120px 120px',
        animation: 'moveStars 220s linear infinite'
      }}
    />
  </div>
);

const GeminiAssistant = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [authToken, setAuthToken] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [placeholder, setPlaceholder] = useState("Ask anything...");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showConnectionStatus, setShowConnectionStatus] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  const API_BASE = "https://swiftmeta.onrender.com/api";
  const connectionStrength = useConnectionStrength();
  
  const { transcript, isListening, toggle: toggleVoice } = usePuterSpeechRecognition();

  // Handle speech transcript
  useEffect(() => {
    if (transcript) {
      setMsg(prev => prev ? `${prev} ${transcript}` : transcript);
    }
  }, [transcript]);

  // Auth initialization
  useEffect(() => {
    const saved = localStorage.getItem("authToken");
    if (saved) setAuthToken(saved);
  }, []);

  // Show connection status on mount and when it changes
  useEffect(() => {
    if (connectionStrength && connectionStrength !== "Checking") {
      setShowConnectionStatus(true);
    }
  }, [connectionStrength]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Placeholder rotation
  useEffect(() => {
    if (msg || isListening || !open) return;
    
    const placeholders = ["Ask anything...", "Explain quantum computing", "Debug my code", "Write a poem"];
    const interval = setInterval(() => {
      setPlaceholderIndex(i => (i + 1) % placeholders.length);
      setPlaceholder(placeholders[placeholderIndex % placeholders.length]);
    }, 4000);

    return () => clearInterval(interval);
  }, [msg, isListening, open, placeholderIndex]);

  // Fetch conversations
  useEffect(() => {
    if (!authToken) return;
    
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${API_BASE}/conversations`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setConversations(res.data);
      } catch {
        toast.error("Failed to load conversations");
      }
    };
    
    fetchConversations();
  }, [authToken]);

  // Load messages for current conversation
  useEffect(() => {
    if (!authToken || !currentConversationId) return;

    const loadMessages = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/messages/${currentConversationId}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        setMessages(res.data.map(m => ({
          id: m._id || crypto.randomUUID(),
          sender: m.role === "user" ? "user" : "ai",
          text: m.content,
          timestamp: m.createdAt,
        })));
      } catch {
        toast.error("Failed to load messages");
      }
    };

    loadMessages();
  }, [authToken, currentConversationId]);

  const autoGrow = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  const generateId = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const handleOpen = () => {
    setOpen(true);
    setShowConnectionStatus(true);
  };

  const copyMessage = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(id);
      toast.success("Message copied!");
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const sendMessage = async (overrideText) => {
    const text = overrideText ?? msg;
    if (!text.trim()) return;

    if (!authToken) {
      setShowAuthModal(true);
      return;
    }

    const userMessage = {
      id: generateId(),
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMsg("");
    setLoading(true);
    
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const res = await axios.post(
        `${API_BASE}/gemini`,
        { prompt: text.trim(), conversationId: currentConversationId },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (!currentConversationId && res.data.conversationId) {
        setCurrentConversationId(res.data.conversationId);
        // Refresh conversations
        const convRes = await axios.get(`${API_BASE}/conversations`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setConversations(convRes.data);
      }

      setMessages(prev => [...prev, {
        id: generateId(),
        sender: "ai",
        text: res.data.reply || "I apologize, but I couldn't generate a response.",
        timestamp: new Date().toISOString(),
      }]);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to get response. Please try again.";
      toast.error(errorMsg);
      setMessages(prev => [...prev, {
        id: generateId(),
        sender: "ai",
        text: `⚠️ ${errorMsg}`,
        isError: true,
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setCurrentConversationId(null);
    setMessages([]);
    setMsg("");
    setSidebarOpen(false);
    toast.success("New conversation started");
  };

  const handleLoginSuccess = (token) => {
    localStorage.setItem("authToken", token);
    setAuthToken(token);
    setShowAuthModal(false);
    toast.success("Welcome back!");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setMessages([]);
    setConversations([]);
    setCurrentConversationId(null);
    setSidebarOpen(false);
    toast.success("Logged out successfully");
  };

  // Render message content with markdown
  const renderMessageContent = (message) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        className="prose prose-sm max-w-none dark:prose-invert prose-pre:p-0 prose-pre:m-0"
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");
            
            if (!inline && match) {
              return (
                <CodeBlock 
                  code={codeString} 
                  language={match[1]}
                  onCopy={() => toast.success("Code copied!")}
                />
              );
            }
            
            return (
              <code className="bg-black/20 dark:bg-white/20 px-1.5 py-0.5 rounded text-sm font-mono break-all" {...props}>
                {children}
              </code>
            );
          },
          p({ children }) {
            return <p className="mb-2 last:mb-0 leading-relaxed break-words">{children}</p>;
          },
          ul({ children }) {
            return <ul className="mb-2 space-y-1 list-disc list-inside">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="mb-2 space-y-1 list-decimal list-inside">{children}</ol>;
          },
        }}
      >
        {message.text}
      </ReactMarkdown>
    );
  };

  if (!open) {
    return (
      <>
        {/* Connection Status Popup */}
        <AnimatePresence>
          {showConnectionStatus && (
            <ConnectionStatusSVG 
              status={connectionStrength} 
              onHide={() => setShowConnectionStatus(false)}
            />
          )}
        </AnimatePresence>

        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          {/* Mini Status Indicator */}
          <AnimatePresence>
            {connectionStrength !== "Good" && !showConnectionStatus && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border ${
                  connectionStrength === "Average" 
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  connectionStrength === "Average" ? "bg-amber-400" : "bg-red-400"
                }`} />
                {connectionStrength === "Average" ? "Slow" : "Poor"}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
            className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors" />
            <Lottie
              animationData={aiAnim}
              loop
              autoplay
              className="w-8 h-8 relative z-10"
            />
            <span className="absolute inset-0 rounded-full animate-ping bg-purple-500/20" />
          </motion.button>
        </div>
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-black text-gray-900 dark:text-gray-100 overflow-hidden">
      <StarBackground />

      {/* Connection Status */}
      <AnimatePresence>
        {showConnectionStatus && (
          <ConnectionStatusSVG 
            status={connectionStrength} 
            onHide={() => setShowConnectionStatus(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute left-0 top-0 bottom-0 w-72 bg-gray-900/95 backdrop-blur-xl border-r border-white/10 z-30 flex flex-col"
          >
            <div className="p-4 border-b border-white/10">
              <button
                onClick={startNewChat}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all"
              >
                <Plus size={18} />
                New Chat
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {conversations.map((conv) => (
                <div
                  key={conv._id}
                  onClick={() => {
                    setCurrentConversationId(conv._id);
                    setSidebarOpen(false);
                  }}
                  className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    currentConversationId === conv._id 
                      ? "bg-white/10 border border-white/20" 
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {conv.title || "New Conversation"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(conv.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <History size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
              <Lottie animationData={aiAnim} loop autoplay className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 dark:text-white">SwiftMeta AI</h1>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  connectionStrength === "Good" ? "bg-emerald-400" :
                  connectionStrength === "Average" ? "bg-amber-400" :
                  connectionStrength === "Poor" ? "bg-red-400" : "bg-blue-400 animate-pulse"
                }`} />
                {connectionStrength === "Good" ? "Online" : 
                 connectionStrength === "Average" ? "Slow" :
                 connectionStrength === "Poor" ? "Poor Connection" : "Connecting..."}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={startNewChat}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 transition-colors"
            title="New Chat"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 w-full">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center px-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-64 h-64 mb-4"
            >
              <Lottie animationData={aiAnimation} loop autoplay />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">How can I help you today?</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Powered by advanced AI for coding, analysis, and creative tasks.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {[
                "Explain React hooks",
                "Generate a startup idea",
                "Debug my code",
                "Write a Python script"
              ].map((prompt, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => sendMessage(prompt)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-left transition-all group"
                >
                  <Sparkles className="w-5 h-5 text-sky-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{prompt}</span>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6 w-full px-2 sm:px-0">
            {messages.map((message, idx) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`group relative max-w-[95%] sm:max-w-[85%] ${message.sender === "user" ? "items-end" : "items-start"}`}>
                  <div className={`flex items-start gap-2 sm:gap-3 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    {/* Avatar */}
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      message.sender === "user" 
                        ? "bg-blue-600 text-white" 
                        : "bg-gradient-to-br from-purple-600 to-pink-600"
                    }`}>
                      {message.sender === "user" ? "You" : <Sparkles size={14} className="text-white" />}
                    </div>

                    {/* Message Bubble */}
                    <div className={`relative rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md border border-gray-200 dark:border-white/10"
                    }`}>
                      <div className="overflow-x-auto custom-scrollbar">
                        {renderMessageContent(message)}
                      </div>
                      
                      {/* Copy button for AI messages */}
                      {message.sender === "ai" && (
                        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <CopyButton 
                            text={message.text} 
                            onCopy={() => setCopiedMessageId(message.id)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Timestamp */}
                  <div className={`text-[10px] sm:text-xs text-gray-400 mt-1 ${message.sender === "user" ? "text-right mr-10 sm:mr-11" : "ml-10 sm:ml-11"}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="flex items-center gap-3 ml-10 sm:ml-11">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <Sparkles size={14} className="text-white animate-pulse" />
                  </div>
                  <div className="flex gap-1">
                    {[0, 150, 300].map((delay, i) => (
                      <span key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </main>

      {/* Input */}
      <footer className="p-3 sm:p-4 bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black dark:to-transparent border-t border-gray-200 dark:border-white/10">
        <div className="max-w-3xl mx-auto w-full">
          <div className="relative flex items-end gap-2 bg-gray-100 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-2 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all">
            <textarea
              ref={textareaRef}
              value={msg}
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
              placeholder={isListening ? "Listening..." : placeholder}
              rows={1}
              className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none outline-none px-3 py-2.5 text-sm sm:text-base max-h-[150px] sm:max-h-[200px] min-h-[40px] w-full"
            />
            <div className="flex items-center gap-1 pb-1 flex-shrink-0">
              <button
                onClick={toggleVoice}
                className={`p-2 rounded-xl transition-all ${
                  isListening 
                    ? "bg-red-500/20 text-red-500 animate-pulse" 
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"
                }`}
              >
                {isListening ? <MdMicOff size={20} /> : <MdMic size={20} />}
              </button>
              <button
                onClick={() => sendMessage()}
                disabled={!msg.trim() || loading}
                className="p-2 rounded-xl bg-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-500 transition-all"
              >
                <ArrowUp size={20} />
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] sm:text-xs text-gray-400 mt-2">
            AI can make mistakes. Please verify important information.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </div>
  );
};

export default GeminiAssistant;
