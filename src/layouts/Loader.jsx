import React from "react";

const Loader = () => {
  return (
    <div className="relative flex items-center justify-center w-16 h-16">
      <span className="sr-only">AI is thinking</span>

      {/* Core */}
      <div className="ai-core" />

      {/* Orbiting nodes */}
      {[...Array(6)].map((_, i) => (
        <span
          key={i}
          className="ai-node"
          style={{
            "--i": i,
          }}
        />
      ))}

      {/* Pulse ring */}
      <span className="ai-wave" />

      <style jsx>{`
        :root {
          --ai-color: rgb(34, 211, 238);
        }

        .ai-core {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--ai-color);
          box-shadow: 0 0 18px var(--ai-color);
          animation: core-pulse 1.8s ease-in-out infinite;
          z-index: 2;
        }

        .ai-node {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--ai-color);
          opacity: 0.8;
          transform-origin: center 28px;
          animation: orbit 2.4s linear infinite,
            flicker 1.6s ease-in-out infinite;
          animation-delay: calc(var(--i) * 0.15s);
        }

        .ai-wave {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid var(--ai-color);
          opacity: 0;
          animation: wave 2s ease-out infinite;
        }

        @keyframes orbit {
          from {
            transform: rotate(calc(var(--i) * 60deg)) translateY(-28px);
          }
          to {
            transform: rotate(calc(var(--i) * 60deg + 360deg))
              translateY(-28px);
          }
        }

        @keyframes flicker {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(0.9);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes core-pulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 18px var(--ai-color);
          }
          50% {
            transform: scale(1.35);
            box-shadow: 0 0 30px var(--ai-color);
          }
        }

        @keyframes wave {
          0% {
            transform: scale(0.4);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
