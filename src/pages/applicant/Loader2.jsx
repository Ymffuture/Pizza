import React from "react";

const AppleSpinner = ({
  size = 32,
  color = "rgba(0,122,255,0.4)",
  fullScreen = false,
}) => {
  const bars = Array.from({ length: 12 });

  return (
    <div
      role="status"
      aria-label="Loading"
      className={fullScreen ? "spinner-wrapper fullscreen" : "spinner-wrapper"}
      style={{ width: size, height: size }}
    >
      <div className="apple-spinner" style={{ width: size, height: size }}>
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
                boxShadow: `0 0 4px ${color}`,
              }}
            />
          );
        })}
      </div>

      <style jsx>{`
        .spinner-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .fullscreen {
          height: 100vh;
          width: 100vw;
          background: #fff;
        }

        .apple-spinner {
          position: relative;
        }

        .apple-spinner div {
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${size * 0.17}px;
          height: ${size * 0.62}px;
          border-radius: 3px;
          transform-origin: center ${size * 0.12}px;
          opacity: 0;
          animation: appleFade 1.2s linear infinite;
        }

        @keyframes appleFade {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0.15;
          }
        }
      `}</style>
    </div>
  );
};

export default AppleSpinner;
