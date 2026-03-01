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
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        position: fullScreen ? "fixed" : "relative",
        inset: fullScreen ? 0 : "auto",
        zIndex: fullScreen ? 9999 : "auto",
        backdropFilter: fullScreen ? "blur(8px) saturate(180%)" : "none",
        WebkitBackdropFilter: fullScreen ? "blur(8px) saturate(180%)" : "none",
        background: fullScreen ? "rgba(255, 255, 255, 0.7)" : "transparent",
        animation: fullScreen ? "fadeIn 0.3s ease-out" : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {renderSpinner()}
        
        {showText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#666",
              letterSpacing: "0.5px",
            }}
          >
            <span
              style={{
                background: `linear-gradient(135deg, ${color}, ${secondaryColor})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {text}
            </span>
            <span style={{ display: "flex" }}>
              <span style={dotStyle(0)}>.</span>
              <span style={dotStyle(1)}>.</span>
              <span style={dotStyle(2)}>.</span>
            </span>
          </motion.div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @media (prefers-color-scheme: dark) {
          .spinner-fullscreen {
            background: rgba(0, 0, 0, 0.6) !important;
          }
        }
      `}</style>
    </div>
  );
};

const dotStyle = (index) => ({
  animation: "bounce 1.4s infinite ease-in-out both",
  animationDelay: `${-0.32 + index * 0.16}s`,
  display: "inline-block",
});

// Apple-style radial spinner - FIXED
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
              width: size * 0.1,
              height: size * 0.3,
              marginLeft: -(size * 0.05),
              marginTop: -(size * 0.15),
              transformOrigin: "center center",
              transform: `rotate(${rotation}deg) translateY(-${size * 0.25}px)`,
            }}
          >
            <motion.div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: size * 0.02,
                background: `linear-gradient(to bottom, ${color}, ${secondaryColor})`,
                boxShadow: `0 0 ${size * 0.1}px ${color}60`,
              }}
              initial={{ opacity: 0.2 }}
              animate={{ opacity: [0.2, 1, 0.2] }}
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
          width: size * 0.3,
          height: size * 0.3,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}40, transparent)`,
          filter: "blur(10px)",
        }}
      />
    </div>
  );
};

// Pulsing rings - FIXED
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
          width: size * (0.6 + i * 0.2),
          height: size * (0.6 + i * 0.2),
          marginLeft: -(size * (0.3 + i * 0.1)),
          marginTop: -(size * (0.3 + i * 0.1)),
          borderRadius: "50%",
          border: `${size * 0.03}px solid ${i === 0 ? color : secondaryColor}`,
          opacity: 0.6 - (i * 0.2),
        }}
        animate={{
          scale: [1, 1.5, 1.5],
          opacity: [0.6 - (i * 0.2), 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: i * 0.4,
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
        width: size * 0.25,
        height: size * 0.25,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${color}, ${secondaryColor})`,
        boxShadow: `0 0 ${size * 0.3}px ${color}80`,
      }}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

// Orbiting dots - FIXED
const OrbitSpinner = ({ size, color, secondaryColor }) => {
  const orbits = [
    { radius: 0.35, speed: 3, size: 0.12, color: color },
    { radius: 0.25, speed: 2, size: 0.1, color: secondaryColor },
    { radius: 0.15, speed: 1.5, size: 0.08, color: color },
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
            border: `1px solid ${orbit.color}20`,
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
              boxShadow: `0 0 ${size * 0.15}px ${orbit.color}80`,
              transform: `translateX(${size * orbit.radius}px)`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

// Morphing shapes - FIXED
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
        boxShadow: `0 0 ${size * 0.4}px ${color}50, inset 0 0 ${size * 0.2}px rgba(255,255,255,0.3)`,
      }}
      animate={{
        borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "70% 30% 30% 70% / 70% 70% 30% 30%", "30% 70% 70% 30% / 30% 30% 70% 70%"],
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
        width: size * 0.5,
        height: size * 0.5,
        marginLeft: -(size * 0.25),
        marginTop: -(size * 0.25),
        borderRadius: "50%",
        background: "rgba(255,255,255,0.25)",
        backdropFilter: "blur(4px)",
        border: "1px solid rgba(255,255,255,0.3)",
      }}
      animate={{
        rotate: [360, 0],
        scale: [0.8, 1, 0.8],
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
