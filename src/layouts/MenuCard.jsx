
import React, { useRef, useState, useEffect } from "react";

const MenuCard = ({ name, price, tag, image, index = 0 }) => {
  const cardRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({});
  const [isHover, setIsHover] = useState(false);

  // Mouse move handler for 3D tilt
  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element.
    const y = e.clientY - rect.top; // y position within the element.
    const px = (x / rect.width) * 2 - 1; // -1 .. 1
    const py = (y / rect.height) * 2 - 1; // -1 .. 1

    const rotateY = px * 8; // tilt intensity X (left/right)
    const rotateX = -py * 8; // tilt intensity Y (up/down)
    const translateZ = 12; // pop-out effect

    setTiltStyle({
      transform: `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${isHover ? translateZ : 0}px)`,
      transition: "transform 120ms linear",
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
      transition: "transform 400ms cubic-bezier(.2,.8,.2,1)",
    });
    setIsHover(false);
  };

  // When pointer enters, enable pop
  const handleMouseEnter = () => {
    setIsHover(true);
  };

  // accessible keyboard focus tilt (small)
  const handleFocus = () => {
    setTiltStyle({
      transform: "perspective(1100px) rotateX(-4deg) rotateY(4deg) translateZ(8px)",
      transition: "transform 240ms ease",
    });
  };
  const handleBlur = () => handleMouseLeave();

  // image load handler
  const onImgLoad = () => setIsLoaded(true);

  // Fade-in stagger (uses style prop animationDelay)
  const fadeDelay = `${index * 80}ms`;

  return (
    <>
      {/* local keyframes + small helper CSS injected inline to avoid global file edits */}
      <style>{`
        @keyframes floatTag {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }
        @keyframes cardFadeIn {
          0% { opacity: 0; transform: translateY(8px) scale(0.995); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={0}
        role="button"
        aria-label={`${name} — ${price}`}
        style={{
          ...tiltStyle,
          willChange: "transform",
          // staggered fade-in animation
          animation: `cardFadeIn 420ms ease forwards`,
          animationDelay: fadeDelay,
        }}
        className={`
          group
          relative
          w-full
          rounded-3xl
          overflow-hidden
          transition-shadow duration-300
          focus:outline-none focus:ring-4 focus:ring-sky-300/30
          `}
      >
        {/* Card background + glassmorphism container */}
        <div
          className={`
            bg-white/60 dark:bg-black/60
            backdrop-blur-md
            border border-white/20 dark:border-white/6
            shadow-md hover:shadow-2xl
            rounded-3xl
            overflow-hidden
            w-full
          `}
        >
          {/* IMAGE / SKELETON */}
          <div className="relative w-full">
            {!isLoaded && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse"
                style={{ height: 288 }}
                aria-hidden="true"
              >
                <div className="w-3/5 h-3/5 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              </div>
            )}

            <img
              src={image}
              alt={name}
              onLoad={onImgLoad}
              decoding="async"
              className={`
                w-full object-cover
                ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}
                transition-all duration-700 ease-out
                h-72 md:h-80 lg:h-96
              `}
              style={{ display: isLoaded ? "block" : "block" }}
            />

            {/* Floating tag (top-left) */}
            {tag && (
              <div
                className="
                  absolute top-5 left-5 z-20
                  px-3 py-1 rounded-full
                  text-xs font-semibold
                  text-white
                  shadow
                "
                style={{
                  background:
                    "linear-gradient(90deg, rgba(59,130,246,1) 0%, rgba(99,102,241,1) 100%)",
                  animation: "floatTag 3.2s ease-in-out infinite",
                }}
                aria-hidden="true"
              >
                {tag}
              </div>
            )}

            {/* Premium Badge (top-right) */}
            <div
              className="absolute top-4 right-4 z-20 px-2 py-1 rounded-md text-xs font-semibold text-white"
              style={{
                background:
                  price?.toLowerCase?.().includes("from") || price?.toLowerCase?.().includes("r")
                    ? "linear-gradient(90deg,#ef4444,#f97316)"
                    : "linear-gradient(90deg,#06b6d4,#3b82f6)",
                boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
                transform: "translateZ(40px)",
              }}
            >
              {price}
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-6 md:p-7">
            <h3
              className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
              style={{ transform: "translateZ(30px)" }}
            >
              {name}
            </h3>

            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
              {/* simple placeholder description — you can pass a desc prop if needed */}
              High-quality, production-ready websites tailored to your business needs.
            </p>

            <div className="flex items-center justify-between gap-3">
              <button
                className="
                  inline-flex items-center gap-2 px-4 py-2 rounded-full
                  bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-medium
                  hover:from-sky-600 hover:to-blue-700
                  shadow-md
                  transition
                "
                aria-label={`Contact about ${name}`}
              >
                Contact
              </button>

              <button
                className="
                  inline-flex items-center gap-2 px-3 py-2 rounded-full
                  border border-gray-200 dark:border-gray-700 text-sm font-medium
                  text-gray-700 dark:text-gray-200 hover:text-blue-600
                  transition
                "
              >
                Quick Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuCard;
