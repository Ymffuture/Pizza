import { useNavigate } from "react-router-dom";

export default function SwiftMetaLogo() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/")}
      className="cursor-pointer select-none"
      aria-label="swiftMeta home"
    >
      <svg
        width="190"
        height="48"
        viewBox="0 0 460 100"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-[1.03]"
      >
        <defs>
          {/* Gradient for swift */}
          <linearGradient id="swiftGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          {/* Soft glow */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* swift */}
        <text
          x="0"
          y="70"
          fill="url(#swiftGradient)"
          fontSize="64"
          fontWeight="700"
          letterSpacing="0.8"
          style={{
            fontFamily:
              "Inter, system-ui, -apple-system, BlinkMacSystemFont",
          }}
          filter="url(#softGlow)"
        >
          swift
        </text>

        {/* Meta (same word, visual contrast) */}
        <text
          x="190"
          y="70"
          fill="currentColor"
          fontSize="64"
          fontWeight="800"
          letterSpacing="0.6"
          style={{
            fontFamily:
              "Space Grotesk, system-ui, -apple-system, BlinkMacSystemFont",
          }}
          className="text-gray-800 dark:text-gray-200"
        >
          Meta
        </text>
      </svg>
    </div>
  );
}
