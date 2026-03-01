import React from "react";
import { motion } from "framer-motion";

const CoolSpinner = ({
  size = 48,
  variant = "apple", // "apple", "pulse", "orbit", "morph"
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
      className={`spinner-container ${fullScreen ? "fullscreen" : ""}`}
    >
      <div className="spinner-content">
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

      <style jsx>{`
        .spinner-container {
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .fullscreen {
          position: fixed;
          inset: 0;
          z-index: 9999;
          backdrop-filter: blur(8px) saturate(180%);
          -webkit-backdrop-filter: blur(8px) saturate(180%);
          background: rgba(255, 255, 255, 0.7);
          animation: fadeIn 0.3s ease-out;
        }

        @media (prefers-color-scheme: dark) {
          .fullscreen {
            background: rgba(0, 0, 0, 0.6);
          }
        }

        .spinner-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .spinner-text {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          font-weight: 500;
          color: #666;
          letter-spacing: 0.5px;
        }

        .text-gradient {
          background: linear-gradient(135deg, ${color}, ${secondaryColor});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dots span {
          animation: bounce 1.4s infinite ease-in-out both;
          display: inline-block;
        }

        .dots span:nth-child(1) { animation-delay: -0.32s; }
        .dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
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

// Apple-style radial spinner with gradient
const AppleSpinnerCore = ({ size, color, secondaryColor }) => {
  const bars = 12;
  const radius = size * 0.4;

  return (
    <div className="apple-wrapper" style={{ width: size, height: size }}>
      {[...Array(bars)].map((_, i) => {
        const rotation = (i * 360) / bars;
        const delay = (i * 0.1) - 1.2;
        
        return (
          <motion.div
            key={i}
            className="apple-bar"
            initial={{ opacity: 0.1, scale: 0.8 }}
            animate={{ 
              opacity: [0.1, 1, 0.1],
              scale: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: delay,
              ease: "easeInOut"
            }}
            style={{
              position: "absolute",
              width: size * 0.08,
              height: size * 0.25,
              borderRadius: size * 0.04,
              background: `linear-gradient(180deg, ${color}, ${secondaryColor})`,
              left: "50%",
              top: "50%",
              marginLeft: -(size * 0.04),
              marginTop: -(size * 0.125),
              transformOrigin: `center ${radius}px`,
              transform: `rotate(${rotation}deg) translateY(-${radius * 0.6}px)`,
              boxShadow: `0 0 ${size * 0.15}px ${color}40`,
            }}
          />
        );
      })}
      
      {/* Center glow */}
      <div 
        className="center-glow"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: size * 0.2,
          height: size * 0.2,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}30, transparent)`,
          filter: "blur(8px)",
        }}
      />
    </div>
  );
};

// Pulsing rings
const PulseSpinner = ({ size, color, secondaryColor }) => (
  <div className="pulse-wrapper" style={{ width: size, height: size }}>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="pulse-ring"
        animate={{
          scale: [1, 1.5, 1.5],
          opacity: [0.8, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: i * 0.4,
          ease: "easeOut"
        }}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `${size * 0.03}px solid ${i === 0 ? color : secondaryColor}`,
          opacity: 0.8 - (i * 0.2),
        }}
      />
    ))}
    <motion.div
      className="pulse-core"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: size * 0.3,
        height: size * 0.3,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${color}, ${secondaryColor})`,
        boxShadow: `0 0 ${size * 0.3}px ${color}60`,
      }}
    />
  </div>
);

// Orbiting dots
const OrbitSpinner = ({ size, color, secondaryColor }) => {
  const orbitRadius = size * 0.35;
  
  return (
    <div className="orbit-wrapper" style={{ width: size, height: size }}>
      {/* Orbit rings */}
      <div 
        className="orbit-ring-1"
        style={{
          position: "absolute",
          inset: "10%",
          borderRadius: "50%",
          border: `1px solid ${color}20`,
        }}
      />
      <div 
        className="orbit-ring-2"
        style={{
          position: "absolute",
          inset: "25%",
          borderRadius: "50%",
          border: `1px solid ${secondaryColor}20`,
        }}
      />
      
      {/* Orbiting dots */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="orbit-dot"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: size * (0.15 - i * 0.02),
            height: size * (0.15 - i * 0.02),
            marginLeft: -(size * (0.075 - i * 0.01)),
            marginTop: -(size * (0.075 - i * 0.01)),
            borderRadius: "50%",
            background: i % 2 === 0 ? color : secondaryColor,
            boxShadow: `0 0 ${size * 0.2}px ${i % 2 === 0 ? color : secondaryColor}80`,
          }}
        >
          <motion.div
            style={{
              width: orbitRadius * (1 - i * 0.2),
              height: 2,
              background: i % 2 === 0 ? color : secondaryColor,
              position: "absolute",
              left: "50%",
              top: "50%",
              transformOrigin
