import React from "react";

const AppleSpinner = ({
  size = 40,
  color = "rgba(0,122,255,0.6)",
  fullScreen = false,
}) => {
  const bars = Array.from({ length: 12 });

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`spinner-wrapper ${fullScreen ? "fullscreen" : ""}`}
    >
      <div
        className="apple-spinner"
        style={{ width: size, height: size }}
      >
        {bars.map((_, index) => {
          const rotate = index * 30;
          const delay = -(index * 0.1);

          return (
            <div
              key={index}
              style={{
                transform: `rotate(${rotate}deg) translateY(-${size}px)`,
                animationDelay: `${delay}s`,
                background: color,
                boxShadow: `0 0 6px ${color}`,
              }}
            />
          );
        })}
      </div>

      <style>{`
        .spinner-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* 🔥 Fullscreen Overlay */
        .fullscreen {
          position: fixed;
          inset: 0;
          z-index: 9999;

          display: flex;
          justify-content: center;
          align-items: center;

          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);

          background: rgba(255, 255, 255, 0.25);
          animation: fadeIn 0.25s ease-out;
        }

        @media (prefers-color-scheme: dark) {
          .fullscreen {
            background: rgba(0, 0, 0, 0.4);
          }
        }

        .apple-spinner {
          position: relative;
        }

        .apple-spinner div {
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${size * 0.18}px;
          height: ${size * 0.6}px;
          border-radius: 4px;
          transform-origin: center ${size * 0.12}px;
          opacity: 0;
          animation: appleFade 1.2s linear infinite;
        }

        @keyframes appleFade {
          0% { opacity: 1; }
          100% { opacity: 0.15; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AppleSpinner;
