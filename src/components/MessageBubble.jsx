import { memo } from "react";

function MessageBubble({ sender, message, createdAt }) {
  const isAdmin = sender === "admin";

  return (
    <div
      className={`flex ${isAdmin ? "justify-start" : "justify-end"} w-full`}
    >
      <div
        className={`
          max-w-[75%]
          px-4 py-2
          rounded-2xl
          text-sm
          leading-relaxed
          shadow-sm
          ${
            isAdmin
              ? "bg-neutral-200 text-neutral-900 rounded-bl-sm"
              : "bg-blue-500 text-white rounded-br-sm"
          }
        `}
      >
        <p>{message}</p>

        {createdAt && (
          <span
            className={`
              block mt-1 text-[10px]
              ${isAdmin ? "text-neutral-500" : "text-blue-100"}
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
