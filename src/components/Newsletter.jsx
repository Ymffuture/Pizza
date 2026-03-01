import React, {
  useEffect,
  useReducer,
  useTransition,
  useCallback,
  useId,
  useMemo,
  useState,
} from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  AlertCircle, 
  TriangleAlert, 
  Info,
  Send,
  Clock,
  Mail,
  User,
  MessageSquare,
  Ticket,
  ArrowRight,
  Sparkles
} from "lucide-react";
import {Link} from "react-router-dom";

/* ----------------------------------
   STATE MANAGEMENT
----------------------------------- */

const initialState = {
  form: { name: "", email: "", message: "" },
  status: "idle",
  message: "",
  cooldown: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, form: { ...state.form, [action.field]: action.value } };
    case "LOADING":
      return { ...state, status: "loading", message: "" };
    case "SUCCESS":
      return {
        ...state,
        status: "success",
        message: action.message,
        form: initialState.form,
      };
    case "ERROR":
      return { ...state, status: "error", message: action.message };
    case "SET_COOLDOWN":
      return { ...state, cooldown: action.value };
    case "TICK":
      return { ...state, cooldown: Math.max(0, state.cooldown - 1) };
    default:
      return state;
  }
}

/* ----------------------------------
   ENHANCED LOADER COMPONENTS
----------------------------------- */

const ModernSpinner = () => (
  <div className="relative w-5 h-5">
    <div className="absolute inset-0 rounded-full border-2 border-white/30" />
    <div className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin" />
  </div>
);

const ProgressLiner = ({ isActive }) => {
  if (!isActive) return null;
  
  return (
    <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-800 overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ 
          repeat: Infinity, 
          duration: 1.5, 
          ease: "linear" 
        }}
      />
    </div>
  );
};

/* ----------------------------------
   SMART INPUT COMPONENTS
----------------------------------- */

const SmartInput = ({ 
  label, 
  icon: Icon, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  delay = 0 
}) => {
  const id = useId();
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="relative"
    >
      <label 
        htmlFor={id} 
        className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
      >
        <div className={`p-1.5 rounded-lg transition-colors ${isFocused ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
          <Icon size={14} />
        </div>
        {label}
      </label>
      
      <div className="relative group">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full h-14 px-5 rounded-2xl
            border-2 transition-all duration-300
            bg-white dark:bg-gray-900/50
            text-gray-900 dark:text-white
            placeholder:text-gray-400
            focus:outline-none
            ${isFocused 
              ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }
            ${hasValue && !isFocused && 'border-green-200 dark:border-green-900/30'}
          `}
        />
        
        {/* Status indicator */}
        <AnimatePresence>
          {hasValue && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <CheckCircle size={18} className="text-green-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const SmartTextarea = ({ 
  label, 
  icon: Icon, 
  value, 
  onChange, 
  placeholder, 
  delay = 0 
}) => {
  const id = useId();
  const [isFocused, setIsFocused] = useState(false);
  const charCount = value.length;
  const maxChars = 500;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="relative"
    >
      <div className="flex items-center justify-between mb-2">
        <label 
          htmlFor={id} 
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
        >
          <div className={`p-1.5 rounded-lg transition-colors ${isFocused ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
            <Icon size={14} />
          </div>
          {label}
        </label>
        <span className={`text-xs transition-colors ${charCount > maxChars ? 'text-red-500' : 'text-gray-400'}`}>
          {charCount}/{maxChars}
        </span>
      </div>
      
      <textarea
        id={id}
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxChars))}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`
          w-full px-5 py-4 rounded-2xl
          border-2 transition-all duration-300
          bg-white dark:bg-gray-900/50
          text-gray-900 dark:text-white
          placeholder:text-gray-400
          focus:outline-none resize-none
          ${isFocused 
            ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }
        `}
      />
      
      {/* Progress bar for message length */}
      <div className="mt-2 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full rounded-full ${charCount > maxChars * 0.8 ? 'bg-amber-500' : 'bg-blue-500'}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((charCount / maxChars) * 100, 100)}%` }}
        />
      </div>
    </motion.div>
  );
};

/* ----------------------------------
   ALERT COMPONENTS
----------------------------------- */

const CooldownAlert = ({ seconds }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 flex items-center gap-4"
  >
    <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-800/50 flex items-center justify-center flex-shrink-0">
      <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400 animate-pulse" />
    </div>
    <div className="flex-1">
      <h4 className="font-semibold text-amber-900 dark:text-amber-100">Rate Limit Active</h4>
      <p className="text-sm text-amber-700 dark:text-amber-300">
        Please wait <strong>{formatTime(seconds)}</strong> before sending another message.
        This helps us prevent spam and ensure quality responses.
      </p>
    </div>
  </motion.div>
);

const StatusAlert = ({ status, message }) => {
  const configs = {
    success: {
      icon: CheckCircle,
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-800 dark:text-emerald-200",
      iconColor: "text-emerald-500"
    },
    error: {
      icon: AlertCircle,
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-800 dark:text-red-200",
      iconColor: "text-red-500"
    }
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`rounded-2xl border p-4 flex items-start gap-3 ${config.bg} ${config.border}`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
      <p className={`text-sm font-medium ${config.text}`}>{message}</p>
    </motion.div>
  );
};

/* ----------------------------------
   MAIN COMPONENT
----------------------------------- */

export default function Newsletter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isPending, startTransition] = useTransition();
  const [focusedField, setFocusedField] = useState(null);

  const { form, status, message, cooldown } = state;
  const isLoading = status === "loading" || isPending;

  // Initialize cooldown from localStorage
  useEffect(() => {
    const lastSent = localStorage.getItem("newsletter_last_sent");
    if (!lastSent) return;
    
    const diff = Math.floor((Date.now() - Number(lastSent)) / 1000);
    const remaining = 300 - diff; // 5 minutes
    
    if (remaining > 0) {
      dispatch({ type: "SET_COOLDOWN", value: remaining });
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const updateField = useCallback((field, value) => {
    dispatch({ type: "SET_FIELD", field, value });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (cooldown > 0) return;

    // Validation
    if (!form.name.trim()) {
      dispatch({ type: "ERROR", message: "Please enter your full name." });
      return;
    }
    if (!form.email.trim() || !form.email.includes('@')) {
      dispatch({ type: "ERROR", message: "Please enter a valid email address." });
      return;
    }
    if (!form.message.trim()) {
      dispatch({ type: "ERROR", message: "Please write a message before sending." });
      return;
    }

    dispatch({ type: "LOADING" });

    startTransition(async () => {
      try {
        await emailjs.send(
          "service_kw38oux",
          "template_etyg50k",
          {
            from_name: form.name,
            from_email: form.email,
            message: form.message,
          },
          "IolitXztFVvhZg6PX"
        );

        localStorage.setItem("newsletter_last_sent", Date.now().toString());
        
        dispatch({
          type: "SUCCESS",
          message: "✨ Message sent successfully! We'll get back to you soon.",
        });
        
        dispatch({ type: "SET_COOLDOWN", value: 300 }); // 5 minutes
      } catch (err) {
        dispatch({
          type: "ERROR",
          message: "Failed to send message. Please check your connection and try again.",
        });
      }
    });
  }, [form, cooldown]);

  const buttonText = useMemo(() => {
    if (isLoading) return "Sending...";
    if (cooldown > 0) return `Wait ${formatTime(cooldown)}`;
    return "Send Message";
  }, [isLoading, cooldown]);

  const isFormValid = form.name && form.email && form.message;

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-gray-950 dark:to-black py-20 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
            <Sparkles size={16} />
            <span>Get in Touch</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Let's Start a Conversation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            Have a project in mind or just want to say hello? We'd love to hear from you.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative bg-white dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-200 dark:border-gray-800 overflow-hidden"
        >
          <ProgressLiner isActive={isLoading} />
          
          <div className="p-8 sm:p-10 space-y-6">
            
            {/* Cooldown Alert */}
            <AnimatePresence>
              {cooldown > 0 && (
                <CooldownAlert seconds={cooldown} />
              )}
            </AnimatePresence>

            {/* Status Messages */}
            <AnimatePresence mode="wait">
              {message && (
                <StatusAlert status={status} message={message} />
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <SmartInput
                label="Full Name"
                icon={User}
                value={form.name}
                onChange={(v) => updateField("name", v)}
                placeholder="John Doe"
                delay={0.1}
              />
              
              <SmartInput
                label="Email Address"
                icon={Mail}
                type="email"
                value={form.email}
                onChange={(v) => updateField("email", v)}
                placeholder="john@example.com"
                delay={0.2}
              />
              
              <SmartTextarea
                label="Your Message"
                icon={MessageSquare}
                value={form.message}
                onChange={(v) => updateField("message", v)}
                placeholder="Tell us about your project, ask a question, or just say hi..."
                delay={0.3}
              />

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <button
                  type="submit"
                  disabled={isLoading || cooldown > 0 || !isFormValid}
                  className={`
                    w-full h-14 rounded-2xl text-base font-semibold
                    flex items-center justify-center gap-3
                    transition-all duration-300
                    ${cooldown > 0 
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' 
                      : isLoading
                        ? 'bg-blue-600 text-white cursor-wait'
                        : isFormValid
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]'
                          : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {isLoading ? (
                    <>
                      <ModernSpinner />
                      <span>Sending...</span>
                    </>
                  ) : cooldown > 0 ? (
                    <>
                      <Clock size={18} />
                      <span>{buttonText}</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={18} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </motion.div>
            </form>

            {/* Divider */}
            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white dark:bg-gray-900 text-sm text-gray-500 dark:text-gray-400">
                  Need faster support?
                </span>
              </div>
            </div>

            {/* Ticket CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800/50 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Ticket className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Create a Support Ticket
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    For technical issues, bug reports, or feature requests that need tracking.
                  </p>
                  <Link
                    to="/ticket"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors group"
                  >
                    Create Ticket
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>

        {/* Footer Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center space-y-2"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Typical response time: <span className="font-medium text-gray-700 dark:text-gray-300">24-48 hours</span>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Protected by reCAPTCHA and subject to the Privacy Policy and Terms of Service.
          </p>
        </motion.div>

      </div>
    </section>
  );
}

/* ----------------------------------
   UTILS
----------------------------------- */

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
