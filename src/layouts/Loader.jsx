const Loader = () => (
    <div className="flex items-center justify-center">
      <svg width="30" height="30" viewBox="0 0 100 100" className="animate-spin text-gray-300 dark:text-gray-700">
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" strokeDasharray="250" strokeDashoffset="190" />
        <circle cx="50" cy="50" r="10" fill="#00E5FF">
          <animate attributeName="r" values="10;14;10" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.6;1" dur="1.6s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );

export default Loader;
