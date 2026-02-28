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
  Settings,
  Plus,
  Trash2,
  MoreHorizontal,
  Wifi,
  WifiOff,
  AlertCircle
} from "lucide-react";
import { MdMic, MdMicOff } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// SVG Connection Status Component
const ConnectionStatusSVG = ({ status, duration = 5000 }) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setVisible(true);
    setProgress(100);
    
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      
      if (elapsed >= duration) {
        setVisible(false);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [status, duration]);

  if (!visible) return null;

  const getStatusConfig = () => {
    switch (status) {
      case "Good":
        return {
          color: "#10b981",
          bgColor: "#10b98120",
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.55a11 11 0 0 1 14.08 0" />
              <path d="M1.42 9a16 16 0 0 1 21.16 0" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
          ),
          label: "Connected",
          bars: [1, 0.7, 0.4]
        };
      case "Average":
        return {
          color: "#f59e0b",
          bgColor: "#f59e0b20",
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.55a11 11 0 0 1 14.08 0" />
              <path d="M1.42 9a16 16 0 0 1 21.16 0" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" opacity="0.3" />
              <line x1="12" y1="20" x2="12.01" y2="20" opacity="0.3" />
            </svg>
          ),
          label: "Slow",
          bars: [1, 0.7, 0.2]
        };
      case "Poor":
        return {
          color: "#ef4444",
          bgColor: "#ef444420",
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.55a11 11 0 0 1 14.08 0" opacity="0.3" />
              <path d="M1.42 9a16 16 0 0 1 21.16 0" opacity="0.3" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" opacity="0.3" />
              <line x1="12" y1="20" x2="12.01" y2="20" opacity="0.3" />
              <line x1="2" y1="2" x2="22" y2="22" />
            </svg>
          ),
          label: "Poor",
          bars: [1, 0.3, 0.1]
        };
      default:
        return {
          color: "#3b82f6",
          bgColor: "#3b82f620",
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ),
          label: "Checking...",
          bars: [0.5, 0.5, 0.5]
        };
    }
  };

  const config = getStatusConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      className="fixed top-4 right-4 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-md border shadow-2xl"
      style={{ 
        backgroundColor: config.bgColor,
        borderColor: `${config.color}40`,
        color: config.color
      }}
    >
      {/* Animated Signal Bars SVG */}
      <svg width="24" height="24" viewBox="0 0 24 24" className="overflow-visible">
        <rect x="2" y="14" width="4" height="6" rx="1" fill={config.color} opacity={config.bars[0]}>
          <animate attributeName="opacity" values={`${config.bars[0]};${config.bars[0] * 0.5};${config.bars[0]}`} dur="1.5s" repeatCount="indefinite" />
        </rect>
        <rect x="9" y="8" width="4" height="12" rx="1" fill={config.color} opacity={config.bars[1]}>
          <animate attributeName="opacity" values={`${config.bars[1]};${config.bars[1] * 0.5};${config.bars[1]}`} dur="1.5s" begin="0.2s" repeatCount="indefinite" />
        </rect>
        <rect x="16" y="2" width="4" height="18" rx="1" fill={config.color} opacity={config.bars[2]}>
          <animate attributeName="opacity" values={`${config.bars[2]};${config.bars[2] * 0.5};${config.bars[2]}`} dur="1.5s" begin="0.4s" repeatCount="indefinite" />
        </rect>
      </svg>

      <div className="flex flex-col min-w-[80px]">
        <span className="text-sm font-semibold leading-none">{config.label}</span>
        <span className="text-xs opacity-70 mt-0.5">AI Assistant</span>
      </div>

      {/* Progress bar */}
      <div className="w-16 h-1 bg-black/20 rounded-full overflow-hidden">
        <motion.div 
          className="h-full rounded-full"
          style={{ backgroundColor: config.color }}
          initial={{ width: "100%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>

      <div className="text-current opacity-80">
        {config.icon}
      </div>
    </motion.div>
  );
};

// Copy Button Component
const CopyButton = ({ text, id, copiedId, setCopiedId, className = "" }) => {
  const isCopied = copiedId === id;
  
  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success("Copied to clipboard!", { duration: 2000 });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${className} ${
        isCopied 
          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
          : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
      }`}
      title={isCopied ? "Copied!" : "Copy to clipboard"}
    >
      {isCopied ? <Check size={12} /> : <Copy size={12} />}
      <span className="hidden sm:inline">{isCopied ? "Copied" : "Copy"}</span>
    </button>
  );
};

// Code Block Component with Horizontal Scroll
const CodeBlock = ({ code, language, messageId, copiedId, setCopiedId }) => {
  return (
    <div className="my-3 rounded-xl overflow-hidden bg-[#1e1e1e] border border-gray-700/50 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#252526] border-b border-gray-700/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-3 text-xs font-mono text-gray-400 uppercase tracking-wider">
            {language || "code"}
          </span>
        </div>
        <CopyButton 
          text={code} 
          id={`code-${messageId}`} 
          copiedId={copiedId} 
          setCopiedId={setCopiedId}
        />
      </div>
      
      {/* Code with horizontal scroll */}
      <div className="overflow-x-auto custom-scrollbar">
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language || "text"}
          PreTag="div"
          customStyle={{ 
            margin: 0, 
            padding: "1rem 1.25rem", 
            background: "transparent",
            minWidth: "fit-content"
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

// Inline Code Component
const InlineCode = ({ children }) => (
  <code className="px-1.5 py-0.5 rounded-md bg-black/20 dark:bg-white/10 text-sm font-mono text-pink-400 border border-black/10 dark:border-white/10 break-all">
    {children}
  </code>
);

// Optimized StarBackground
const StarBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black" />
    <div className="absolute inset-0 opacity-30">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            width: Math.random() * 3 + 'px',
            height: Math.random() * 3 + 'px',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${Math.random() * 3 + 2}s`
          }}
        />
      ))}
    </div>
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
  </div>
);

const GeminiAssistant = () => {
  // State Management
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [authToken, setAuthToken] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [connectionStrength, setConnectionStrength] = useState("Checking");

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  const API_BASE = "https://swiftmeta.onrender.com/api";

  // Simulate connection check
  useEffect(() => {
    const checkConnection = () => {
      setConnectionStrength("Checking");
      setTimeout(() => {
        const strengths = ["Good", "Average", "Poor", "Good"];
        setConnectionStrength(strengths[Math.floor(Math.random() * strengths.length)]);
      }, 1000);
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auth initialization
  useEffect(() => {
    const saved = localStorage.getItem("authToken");
    if (saved) setAuthToken(saved);
  }, []);

  // Conversation fetching
  useEffect(() => {
    if (!authToken) return;
    // ... fetch logic
  }, [authToken]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  // Auto-resize textarea
  const autoGrow = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, []);

  // Generate ID
  const generateId = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  // Send message
  const sendMessage = useCallback(async (overrideText) => {
    const text = overrideText ?? inputMessage;
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
    setInputMessage("");
    setIsLoading(true);
    
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    // Simulate API call
    setTimeout(() => {
      const aiMessage = {
        id: generateId(),
        sender: "ai",
        text: `Here's a sample response with code:\n\n\`\`\`javascript\n// Example function\nfunction calculateSum(a, b) {\n  return a + b;\n}\n\nconst result = calculateSum(5, 3);\nconsole.log(result); // 8\n\`\`\`\n\nAnd some inline code: \`const x = 10\`\n\n**Bold text** and *italic text* work too!\n\n- List item 1\n- List item 2\n- List item 3`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 2000);
  }, [inputMessage, authToken]);

  // Render message content
  const renderMessageContent = useCallback((message) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        className="prose prose-sm max-w-none dark:prose-invert prose-pre:p-0 prose-pre:m-0 prose-p:mb-2 prose-p:last:mb-0 prose-ul:my-2 prose-ol:my-2"
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");
            
            if (!inline && match) {
              return (
                <CodeBlock 
                  code={codeString} 
                  language={match[1]} 
                  messageId={message.id}
                  copiedId={copiedId}
                  setCopiedId={setCopiedId}
                />
              );
            }
            
            return <InlineCode>{children}</InlineCode>;
          },
          p({ children }) {
            return <p className="mb-2 last:mb-0 leading-relaxed break-words">{children}</p>;
          },
          ul({ children }) {
            return <ul className="mb-2 space-y-1 list-disc list-inside pl-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="mb-2 space-y-1 list-decimal list-inside pl-1">{children}</ol>;
          },
          li({ children }) {
            return <li className="break-words">{children}</li>;
          },
          strong({ children }) {
            return <strong className="font-semibold text-white">{children}</strong>;
          },
          em({ children }) {
            return <em className="italic text-gray-300">{children}</em>;
          },
        }}
      >
        {message.text}
      </ReactMarkdown>
    );
  }, [copiedId]);

  // Quick actions
  const quickActions = useMemo(() => [
    { icon: "✨", label: "Explain React hooks", prompt: "Explain React hooks with practical examples" },
    { icon: "🚀", label: "Build a startup idea", prompt: "Generate an innovative startup idea for 2024" },
    { icon: "🐛", label: "Debug my code", prompt: "Help me debug this code" },
    { icon: "📊", label: "Analyze data", prompt: "Analyze this dataset and provide insights" },
  ], []);

  if (!isOpen) {
    return (
      <>
        {/* Connection Status */}
        <ConnectionStatusSVG status={connectionStrength} duration={5000} />
        
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors" />
            <BotIcon size={24} className="relative z-10" />
            <span className="absolute inset-0 rounded-full animate-ping bg-purple-500/20" />
          </motion.button>
        </div>
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-[#0a0a0a] text-gray-100 overflow-hidden">
      <StarBackground />

      {/* Connection Status */}
      <ConnectionStatusSVG status={connectionStrength} duration={5000} />

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute left-0 top-0 bottom-0 w-72 bg-gray-900/95 backdrop-blur-xl border-r border-white/10 z-20 flex flex-col"
          >
            <div className="p-4 border-b border-white/10">
              <button
                onClick={() => {}}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all"
              >
                <Plus size={18} />
                New Chat
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {/* Conversation list */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10 w-full">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 bg-gray-900/50 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <History size={20} className="text-gray-400" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-white">SwiftMeta AI</h1>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
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
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </header>

        {/* Messages Area */}
        <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 w-full">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center px-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center"
              >
                <BotIcon size={40} className="text-blue-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">How can I help?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-6">
                {quickActions.map((action, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => sendMessage(action.prompt)}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all"
                  >
                    <span className="text-2xl">{action.icon}</span>
                    <span className="text-sm text-gray-300">{action.label}</span>
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
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs sm:text-sm ${
                        message.sender === "user" 
                          ? "bg-blue-600" 
                          : "bg-gradient-to-br from-purple-600 to-pink-600"
                      }`}>
                        {message.sender === "user" ? "You" : <Sparkles size={14} />}
                      </div>

                      {/* Message Bubble */}
                      <div className={`relative rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-gray-800/80 text-gray-100 rounded-bl-md border border-white/10"
                      }`}>
                        <div className="overflow-x-auto custom-scrollbar">
                          {renderMessageContent(message)}
                        </div>
                        
                        {/* Copy button */}
                        <div className={`absolute ${message.sender === "user" ? "left-0 -translate-x-full" : "right-0 translate-x-full"} top-0 opacity-0 group-hover:opacity-100 transition-opacity pl-2 sm:pl-3`}>
                          <CopyButton 
                            text={message.text} 
                            id={message.id}
                            copiedId={copiedId}
                            setCopiedId={setCopiedId}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Timestamp */}
                    <div className={`text-[10px] sm:text-xs text-gray-500 mt-1 ${message.sender === "user" ? "text-right mr-10 sm:mr-11" : "ml-10 sm:ml-11"}`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="flex items-center gap-3 ml-10 sm:ml-11">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <Sparkles size={14} className="text-white animate-pulse" />
                    </div>
                    <div className="flex gap-1">
                      {[0, 150, 300].map((delay, i) => (
                        <span key={i} className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </main>

        {/* Input Area */}
        <footer className="p-3 sm:p-4 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent w-full">
          <div className="max-w-3xl mx-auto w-full">
            <div className="relative flex items-end gap-2 bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/10 p-2 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  autoGrow();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask anything..."
                rows={1}
                className="flex-1 bg-transparent text-white placeholder-gray-500 resize-none outline-none px-3 py-2.5 text-sm sm:text-base max-h-[150px] sm:max-h-[200px] min-h-[40px] w-full"
              />
              <div className="flex items-center gap-1 pb-1 flex-shrink-0">
                <button
                  onClick={() => {}}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <MdMic size={20} />
                </button>
                <button
                  onClick={() => sendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2 rounded-xl bg-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-500 transition-all"
                >
                  <ArrowUp size={20} />
                </button>
              </div>
            </div>
            <p className="text-center text-[10px] sm:text-xs text-gray-600 mt-2">
              AI can make mistakes. Please verify important information.
            </p>
          </div>
        </footer>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
      `}</style>
    </div>
  );
};

export default GeminiAssistant;
