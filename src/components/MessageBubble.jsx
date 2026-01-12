import { memo, useEffect, useState } from "react";
import { Tooltip } from "antd";
import { ShieldCheck, Printer } from "lucide-react";

/* -----------------------------
   Twitter / WhatsApp time formatter
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

  // 🔥 Real-time update trigger
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate((v) => v + 1);
    }, 60_000); // every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`flex w-full ${
        isAdmin ? "justify-start" : "justify-end"
      }`}
    >
      <div className="max-w-[78%] space-y-1 relative">
        {/* Admin Badge */}
        {isAdmin && (
          <Tooltip title="Support Admin">
            <div className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 ml-1 cursor-default">
              <ShieldCheck size={12} />
              <span>Admin</span>
            </div>
          </Tooltip>
        )}

        {/* Bubble */}
        <div
          className={`
            px-4 py-2
            rounded-2xl
            text-sm leading-relaxed
            border
            shadow-[0_1px_4px_rgba(0,0,0,0.04)]
            ${
              isAdmin
                ? `
                  bg-white/80 dark:bg-neutral-900/80
                  text-neutral-900 dark:text-neutral-100
                  border-neutral-200 dark:border-neutral-800
                  rounded-bl-md
                `
                : `
                  bg-[#DCF8C6]
                  text-neutral-900
                  border-[#b2e59f]
                  rounded-br-md
                `
            }
          `}
        >
          <p className="whitespace-pre-wrap">{message}</p>
        </div>

        {/* Time */}
        {createdAt && (
          <Tooltip
            title={new Date(createdAt).toLocaleString()}
            placement={isAdmin ? "left" : "right"}
          >
            <div
              className={`
                text-[10px]
                px-1 cursor-default
                ${
                  isAdmin
                    ? "text-neutral-400 dark:text-neutral-500 text-left"
                    : "text-green-700 text-right"
                }
              `}
            >
              {formatTime(createdAt)}
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

export default memo(MessageBubble);
