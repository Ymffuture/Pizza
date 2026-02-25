import { memo, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, Popover } from "antd";
import { 
  ShieldCheck, 
  Printer, 
  CheckCheck, 
  Check, 
  Clock, 
  MoreHorizontal, 
  Copy, 
  Share2, 
  Trash2, 
  Edit3,
  CornerUpLeft,
  Download,
  FileText,
  Image as ImageIcon,
  Link2,
  Smile,
  AlertCircle
} from "lucide-react";

/* -----------------------------
   Smart Time Formatter
------------------------------ */
function formatTime(date) {
  const now = new Date();
  const d = new Date(date);
  const diff = (now - d) / 1000;

  if (diff < 30) return "just now";
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 7200) return "1h";
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 7);
  if (d > weekAgo) {
    return d.toLocaleDateString(undefined, { weekday: 'short' });
  }

  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: d.getFullYear() !== now.getFullYear() ? '2-digit' : undefined
  });
}

function formatFullTime(date) {
  return new Date(date).toLocaleString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/* -----------------------------
   Smart Detection Helpers
------------------------------ */
const detectMessageType = (message) => {
  if (!message) return 'text';
  
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const hasUrl = urlRegex.test(message);
  
  const imageRegex = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
  const hasImage = imageRegex.test(message);
  
  const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
  const hasEmail = emailRegex.test(message);
  
  const phoneRegex = /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/;
  const hasPhone = phoneRegex.test(message);
  
  if (hasImage) return 'image';
  if (hasUrl) return 'link';
  if (hasEmail) return 'email';
  if (hasPhone) return 'contact';
  
  return 'text';
};

const parseMessageContent = (message) => {
  const type = detectMessageType(message);
  
  // Highlight URLs
  let content = message.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline font-medium">$1</a>'
  );
  
  // Highlight emails
  content = content.replace(
    /([^\s@]+@[^\s@]+\.[^\s@]+)/g,
    '<a href="mailto:$1" class="text-blue-600 hover:underline font-medium">$1</a>'
  );
  
  // Highlight phone numbers
  content = content.replace(
    /([\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6})/g,
    '<a href="tel:$1" class="text-blue-600 hover:underline font-medium">$1</a>'
  );
  
  return { type, content };
};

/* -----------------------------
   Smart Status Indicator
------------------------------ */
const MessageStatus = ({ status, createdAt, isAdmin }) => {
  if (isAdmin) return null;
  
  const [currentStatus, setCurrentStatus] = useState(status || 'sent');
  
  // Simulate progressive status for demo
  useEffect(() => {
    if (!status) {
      const t1 = setTimeout(() => setCurrentStatus('delivered'), 1000);
      const t2 = setTimeout(() => setCurrentStatus('read'), 3000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [status]);

  const icons = {
    sending: <Clock size={14} className="animate-pulse text-neutral-400" />,
    sent: <Check size={14} className="text-neutral-400" />,
    delivered: <CheckCheck size={14} className="text-neutral-400" />,
    read: <CheckCheck size={14} className="text-blue-500" />
  };

  const labels = {
    sending: 'Sending...',
    sent: 'Sent',
    delivered: 'Delivered',
    read: 'Read'
  };

  return (
    <Tooltip title={`${labels[currentStatus]} • ${formatFullTime(createdAt)}`}>
      <motion.span
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-1"
      >
        {icons[currentStatus]}
      </motion.span>
    </Tooltip>
  );
};

/* -----------------------------
   Message Actions Menu
------------------------------ */
const MessageActions = ({ message, onCopy, onReply, onDelete, isAdmin }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  }, [message, onCopy]);

  const items = [
    { icon: Copy, label: copied ? 'Copied!' : 'Copy text', onClick: handleCopy, color: 'text-blue-600' },
    { icon: CornerUpLeft, label: 'Reply', onClick: onReply },
    { icon: Share2, label: 'Forward', onClick: () => {} },
    { icon: Download, label: 'Download', onClick: () => {} },
    { icon: Edit3, label: 'Edit', onClick: () => {}, hidden: isAdmin },
    { icon: Trash2, label: 'Delete', onClick: onDelete, color: 'text-red-600', danger: true },
  ];

  const content = (
    <div className="py-1 min-w-[160px]">
      {items.filter(i => !i.hidden).map((item, idx) => (
        <button
          key={idx}
          onClick={item.onClick}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
            item.danger ? 'hover:bg-red-50 dark:hover:bg-red-900/20' : ''
          } ${item.color || 'text-gray-700 dark:text-gray-300'}`}
        >
          <item.icon size={16} />
          {item.label}
        </button>
      ))}
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      placement="bottom-end"
      overlayClassName="message-actions-popover"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all"
      >
        <MoreHorizontal size={16} className="text-neutral-400" />
      </motion.button>
    </Popover>
  );
};

/* -----------------------------
   Smart Bubble Content
------------------------------ */
const BubbleContent = ({ message, type }) => {
  const { content, type: detectedType } = parseMessageContent(message);
  
  const typeIcons = {
    link: <Link2 size={16} className="text-blue-500" />,
    email: <FileText size={16} className="text-green-500" />,
    contact: <ImageIcon size={16} className="text-purple-500" />,
    image: <ImageIcon size={16} className="text-pink-500" />
  };

  return (
    <div className="relative">
      {detectedType !== 'text' && (
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-black/5 dark:border-white/10">
          {typeIcons[detectedType]}
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            {detectedType}
          </span>
        </div>
      )}
      
      <div 
        className="prose prose-sm max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

/* -----------------------------
   Typing Indicator
------------------------------ */
const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-3 bg-white/80 dark:bg-neutral-900/80 rounded-2xl rounded-bl-md border border-neutral-200 dark:border-neutral-800 shadow-sm">
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
      className="w-2 h-2 bg-neutral-400 rounded-full"
    />
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }}
      className="w-2 h-2 bg-neutral-400 rounded-full"
    />
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
      className="w-2 h-2 bg-neutral-400 rounded-full"
    />
  </div>
);

/* -----------------------------
   Main Message Bubble Component
------------------------------ */
function MessageBubble({ 
  sender, 
  message, 
  createdAt, 
  updatedAt,
  status,
  isTyping = false,
  isEdited = false,
  isDeleted = false,
  replyTo = null,
  attachments = [],
  reactions = [],
  onReply,
  onDelete,
  onCopy
}) {
  const isAdmin = sender === "admin";
  const isSystem = sender === "system";
  
  // Real-time update trigger
  const [, forceUpdate] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => forceUpdate(v => v + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  if (isTyping) {
    return (
      <div className="flex w-full justify-start">
        <div className="max-w-[78%]">
          <TypingIndicator />
        </div>
      </div>
    );
  }

  if (isDeleted) {
    return (
      <div className={`flex w-full ${isAdmin ? "justify-start" : "justify-end"}`}>
        <div className="px-4 py-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-dashed border-neutral-300 dark:border-neutral-700">
          <span className="text-sm text-neutral-400 italic flex items-center gap-2">
            <AlertCircle size={14} />
            This message was deleted
          </span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`flex w-full group ${isAdmin ? "justify-start" : "justify-end"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`max-w-[85%] md:max-w-[78%] space-y-1 relative ${isAdmin ? "items-start" : "items-end"} flex flex-col`}>
        
        {/* Sender Info & Meta */}
        <div className="flex items-center gap-2 px-1">
          {isAdmin ? (
            <Tooltip title="Verified Support Agent">
              <motion.div 
                className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 cursor-default"
                whileHover={{ scale: 1.05 }}
              >
                <ShieldCheck size={12} className="text-blue-600 dark:text-blue-400" />
                <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                  Support Team
                </span>
              </motion.div>
            </Tooltip>
          ) : (
            <span className="text-[11px] text-neutral-400 font-medium">You</span>
          )}
          
          {/* Quick Actions - Visible on Hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: isAdmin ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isAdmin ? -10 : 10 }}
                className="flex items-center gap-1"
              >
                <MessageActions 
                  message={message} 
                  onCopy={onCopy}
                  onReply={onReply}
                  onDelete={onDelete}
                  isAdmin={isAdmin}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Reply Reference */}
        {replyTo && (
          <div className={`w-full px-3 py-2 rounded-t-2xl text-xs border-l-2 ${
            isAdmin 
              ? "bg-neutral-100 dark:bg-neutral-800 border-l-neutral-400 rounded-tr-2xl" 
              : "bg-green-100/50 border-l-green-500 rounded-tl-2xl"
          }`}>
            <span className="text-neutral-500 font-medium">Replying to:</span>
            <p className="text-neutral-600 dark:text-neutral-400 truncate mt-0.5">{replyTo.message}</p>
          </div>
        )}

        {/* Main Bubble */}
        <motion.div
          layout
          className={`
            relative px-4 py-3
            rounded-2xl
            text-sm leading-relaxed
            border
            shadow-[0_2px_8px_rgba(0,0,0,0.08)]
            transition-all duration-200
            ${isHovered ? 'shadow-[0_4px_12px_rgba(0,0,0,0.12)]' : ''}
            ${isAdmin
              ? `
                bg-white dark:bg-neutral-900
                text-neutral-900 dark:text-neutral-100
                border-neutral-200 dark:border-neutral-700
                rounded-bl-md
                hover:border-blue-300 dark:hover:border-blue-700
              `
              : `
                bg-gradient-to-br from-[#dcf8c6] to-[#c5e8a8]
                dark:from-[#2d4a3e] dark:to-[#1f3d32]
                text-neutral-900 dark:text-neutral-100
                border-[#b8d9a0] dark:border-[#3d5c4f]
                rounded-br-md
                hover:shadow-[0_4px_12px_rgba(37,211,102,0.2)]
              `
            }
          `}
        >
          {/* Edited Badge */}
          {isEdited && (
            <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-700 rounded-full text-[9px] font-medium text-neutral-600 dark:text-neutral-400">
              edited
            </span>
          )}

          <BubbleContent message={message} />

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {attachments.map((file, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-white dark:bg-neutral-800 shadow-sm">
                    <FileText size={20} className="text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">{file.name}</p>
                    <p className="text-xs text-neutral-500">{file.size}</p>
                  </div>
                  <Download size={18} className="text-neutral-400" />
                </motion.div>
              ))}
            </div>
          )}

          {/* Reactions */}
          {reactions.length > 0 && (
            <div className="absolute -bottom-3 right-0 flex gap-1">
              {reactions.map((reaction, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-2 py-1 rounded-full bg-white dark:bg-neutral-800 shadow-md border border-neutral-200 dark:border-neutral-700 text-xs flex items-center gap-1 cursor-pointer hover:scale-110 transition-transform"
                >
                  <span>{reaction.emoji}</span>
                  {reaction.count > 1 && (
                    <span className="text-neutral-500">{reaction.count}</span>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Time & Status Row */}
        <div className={`flex items-center gap-2 px-1 ${isAdmin ? "justify-start" : "justify-end"}`}>
          <Tooltip title={formatFullTime(createdAt)} placement={isAdmin ? "left" : "right"}>
            <motion.button
              onClick={() => setShowDetails(!showDetails)}
              className="text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
            >
              {formatTime(createdAt)}
              {isEdited && <span className="text-[9px] opacity-60">(edited)</span>}
            </motion.button>
          </Tooltip>

          {!isAdmin && <MessageStatus status={status} createdAt={createdAt} isAdmin={isAdmin} />}
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Sent:</span>
                  <span className="font-mono">{formatFullTime(createdAt)}</span>
                </div>
                {updatedAt && updatedAt !== createdAt && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Edited:</span>
                    <span className="font-mono">{formatFullTime(updatedAt)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-500">Sender ID:</span>
                  <span className="font-mono text-[10px]">{sender}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* -----------------------------
   Enhanced Export with Features
------------------------------ */
export default memo(MessageBubble, (prev, next) => {
  return (
    prev.message === next.message &&
    prev.createdAt === next.createdAt &&
    prev.status === next.status &&
    prev.reactions?.length === next.reactions?.length
  );
});
