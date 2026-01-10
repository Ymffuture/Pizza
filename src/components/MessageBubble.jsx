import { memo } from "react";
import { ShieldCheck } from "lucide-react";

/* -----------------------------
   Twitter-style time formatter
------------------------------ */
function formatTime(date) {
  const now = new Date();
  const d = new Date(date);
  const diff = (now - d) / 1000;

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  if (d.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}

function MessageBubble({ sender, message, createdAt }) {
  const isAdmin = sender === "admin";

  return (
    <div
      className={`flex w-full ${
        isAdmin ? "justify-start" : "justify-end"
      }`}
    >
      <div className="max-w-[78%] space-y-1">
        {/* Admin Badge */}
        {isAdmin && (
          <div className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 ml-1">
            <ShieldCheck size={12} />
            <span>Admin</span>
          </div>
        )}

        {/* Bubble */}
        <div
          className={`
            px-4 py-2
            rounded-2xl
            text-sm leading-relaxed
            backdrop-blur-xl
            border
            shadow-[0_1px_4px_rgba(0,0,0,0.04)]
            ${
              isAdmin
                ? `
                  bg-white/70 dark:bg-neutral-900/70
                  text-neutral-900 dark:text-neutral-100
                  border-neutral-200 dark:border-neutral-800
                  rounded-bl-md
                `
                : `
                  bg-blue-500/90
                  text-white
                  border-blue-500/40
                  rounded-br-md
                `
            }
          `}
        >
          <p className="whitespace-pre-wrap">{message}</p>
        </div>

        {/* Time */}
        {createdAt && (
          <div
            className={`
              text-[10px]
              px-1
              ${
                isAdmin
                  ? "text-neutral-400 dark:text-neutral-500 text-left"
                  : "text-blue-200 text-right"
              }
            `}
          >
            {formatTime(createdAt)}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(MessageBubble);
