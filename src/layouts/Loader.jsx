import React from "react";

const Loader = () => {
  return (
    <div className="relative flex items-center gap-1 h-5">
      <span className="sr-only">AI reasoning</span>

      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className="ai-signal"
          style={{ "--i": i }}
        />
      ))}

      <style jsx>{`
        .ai-signal {
          width: 3px;
          height: 100%;
          background: linear-gradient(
            to top,
            transparent,
            #22d3ee,
            transparent
          );
          opacity: 0.6;
          transform-origin: center;
          animation:
            drift 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite,
            jitter 0.9s steps(2) infinite;
          animation-delay: calc(var(--i) * 0.12s);
        }

        @keyframes drift {
          0% {
            transform: scaleY(0.3);
            opacity: 0.3;
          }
          40% {
            transform: scaleY(1);
            opacity: 1;
          }
          70% {
            transform: scaleY(0.6);
            opacity: 0.5;
          }
          100% {
            transform: scaleY(0.3);
            opacity: 0.3;
          }
        }

        @keyframes jitter {
          0% {
            filter: blur(0);
          }
          50% {
            filter: blur(0.6px);
          }
          100% {
            filter: blur(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
