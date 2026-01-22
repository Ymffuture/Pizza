import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <span className="sr-only">AI is thinking</span>

      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-cyan-400 dark:bg-cyan-300 animate-ai-dot"
          style={{
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes ai-dot {
          0% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.4);
          }
          100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
        }

        .animate-ai-dot {
          animation: ai-dot 1.4s ease-in-out infinite;
          box-shadow: 0 0 12px rgba(34, 211, 238, 0.7);
        }
      `}</style>
    </div>
  );
};

export default Loader;
