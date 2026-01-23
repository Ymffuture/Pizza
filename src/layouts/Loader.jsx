import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-cyan-400 dark:bg-cyan-300 animate-ai-bounce"
          style={{
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes ai-bounce {
          0%, 80%, 100% {
            opacity: 0.5;
            transform: scale(0.8) translateY(0);
          }
          40% {
            opacity: 1;
            transform: scale(1.2) translateY(-15px);
          }
        }

        .animate-ai-bounce {
          animation: ai-bounce 1.2s ease-in-out infinite;
          box-shadow: 0 0 12px rgba(34, 211, 238, 0.7);
        }
      `}</style>
    </div>
  );
};

export default Loader;
