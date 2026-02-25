import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import appAnimation from "../assets/app.json";

const googlePlayIcon =
  "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg";

const GetApp = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };

    const section = document.getElementById("get-app-section");
    if (section) {
      section.addEventListener("mousemove", handleMouseMove);
      return () => section.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return (
    <section 
      id="get-app-section"
      className="py-24 dark:bg-black transition-all duration-500 relative overflow-hidden"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-indigo-950/20 dark:via-black dark:to-purple-950/20 opacity-0 animate-fade-in" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div
          className={`
            rounded-[2.5rem]
            bg-white/80 dark:bg-[#0a0a0a]/80
            backdrop-blur-2xl
            border border-white/20 dark:border-white/10
            shadow-[0_8px_32px_rgba(0,0,0,0.04)]
            dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
            p-8 md:p-16
            grid md:grid-cols-2 gap-12 md:gap-20
            relative overflow-hidden
            transform transition-all duration-1000 ease-out
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
          `}
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)`,
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />

          {/* Content */}
          <div className="relative flex flex-col justify-center z-10 space-y-8">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                Our Application
              </span>
            </div>

            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-[1.1] tracking-tight">
                A Smarter Way to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  Connect
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
                Stay close to the developer — explore ideas, updates, and insights in one elegant experience.
              </p>
            </div>

            {/* Enhanced button with glow */}
            <div className="flex items-center pt-4">
              <button
                disabled
                className="
                  group relative
                  opacity-90 dark:opacity-80 
                  cursor-not-allowed
                  transition-all duration-300
                  hover:opacity-100 hover:scale-105
                "
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                <img
                  src={googlePlayIcon}
                  alt="Google Play Store"
                  className="h-14 md:h-12 object-contain drop-shadow-lg relative z-10"
                />
              </button>
              
              <div className="ml-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                <div className="flex -space-x-2">
                  {[1,2,3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 border-2 border-white dark:border-[#0a0a0a]" />
                  ))}
                </div>
                <span>Join 10K+ users</span>
              </div>
            </div>
          </div>

          {/* Enhanced Lottie container with 3D tilt */}
          <div className="relative flex justify-center items-center z-10 perspective-1000">
            <div
              className="
                relative
                w-[280px] md:w-[360px] lg:w-[440px]
                transform
                transition-all duration-500 ease-out
                hover:rotate-y-6 hover:rotate-x-6
                group
              "
              style={{
                transform: `rotateY(${(mousePosition.x - 0.5) * 10}deg) rotateX(${(mousePosition.y - 0.5) * -10}deg)`,
              }}
            >
              {/* Glow behind device */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-[2.5rem] blur-3xl scale-110 group-hover:scale-125 transition-transform duration-700" />
              
              {/* Device frame */}
              <div className="
                relative
                rounded-[2.5rem]
                bg-gradient-to-br from-gray-100/50 to-white/50 
                dark:from-gray-800/50 dark:to-gray-900/50
                backdrop-blur-xl
                border border-white/30 dark:border-white/10
                shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]
                dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]
                p-6
                overflow-hidden
              ">
                {/* Screen reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
                
                <Lottie
                  animationData={appAnimation}
                  loop
                  autoplay
                  speed={0.5}
                  rendererSettings={{
                    preserveAspectRatio: "xMidYMid meet",
                    progressiveLoad: true,
                  }}
                  className="w-full h-full scale-110 drop-shadow-2xl"
                />
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl rotate-12 opacity-80 blur-sm animate-bounce delay-700" />
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full opacity-60 blur-sm animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
};

export default GetApp;
