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
  MoreHorizontal
} from "lucide-react";
import { MdMic, MdMicOff } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import { useConnectionStrength } from "../hooks/useConnectionStrength";
import { usePuterSpeechRecognition } from "../hooks/useSpeechRecognition";
import AuthModal from "./AiLogin";
import Sidebar from "./Sidebar";
import Loader from "./Loader";

// Optimized StarBackground with CSS instead of JS animation
const StarBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
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

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const inputRef = useRef(null);

  const API_BASE = "https://swiftmeta.onrender.com/api";
  const connectionStrength = useConnectionStrength();
  
  const { transcript, isListening, toggle: toggleVoice } = usePuterSpeechRecognition();

  // Placeholders with AI context awareness
  const basePlaceholders = useMemo(() => [
    "Ask anything...",
    "Explain quantum computing",
    "Debug my React code",
    "Write a business proposal",
    "Analyze this data",
  ], []);

  const contextualPlaceholders = useMemo(() => ({
    code: ["Optimize this function", "Convert to TypeScript", "Add error handling", "Explain this algorithm"],
    creative: ["Make it more engaging", "Add a plot twist", "Improve the tone", "Expand on this idea"],
    analysis: ["Provide examples", "Compare alternatives", "Show pros and cons", "Summarize key points"],
  }), []);

  // Auth initialization
  useEffect(() => {
    const saved = localStorage.getItem("authToken");
    if (saved) setAuthToken(saved);
  }, []);

  // Speech recognition handling
  useEffect(() => {
    if (transcript) {
      setInputMessage(prev => prev ? `${prev} ${transcript}` : transcript);
      if (textareaRef.current) textareaRef.current.focus();
    }
  }, [transcript]);

  // Conversation fetching
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
  }, [authToken, API_BASE]);

  // Message loading
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
  }, [authToken, currentConversationId, API_BASE]);

  // Smart placeholder rotation
  useEffect(() => {
    if (inputMessage || isListening || !isOpen) return;

    const getPlaceholders = () => {
      const lastAI = [...messages].reverse().find(m => m.sender === "ai");
      if (!lastAI) return basePlaceholders;
      
      if (lastAI.text.includes("```")) return contextualPlaceholders.code;
      if (lastAI.text.length > 500) return contextualPlaceholders.analysis;
      if (lastAI.text.includes("story") || lastAI.text.includes("write")) return contextualPlaceholders.creative;
      
      return basePlaceholders;
    };

    const interval = setInterval(() => {
      setIsPlaceholderVisible(false);
      setTimeout(() => {
        const list = getPlaceholders();
        setPlaceholderIndex(i => (i + 1) % list.length);
        setIsPlaceholderVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [inputMessage, isListening, messages, isOpen, basePlaceholders, contextualPlaceholders]);

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

  // UUID generator
  const generateId = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  // Message sending
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
    
    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const res = await axios.post(
        `${API_BASE}/gemini`,
        { prompt: text.trim(), conversationId: currentConversationId },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (!currentConversationId && res.data.conversationId) {
        setCurrentConversationId(res.data.conversationId);
        // Refresh conversations list
        const convRes = await axios.get(`${API_BASE}/conversations`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setConversations(convRes.data);
      }

      const aiMessage = {
        id: generateId(),
        sender: "ai",
        text: res.data.reply || "I apologize, but I couldn't generate a response.",
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessage]);
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
      setIsLoading(false);
    }
  }, [inputMessage, authToken, currentConversationId, API_BASE]);

  // Copy functionality
  const copyMessage = useCallback((text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  // New conversation
  const startNewChat = useCallback(() => {
    setCurrentConversationId(null);
    setMessages([]);
    setInputMessage("");
    setSidebarOpen(false);
    toast.success("New conversation started");
  }, []);

  // Delete conversation
  const deleteConversation = useCallback(async (id, e) => {
    e.stopPropagation();
    if (!authToken) return;
    
    try {
      await axios.delete(`${API_BASE}/conversations/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      
      setConversations(prev => prev.filter(c => c._id !== id));
      if (currentConversationId === id) {
        startNewChat();
      }
      toast.success("Conversation deleted");
    } catch {
      toast.error("Failed to delete conversation");
    }
  }, [authToken, currentConversationId, API_BASE, startNewChat]);

  // Handle login success
  const handleLoginSuccess = useCallback((token) => {
    localStorage.setItem("authToken", token);
    setAuthToken(token);
    setShowAuthModal(false);
    toast.success("Welcome back!");
  }, []);

  // Logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setMessages([]);
    setConversations([]);
    setCurrentConversationId(null);
    setSidebarOpen(false);
    toast.success("Logged out successfully");
  }, []);

  // Connection status config
  const connectionConfig = useMemo(() => ({
    Good: { color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Connected" },
    Average: { color: "text-amber-400", bg: "bg-amber-500/10", label: "Slow Connection" },
    Poor: { color: "text-rose-400", bg: "bg-rose-500/10", label: "Poor Connection" },
    Checking: { color: "text-blue-400", bg: "bg-blue-500/10", label: "Checking..." },
  }), []);

  const currentStatus = connectionConfig[connectionStrength] || connectionConfig.Checking;

  // Render message content with syntax highlighting
  const renderMessageContent = useCallback((message) => {
    const isCode = message.text.includes("```");
    
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
                <div className="relative group rounded-lg overflow-hidden my-2 bg-[#1e1e1e] border border-gray-700/50">
                  <div className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-gray-700/50">
                    <span className="text-xs text-gray-400 font-mono">{match[1]}</span>
                    <button
                      onClick={() => copyMessage(codeString, `code-${message.id}`)}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      {copiedId === `code-${message.id}` ? (
                        <><Check size={12} className="text-emerald-400" /> Copied</>
                      ) : (
                        <><Copy size={12} /> Copy</>
                      )}
                    </button>
                  </div>
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{ margin: 0, padding: "1rem", background: "transparent" }}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              );
            }
            
            return (
              <code className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },
          p({ children }) {
            return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
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
  }, [copyMessage, copiedId]);

  // Quick action suggestions
  const quickActions = useMemo(() => [
    { icon: "✨", label: "Explain React hooks", prompt: "Explain React hooks with practical examples" },
    { icon: "🚀", label: "Build a startup idea", prompt: "Generate an innovative startup idea for 2024" },
    { icon: "🐛", label: "Debug my code", prompt: "Help me debug this code: [paste your code here]" },
    { icon: "📊", label: "Analyze data", prompt: "Analyze this dataset and provide insights" },
  ], []);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {connectionStrength !== "Good" && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md border ${currentStatus.bg} ${currentStatus.color} border-white/10 shadow-lg`}
            >
              <span className={`w-2 h-2 rounded-full animate-pulse ${currentStatus.color.replace('text-', 'bg-')}`} />
              {currentStatus.label}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors" />
          <BotIcon size={24} className="relative z-10" />
          
          {/* Ripple effect */}
          <span className="absolute inset-0 rounded-full animate-ping bg-purple-500/20" />
        </motion.button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-[#0a0a0a] text-gray-100 overflow-hidden">
      <StarBackground />

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
                  <button
                    onClick={(e) => deleteConversation(conv._id, e)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
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
                  <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.color.replace('text-', 'bg-')}`} />
                  {currentStatus.label}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={startNewChat}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="New Chat"
            >
              <Plus size={20} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 zoom-[50%]">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center px-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-32 h-32 mb-8 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center"
              >
                <BotIcon size={48} className="text-blue-400" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-white mb-2">How can I help you today?</h2>
              <p className="text-gray-400 mb-8">Powered by advanced AI to assist with coding, analysis, and creative tasks.</p>

              <div className="grid grid-cols-2 gap-3 w-full">
                {quickActions.map((action, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => sendMessage(action.prompt)}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-left group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{action.icon}</span>
                    <span className="text-sm text-gray-300 group-hover:text-white">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message, idx) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`group relative max-w-[85%] ${message.sender === "user" ? "items-end" : "items-start"}`}>
                    {/* Avatar */}
                    <div className={`flex items-start gap-3 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        message.sender === "user" 
                          ? "bg-blue-600" 
                          : "bg-gradient-to-br from-purple-600 to-pink-600"
                      }`}>
                        {message.sender === "user" ? (
                          <span className="text-xs font-bold text-white">You</span>
                        ) : (
                          <Sparkles size={14} className="text-white" />
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div className={`relative rounded-2xl px-4 py-3 ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-gray-800/80 text-gray-100 rounded-bl-md border border-white/10"
                      }`}>
                        {renderMessageContent(message)}
                        
                        {/* Copy button for AI messages */}
                        {message.sender === "ai" && (
                          <button
                            onClick={() => copyMessage(message.text, message.id)}
                            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600 transition-all shadow-lg"
                          >
                            {copiedId === message.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className={`text-xs text-gray-500 mt-1 ${message.sender === "user" ? "text-right mr-11" : "ml-11"}`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-3 ml-11">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <Sparkles size={14} className="text-white animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </main>

        {/* Input Area */}
        <footer className="p-4 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent">
          <div className="max-w-3xl mx-auto">
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
                placeholder={isListening ? "Listening..." : basePlaceholders[placeholderIndex]}
                rows={1}
                className="flex-1 bg-transparent text-white placeholder-gray-500 resize-none outline-none px-3 py-2.5 max-h-[200px] min-h-[44px]"
                style={{ height: "auto" }}
              />

              <div className="flex items-center gap-1 pb-1">
                <button
                  onClick={toggleVoice}
                  className={`p-2.5 rounded-xl transition-all ${
                    isListening 
                      ? "bg-red-500/20 text-red-400 animate-pulse" 
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                  title={isListening ? "Stop listening" : "Voice input"}
                >
                  {isListening ? <MdMicOff size={20} /> : <MdMic size={20} />}
                </button>

                <button
                  onClick={() => sendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-500 transition-all"
                >
                  <ArrowUp size={20} />
                </button>
              </div>
            </div>
            
            <p className="text-center text-xs text-gray-600 mt-2">
              AI can make mistakes. Please verify important information.
            </p>
          </div>
        </footer>
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GeminiAssistant;
