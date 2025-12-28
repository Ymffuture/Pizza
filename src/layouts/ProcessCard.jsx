import React from "react";

const ProcessCard = ({ icon, title, desc }) => {
  return (
    <div className="group relative p-1 rounded-3xl">
      {/* Outer soft glow */}
      <div
        className="absolute inset-0 rounded-3xl opacity-70 blur-xl pointer-events-none"
        style={{
          background: `conic-gradient(from var(--angle), 
            #ff006e, #8b5cf6, #3b82f6, #10b981, #f59e0b, #ef4444, #ff006e)`,
          animation: "rotate 8s linear infinite",
        }}
      />

      {/* Sharp colorful border (using mask to show only the border area) */}
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          background: `conic-gradient(from var(--angle), 
            #ff006e, #8b5cf6, #3b82f6, #10b981, #f59e0b, #ef4444, #ff006e)`,
          mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          animation: "rotate 8s linear infinite",
        }}
      />

      {/* Main card content - your original glassmorphic style */}
      <div
        className="
          relative h-full p-8 rounded-3xl
          bg-white/60 dark:bg-white/5
          backdrop-blur-xl
          border border-gray-200/60 dark:border-white/10
          shadow-[0_8px_30px_rgb(0,0,0,0.06)]
          group-hover:shadow-[0_12px_45px_rgb(0,0,0,0.12)]
          transition-all duration-500
          group-hover:-translate-y-1 group-hover:scale-[1.02]
        "
      >
        {/* Icon container */}
        <div className="w-full flex items-center justify-center mb-6">
          <div
            className="
              p-6 rounded-2xl
              bg-gradient-to-br from-blue-500/10 to-purple-500/10
              dark:from-blue-400/10 dark:to-purple-400/10
              group-hover:from-blue-500/20 group-hover:to-purple-500/20
              transition-all duration-500 shadow-inner
            "
          >
            {icon}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
};

export default ProcessCard;
