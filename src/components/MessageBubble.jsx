import { memo } from "react";
import { ShieldCheck } from "lucide-react";

function MessageBubble({ sender, message, createdAt }) {
  const isAdmin = sender === "admin";

  return (
    <div
      className={`flex ${isAdmin ? "justify-start" : "justify-end"} w-full`}
    >
      <div
        className={`
          relative max-w-[75%] px-4 py-3
          rounded-2xl text-sm leading-relaxed
          backdrop-blur-md
          transition-all
          ${
            isAdmin
              ? `
                bg-neutral-200/80 dark:bg-neutral-800/80
                text-neutral-900 dark:text-neutral-100
                rounded-bl-md
                shadow-[0_4px_20px_rgba(0,0,0,0.06)]
              `
              : `
                bg-blue-500/90
                text-white
                rounded-br-md
                shadow-[0_4px_20px_rgba(0,0,0,0.12)]
              `
          }
        `}
      >
        {/* Admin badge */}
        {isAdmin && (
          <div className="
            absolute -top-3 left-3
            flex items-center gap-1
            px-2 py-[2px]
            rounded-full
            text-[10px] font-medium
            bg-neutral-300 dark:bg-neutral-700
            text-neutral-700 dark:text-neutral-200
            shadow-sm
          ">
            <ShieldCheck size={12} />
            Admin
          </div>
        )}

        {/* Message */}
        <p className="whitespace-pre-wrap">{message}</p>

        {/* Timestamp */}
        {createdAt && (
          <span
            className={`
              block mt-1 text-[10px]
              ${
                isAdmin
                  ? "text-neutral-500 dark:text-neutral-400"
                  : "text-blue-100"
              }
            `}
          >
            {new Date(createdAt).toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}

export default memo(MessageBubble);
