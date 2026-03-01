import React from "react";
import { motion } from "framer-motion";

const CoolSpinner = ({
  size = 48,
  variant = "apple",
  color = "#007AFF",
  secondaryColor = "#5856D6",
  fullScreen = false,
  text = "Loading...",
  showText = true,
}) => {
  const renderSpinner = () => {
    switch (variant) {
      case "pulse":
        return <PulseSpinner size={size} color={color} secondaryColor={secondaryColor} />;
      case "orbit":
        return <OrbitSpinner size={size} color={color} secondaryColor={secondaryColor} />;
      case "morph":
        return <MorphSpinner size={size} color={color} secondaryColor={secondaryColor} />;
      case "apple":
      default:
        return <AppleSpinnerCore size={size} color={color} secondaryColor={secondaryColor} />;
    }
  };

  return (
    <div
      role="status"
      aria-label={text}
      className={fullScreen ? "spinner-fullscreen" : "spinner-inline"}
    >
      <div className="spinner-wrapper">
        {renderSpinner()}
        
        {showText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="spinner-text"
          >
            <span className="text-gradient">{text}</span>
            <span className="dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </motion.div>
        )}
      </div>

      <style>{`
        .spinner-fullscreen {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: center;
          backdrop-filter: blur(1px);
          -webkit-backdrop-filter: blur(1px);
          background: rgba(255, 255, 255, 0.4);
          animation: fadeIn 0.3s ease-out;
        }

        .spinner-inline {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .spinner-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 32px 48px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px) saturate(180%);
          -webkit-backdrop-filter: blur(12px) saturate(180%);
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06),
            0 0 0 1px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        @media (prefers-color-scheme: dark) {
          .spinner-fullscreen {
            background: rgba(0, 0, 0, 0.4);
          }
          .spinner-wrapper {
            background: rgba(30, 30, 30, 0.8);
            box-shadow: 
              0 4px 6px -1px rgba(0, 0, 0, 0.3),
              0 2px 4px -1px rgba(0, 0, 0, 0.2),
              0 0 0 1px rgba(255, 255, 255, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
        }

        .spinner-text {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          letter-spacing: 0.3px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .text-gradient {
          background: linear-gradient(135deg, ${color}, ${secondaryColor});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dots {
          display: flex;
          color: #9CA3AF;
        }

        .dots span {
          animation: bounce 1.4s infinite ease-in-out both;
          display: inline-block;
        }

        .dots span:nth-child(1) { animation-delay: -0.32s; }
        .dots span:nth-child(2) { animation-delay: -0.16s; }
        .dots span:nth-child(3) { animation-delay: 0s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

// Apple-style radial spinner
const AppleSpinnerCore = ({ size, color, secondaryColor }) => {
  const bars = 12;
  
  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
      }}
    >
      {[...Array(bars)].map((_, i) => {
        const rotation = (i * 360) / bars;
        const delay = i * 0.1;
        
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: size * 0.08,
              height: size * 0.25,
              marginLeft: -(size * 0.04),
              marginTop: -(size * 0.125),
              transformOrigin: "center center",
              transform: `rotate(${rotation}deg) translateY(-${size * 0.3}px)`,
            }}
          >
            <motion.div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: size * 0.02,
                background: `linear-gradient(to bottom, ${color}, ${secondaryColor})`,
                boxShadow: `0 0 ${size * 0.08}px ${color}40`,
              }}
              initial={{ opacity: 0.15 }}
              animate={{ opacity: [0.15, 1, 0.15] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut",
              }}
            />
          </div>
        );
      })}
      
      {/* Center glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: size * 0.25,
          height: size * 0.25,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}30, transparent 70%)`,
          filter: "blur(8px)",
        }}
      />
    </div>
  );
};

// Pulsing rings
const PulseSpinner = ({ size, color, secondaryColor }) => (
  <div
    style={{
      width: size,
      height: size,
      position: "relative",
    }}
  >
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: size * (0.5 + i * 0.25),
          height: size * (0.5 + i * 0.25),
          marginLeft: -(size * (0.25 + i * 0.125)),
          marginTop: -(size * (0.25 + i * 0.125)),
          borderRadius: "50%",
          border: `${size * 0.025}px solid ${i === 0 ? color : secondaryColor}`,
          opacity: 0.5 - (i * 0.15),
        }}
        animate={{
          scale: [1, 1.4, 1.4],
          opacity: [0.5 - (i * 0.15), 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: i * 0.3,
          ease: "easeOut",
        }}
      />
    ))}
    
    <motion.div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: size * 0.2,
        height: size * 0.2,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${color}, ${secondaryColor})`,
        boxShadow: `0 0 ${size * 0.25}px ${color}60`,
      }}
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

// Orbiting dots
const OrbitSpinner = ({ size, color, secondaryColor }) => {
  const orbits = [
    { radius: 0.4, speed: 3, size: 0.1, color: color },
    { radius: 0.28, speed: 2, size: 0.08, color: secondaryColor },
    { radius: 0.16, speed: 1.5, size: 0.06, color: color },
  ];
  
  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
      }}
    >
      {/* Orbit rings */}
      {orbits.map((orbit, i) => (
        <div
          key={`ring-${i}`}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: size * orbit.radius * 2,
            height: size * orbit.radius * 2,
            borderRadius: "50%",
            border: `1px solid ${orbit.color}15`,
          }}
        />
      ))}
      
      {/* Orbiting dots */}
      {orbits.map((orbit, i) => (
        <motion.div
          key={`dot-${i}`}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: size * orbit.size,
            height: size * orbit.size,
            marginLeft: -(size * orbit.size) / 2,
            marginTop: -(size * orbit.size) / 2,
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: orbit.speed,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: orbit.color,
              boxShadow: `0 0 ${size * 0.12}px ${orbit.color}60`,
              transform: `translateX(${size * orbit.radius}px)`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

// Morphing shapes
const MorphSpinner = ({ size, color, secondaryColor }) => (
  <div
    style={{
      width: size,
      height: size,
      position: "relative",
    }}
  >
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(135deg, ${color}, ${secondaryColor})`,
        boxShadow: `0 0 ${size * 0.35}px ${color}40, inset 0 0 ${size * 0.15}px rgba(255,255,255,0.2)`,
      }}
      animate={{
        borderRadius: ["25% 75% 75% 25% / 25% 25% 75% 75%", "75% 25% 25% 75% / 75% 75% 25% 25%", "25% 75% 75% 25% / 25% 25% 75% 75%"],
        rotate: [0, 180, 360],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    
    <motion.div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: size * 0.45,
        height: size * 0.45,
        marginLeft: -(size * 0.225),
        marginTop: -(size * 0.225),
        borderRadius: "50%",
        background: "rgba(255,255,255,0.2)",
        backdropFilter: "blur(4px)",
        border: "1px solid rgba(255,255,255,0.3)",
      }}
      animate={{
        rotate: [360, 0],
        scale: [0.85, 1, 0.85],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5,
      }}
    />
  </div>
);

export default CoolSpinner;
