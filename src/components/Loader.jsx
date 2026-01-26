
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
  
  <circle
    cx="50"
    cy="50"
    r="40"
    fill="none"
    stroke="#1a73e8"
    stroke-width="6"
    stroke-linecap="round"
    stroke-dasharray="1, 200"
    stroke-dashoffset="0"
  >
    <animate
      attributeName="stroke-dasharray"
      values="1,200;90,200;1,200"
      dur="1.5s"
      repeatCount="indefinite"
    />
    <animate
      attributeName="stroke-dashoffset"
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
