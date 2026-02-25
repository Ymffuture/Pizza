import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTicket, replyTicket } from "../api/ticketApi";
import { 
  Search, 
  Send, 
  Ticket, 
  Info, 
  Printer, 
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  Hash,
  Calendar,
  User
} from "lucide-react";
import MessageBubble from "../components/MessageBubble";
import { Tooltip } from "antd";

/* ---------------------------
   Smart Hooks
---------------------------- */
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/* ---------------------------
   Visual Components
---------------------------- */

const StatusBadge = ({ status }) => {
  const configs = {
    open: {
      color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      icon: CheckCircle2,
      label: "Active",
      pulse: true
    },
    pending: {
      color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      icon: Clock,
      label: "Pending",
      pulse: true
    },
    closed: {
      color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
      icon: XCircle,
      label: "Closed",
      pulse: false
    }
  };

  const config = configs[status] || configs.closed;
  const Icon = config.icon;

  return (
    <Tooltip
      title={
        status === "closed" 
          ? "This ticket is closed. Create a new one for further assistance."
          : status === "pending" 
          ? "Awaiting response from support team"
          : "Ticket is active and being handled"
      }
      placement="top"
    >
      <motion.div 
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${config.color}`}
        animate={config.pulse ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Icon size={16} />
        <span>{config.label}</span>
      </motion.div>
    </Tooltip>
  );
};

const TicketCard = ({ ticket, onReply, message, setMessage, isLoading }) => {
  const messagesEndRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ticket.messages]);

  const isClosed = ticket.status === "closed";
  const messageCount = ticket.messages?.length || 0;
  const lastUpdate = ticket.messages?.[messageCount - 1]?.timestamp;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
    >
      {/* Header */}
      <div className="relative p-6 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800 border-b border-neutral-200 dark:border-neutral-800 pt-20" >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold">
              <Hash size={12} />
              Ticket ID
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xl font-bold text-neutral-900 dark:text-white tracking-wider">
                {ticket.ticketId}
              </span>
              <StatusBadge status={ticket.status} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip title="Print conversation">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.print()}
                className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <Printer size={18} />
              </motion.button>
            </Tooltip>
          </div>
        </div>

        {/* Subject & Meta */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
            <Info size={14} />
            <span className="font-medium">{ticket.subject || "No subject"}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MessageSquare size={14} />
            <span>{messageCount} messages</span>
          </div>

          {lastUpdate && (
            <div className="flex items-center gap-2 text-neutral-400">
              <Calendar size={14} />
              <span>Last update {new Date(lastUpdate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="relative bg-neutral-50/50 dark:bg-neutral-950/50">
        <div 
          className={`p-6 space-y-4 overflow-y-auto transition-all duration-500 ${isExpanded ? 'max-h-[600px]' : 'max-h-[400px]'}`}
        >
          <AnimatePresence>
            {(ticket.messages || []).map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <MessageBubble {...msg} />
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Expand/Collapse */}
        {messageCount > 5 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-neutral-50 dark:from-neutral-950 to-transparent flex justify-center">
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-neutral-800 shadow-lg border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-600 dark:text-neutral-300"
            >
              {isExpanded ? 'Show less' : 'View all messages'}
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                <ChevronDown size={16} />
              </motion.div>
            </motion.button>
          </div>
        )}
      </div>

      {/* Reply Section */}
      <AnimatePresence>
        {!isClosed ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900"
          >
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  rows={Math.min(4, message.split('\n').length + 1)}
                  className="w-full resize-none px-4 py-3 pr-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-900 outline-none transition-all placeholder:text-neutral-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      onReply();
                    }
                  }}
                />
                <div className="absolute bottom-3 right-3 text-xs text-neutral-400">
                  {message.length > 0 && `${message.length} chars`}
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onReply}
                disabled={!message.trim() || isLoading}
                className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Send size={20} />
                )}
              </motion.button>
            </div>
            <p className="mt-2 text-xs text-neutral-400 text-center">
              Press Enter to send, Shift + Enter for new line
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 bg-neutral-100 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-800"
          >
            <div className="flex items-center justify-center gap-3 text-neutral-500 dark:text-neutral-400">
              <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">Ticket Closed</p>
                <p className="text-sm">This conversation has been archived</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-16 px-6"
  >
    <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 flex items-center justify-center shadow-inner">
      <Ticket className="text-neutral-400" size={40} />
    </div>
    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
      Enter a Ticket ID
    </h3>
    <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
      Type your ticket reference number above to view your support conversation
    </p>
  </motion.div>
);

const SearchInput = ({ value, onChange, isLoading }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative flex-1 transition-all duration-300 ${isFocused ? 'transform scale-[1.02]' : ''}`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
        <Ticket size={20} />
      </div>
      
      <input
        type="text"
        placeholder="XXX-XXX-XXXX"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full pl-12 pr-12 py-4 rounded-2xl
          bg-white dark:bg-neutral-900
          text-neutral-900 dark:text-neutral-100
          text-lg font-mono tracking-wider
          border-2 transition-all duration-300
          ${isFocused 
            ? 'border-blue-500 shadow-lg shadow-blue-500/10' 
            : 'border-neutral-200 dark:border-neutral-800'
          }
          outline-none placeholder:text-neutral-300
        `}
      />

      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => onChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400"
          >
            <XCircle size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="animate-spin text-blue-500" size={20} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

/* ---------------------------
   MAIN COMPONENT
---------------------------- */
export default function TrackTicket() {
  const [id, setId] = useState("");
  const debouncedId = useDebounce(id);
  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [error, setError] = useState("");

  // Load ticket
  useEffect(() => {
    if (!debouncedId.trim()) {
      setTicket(null);
      setError("");
      return;
    }

    let active = true;
    const loadTicket = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getTicket(debouncedId.trim());
        if (active) setTicket(data);
      } catch {
        if (active) {
          setTicket(null);
          setError("Ticket not found. Please check the ID and try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadTicket();
    return () => { active = false; };
  }, [debouncedId]);

  // Auto refresh
  useEffect(() => {
    if (!ticket || ticket.status === "closed") return;
    const interval = setInterval(async () => {
      try {
        const fresh = await getTicket(ticket.ticketId);
        setTicket(fresh);
      } catch {}
    }, 15000);
    return () => clearInterval(interval);
  }, [ticket?.ticketId, ticket?.status]);

  const reply = async () => {
    if (!message.trim() || !ticket || ticket.status === "closed") return;

    setReplyLoading(true);
    try {
      const updated = await replyTicket(ticket.ticketId, {
        sender: "user",
        message: message.trim(),
      });
      setTicket(updated);
      setMessage("");
      setError("");
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-blue-950/20">
      <div className="max-w-2xl mx-auto px-4 py-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
            <RefreshCw size={14} />
            <span>Live Updates</span>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Track Your Support Ticket
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            View real-time updates and communicate with our team
          </p>
        </motion.div>

        {/* Search */}
        <div className="flex gap-3 mb-6">
          <SearchInput 
            value={id} 
            onChange={setId} 
            isLoading={loading} 
          />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setId(id)}
            disabled={loading}
            className="px-6 py-4 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold shadow-lg disabled:opacity-50"
          >
            <Search size={20} />
          </motion.button>
        </div>

        {/* Status Messages */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3"
            >
              <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <AnimatePresence mode="wait">
          {ticket ? (
            <TicketCard
              key="ticket"
              ticket={ticket}
              onReply={reply}
              message={message}
              setMessage={setMessage}
              isLoading={replyLoading}
            />
          ) : !loading && !error && (
            <EmptyState key="empty" />
          )}
        </AnimatePresence>

        {/* Help Footer */}
        {!ticket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-neutral-400 dark:text-neutral-600">
              Can't find your ticket?{" "}
              <a href="/support" className="text-blue-600 hover:underline font-medium">
                Contact support
              </a>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
