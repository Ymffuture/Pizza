import React from "react";

const ProcessCard = ({ icon, title, desc }) => {
  return (
    <div className="relative group p-[2px] rounded-3xl isolate">
      {/* Soft animated glow */}
      <div
        className="
          absolute inset-0 rounded-3xl
          opacity-70 blur-xl
          animate-rotate
          pointer-events-none
        "
        style={{
          background:
            "conic-gradient(from var(--angle), #ff006e, #8b5cf6, #3b82f6, #10b981, #f59e0b, #ef4444, #ff006e)",
        }}
      />

      {/* Sharp animated border */}
      <div
        className="
          absolute inset-0 rounded-3xl
          animate-rotate
        "
        style={{
          background:
            "conic-gradient(from var(--angle), #ff006e, #8b5cf6, #3b82f6, #10b981, #f59e0b, #ef4444, #ff006e)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "2px",
        }}
      />

      {/* Card content */}
      <div
        className="
          relative h-full rounded-3xl p-8
          bg-white/70 dark:bg-white/5
          backdrop-blur-xl
          border border-gray-200/60 dark:border-white/10
          shadow-[0_8px_30px_rgba(0,0,0,0.08)]
          transition-all duration-500
          group-hover:-translate-y-1
          group-hover:shadow-[0_14px_50px_rgba(0,0,0,0.18)]
        "
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="
              p-6 rounded-2xl
              bg-gradient-to-br
              from-blue-500/10 to-purple-500/10
              dark:from-blue-400/10 dark:to-purple-400/10
              group-hover:from-blue-500/20
              group-hover:to-purple-500/20
              transition-all duration-500
            "
          >
            {icon}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
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
