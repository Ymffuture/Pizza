import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { 
  AlertTriangle, 
  Server, 
  Wrench, 
  Clock, 
  ChevronRight,
  Code2,
  Terminal,
  HelpCircle,
  AlertCircle,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer";
import { useState, useEffect } from "react";

// Service Alert Banner Component
const ServiceAlert = ({ onDismiss }) => {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simulate progress bar for visual effect
    const interval = setInterval(() => {
      setProgress(p => Math.max(0, p - 0.5));
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20 border border-amber-200 dark:border-amber-800 p-4 mb-6 shadow-lg"
    >
      {/* Progress bar at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-amber-200 dark:bg-amber-800">
        <motion.div 
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="relative flex items-start gap-4">
        {/* Animated Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center animate-pulse">
            <Server className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2 text-base">
              <Wrench className="w-4 h-4" />
              Service Temporarily Unavailable
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white animate-pulse">
              LIVE
            </span>
          </div>
          
          <p className="text-sm text-amber-800 dark:text-amber-200/90 mb-3 leading-relaxed">
            Our quiz service is currently experiencing technical difficulties. 
            Our <strong>best developers</strong> are actively working to restore full functionality. 
            We apologize for any inconvenience caused.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-xs text-amber-700 dark:text-amber-300/80">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Estimated resolution: <strong>2-4 hours</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Status: <strong>Investigating</strong>
            </span>
          </div>
          
          {/* Team indicator */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex -space-x-2">
              {['K', 'S', 'M'].map((initial, i) => (
                <div 
                  key={i} 
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white dark:border-gray-900 flex items-center justify-center text-[10px] text-white font-bold"
                >
                  {initial}
                </div>
              ))}
            </div>
            <span className="text-xs text-amber-600 dark:text-amber-400">
              3 senior engineers assigned
            </span>
          </div>
        </div>
        
        {/* Dismiss button */}
        <button 
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800 text-amber-600 dark:text-amber-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default function QuizQuestion({ q, selected, onAnswer }) {
  const [showAlert, setShowAlert] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!q) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Service Alert Banner */}
      <AnimatePresence>
        {showAlert && (
          <ServiceAlert onDismiss={() => setShowAlert(false)} />
        )}
      </AnimatePresence>

      {/* Question Header */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <HelpCircle className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 mb-2">
            <Code2 className="w-3 h-3" />
            {q.type?.toUpperCase() || "QUESTION"}
          </span>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white leading-relaxed">
            {q.question}
          </h2>
        </div>
      </div>

      {/* Code Block */}
      {q.code && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group rounded-2xl overflow-hidden bg-[#282c34] shadow-2xl shadow-black/20 border border-gray-700/50"
        >
          {/* Mac-style header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#21252b] border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="ml-3 text-xs font-mono text-gray-400 uppercase tracking-wider">
                {q.language || "javascript"}
              </span>
            </div>
            <span className="text-xs text-gray-500">Read-only</span>
          </div>
          
          {/* Code with horizontal scroll */}
          <div className="overflow-x-auto custom-scrollbar">
            <SyntaxHighlighter
              language={q.language || "javascript"}
              style={oneDark}
              customStyle={{ 
                margin: 0, 
                padding: "1.25rem",
                background: "transparent",
                fontSize: "0.875rem",
                lineHeight: "1.7",
                minWidth: "100%"
              }}
              showLineNumbers={true}
              lineNumberStyle={{
                minWidth: "2.5em",
                paddingRight: "1em",
                color: "#495162",
                textAlign: "right"
              }}
            >
              {q.code}
            </SyntaxHighlighter>
          </div>
        </motion.div>
      )}

      {/* Answer Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          <Terminal className="w-4 h-4" />
          <span>Your Answer</span>
          {selected !== undefined && selected !== null && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
            >
              Selected
            </motion.span>
          )}
        </div>

        {/* MCQ Options */}
        {q.type === "mcq" && Array.isArray(q.options) && (
          <div className="grid gap-3">
            {q.options.map((opt, index) => {
              const isSelected = selected === index;
              const letters = ["A", "B", "C", "D", "E", "F"];
              
              return (
                <motion.button
                  key={index}
                  type="button"
                  onClick={() => onAnswer(index)}
                  whileHover={{ scale: 1.01, x: 4 }}
                  whileTap={{ scale: 0.99 }}
                  className={`
                    relative w-full text-left p-4 rounded-xl border-2 transition-all duration-200
                    flex items-center gap-4 group
                    ${isSelected
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg shadow-indigo-500/10"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                    }
                  `}
                >
                  {/* Option Letter */}
                  <span className={`
                    flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors
                    ${isSelected
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600"
                    }
                  `}>
                    {letters[index]}
                  </span>
                  
                  {/* Option Text */}
                  <span className={`
                    flex-1 text-sm font-medium
                    ${isSelected ? "text-indigo-900 dark:text-indigo-100" : "text-gray-700 dark:text-gray-300"}
                  `}>
                    {opt}
                  </span>
                  
                  {/* Selection Indicator */}
                  <div className={`
                    flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                    ${isSelected
                      ? "border-indigo-500 bg-indigo-500"
                      : "border-gray-300 dark:border-gray-600"
                    }
                  `}>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-white"
                      />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Text Input */}
        {q.type === "output" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Terminal className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={selected ?? ""}
              placeholder="Enter your answer here..."
              onChange={(e) => onAnswer(e.target.value)}
              className="
                w-full pl-11 pr-4 py-4 rounded-xl 
                bg-white dark:bg-gray-800 
                border-2 border-gray-200 dark:border-gray-700 
                text-gray-900 dark:text-white 
                placeholder-gray-400
                focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10
                transition-all duration-200
                font-mono text-sm
              "
            />
          </motion.div>
        )}

        {/* Error State */}
        {!q.type && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Configuration Error
              </p>
              <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                Question type missing in quizzes.json. Please check the data structure.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
