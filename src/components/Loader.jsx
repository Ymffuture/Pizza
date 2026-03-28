// ✅ FIX: All SVG attributes converted from HTML kebab-case to JSX camelCase.
// React silently ignores kebab-case SVG props, so the spinner was rendering
// as a static circle with no animation.
//
// Changed:
//   stroke-width        → strokeWidth
//   stroke-linecap      → strokeLinecap
//   stroke-dasharray    → strokeDasharray
//   stroke-dashoffset   → strokeDashoffset

const Loader = () => (
  <div className="flex flex-col items-center justify-center min-h-[120px] bg-transparent overflow-hidden">
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      role="progressbar"
      aria-busy="true"
    >
      {/* Spinning arc */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="#1a73e8"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="1, 200"
        strokeDashoffset="0"
      >
        <animate
          attributeName="strokeDasharray"
          values="1,200;90,200;1,200"
          dur="1.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="strokeDashoffset"
          values="0;-40;-120"
          dur="1.5s"
          repeatCount="indefinite"
        />
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Pulsing centre dot */}
      <circle cx="50" cy="50" r="8" fill="#1a73e8">
        <animate
          attributeName="r"
          values="8;12;8"
          dur="1.5s"
          repeatCount="indefinite"
          keySplines="0.4 0 0.2 1"
          calcMode="spline"
        />
        <animate
          attributeName="opacity"
          values="1;0.5;1"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>

    <p className="text-gray-800 dark:text-gray-400 mt-3 text-sm tracking-wide">
      Loading Blogs...
    </p>
  </div>
);

export default Loader;
