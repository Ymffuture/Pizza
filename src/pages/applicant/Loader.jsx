const Loader = ({ size = 20, color = "#007aff" }) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    role="progressbar"
    aria-busy="true"
    className="animate-spin"
  >
    <circle
      cx="50"
      cy="50"
      r="40"
      fill="none"
      stroke={color}
      strokeWidth="6"
      strokeLinecap="round"
      strokeDasharray="1, 200"
      strokeDashoffset="0"
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

    <circle cx="50" cy="50" r="8" fill={color}>
      <animate
        attributeName="r"
        values="8;12;8"
        dur="1.5s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        values="1;0.5;1"
        dur="1.5s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);

export default Loader;
