import React, {
  useEffect,
  useReducer,
  useTransition,
  useCallback,
  useId,
  useMemo,
} from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, TriangleAlert, Info} from "lucide-react";
import { FiXCircle } from 'react-icons/fi';
import { FaAddressBook, FaEdit, FaEnvelope, FaUserAlt, FaUserAltSlash } from "react-icons/fa";
import { MdChatBubble } from "react-icons/md";
import {Link} from "react-router-dom" ;
/* ----------------------------------
   STATE MANAGEMENT (useReducer)
----------------------------------- */

const initialState = {
  form: {
    name: "",
    email: "",
    message: "",
  },
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
   SVG LOADER (Accessible)
----------------------------------- */
function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-white"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}


const Liner = ({
  height = 3,
  speed = 2,
  color = "#1a73e8",
  bgColor = "#e0e0e0",
  className = "",
}) => {
  return (
    <div
      className={`absolute left-0 right-0 -top-4 flex justify-center ${className}`}
    >
      <svg
        width="100%"
        height="30"
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        role="progressbar"
        aria-busy="true"
        className="max-w-full"
      >
        {/* Background line */}
        <rect
          x="0"
          y="9"
          width="100"
          height={height}
          fill={bgColor}
        />

        {/* Main animated bar */}
        <rect y="9" height={height} fill={color}>
          <animate
            attributeName="x"
            values="-40;100"
            dur={`${speed}s`}
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.2 1"
            keyTimes="0;1"
          />
          <animate
            attributeName="width"
            values="10;40;10"
            dur={`${speed}s`}
            repeatCount="indefinite"
            keyTimes="0;0.5;1"
            calcMode="spline"
            keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
          />
        </rect>

        {/* Secondary glow trail */}
        <rect y="9" height={height} fill={color} opacity="0.5">
          <animate
            attributeName="x"
            values="-60;100"
            dur={`${speed}s`}
            begin="0.8s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.2 1"
            keyTimes="0;1"
          />
          <animate
            attributeName="width"
            values="8;25;8"
            dur={`${speed}s`}
            begin="0.8s"
            repeatCount="indefinite"
            keyTimes="0;0.5;1"
            calcMode="spline"
            keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
          />
        </rect>
      </svg>
    </div>
  );
};


/* ----------------------------------
   COMPONENT
----------------------------------- */

export default function Newsletter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isPending, startTransition] = useTransition();

  const { form, status, message, cooldown } = state;

  const hasTyped = form.name || form.email || form.message;
  const showTypingWarning = hasTyped || cooldown > 0;

  /* ----------------------------------
     COOLDOWN INIT
  ----------------------------------- */
  useEffect(() => {
    const lastSent = localStorage.getItem("newsletter_last_sent");
    if (!lastSent) return;
    const diff = Math.floor((Date.now() - Number(lastSent)) / 1000);
    const remaining = 300 - diff;
    if (remaining > 0) dispatch({ type: "SET_COOLDOWN", value: remaining });
  }, []);

  /* ----------------------------------
     COOLDOWN TICK
  ----------------------------------- */
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  /* ----------------------------------
     HANDLERS
  ----------------------------------- */

  const updateField = useCallback((field, value) => {
    dispatch({ type: "SET_FIELD", field, value });
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (cooldown > 0) return;

      if (!form.name) {
        dispatch({ type: "ERROR", message: "Please fill in the name fields." });
        return;
      }
      if (!form.email) {
        dispatch({ type: "ERROR", message: "Please fill in the email fields." });
        return;
      }
      if (!form.message) {
        dispatch({ type: "ERROR", message: "Please fill in the message fields." });
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
            message: "Message sent successfully. Thank you!",
          });

          dispatch({ type: "SET_COOLDOWN", value: 500 });
        } catch {
          dispatch({
            type: "ERROR",
            message: "Failed to send message. Please try again later.",
          });
        }
      });
    },
    [form, cooldown]
  );

  /* ----------------------------------
     DERIVED UI
  ----------------------------------- */

  const buttonText = useMemo(() => {
    if (status === "loading" || isPending) return "";
    if (cooldown > 0) return `Wait ${formatTime(cooldown)}`;
    return "Email Us";
  }, [status, cooldown, isPending]);

  /* ----------------------------------
     RENDER
  ----------------------------------- */

  return (
    <section className="dark:bg-black py-24" >
    
   

      <div className="max-w-3xl mx-auto  px-8 py-16 rounded-[32px] dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 relative overflow-hidden" >
{(status === "loading" || isPending) && <Liner />}

        <header className="text-center mb-10">
          <p className="text-[16px] font-semibold uppercase tracking-widest text-gray-200">
            Newsletter / Subscriptions / Contact Us
          </p>
          <h2 className="text-4xl font-semibold text-gray-900 dark:text-white">
            Stay Inspired
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Thoughtful updates — delivered occasionally.
          </p>
        </header>

        <AnimatePresence>
          {showTypingWarning && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 rounded-xl px-4 py-3 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 flex gap-2"
            >
              <TriangleAlert size={22} />
              One submission every 5 mins
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 rounded-xl px-4 py-3 flex gap-2 ${
                status === "success"
                  ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-600"
                  : "bg-red-100 text-red-700/55 dark:bg-red-500/10 dark:text-red-600"
              }`}
            >
              {status === "success" ? <CheckCircle size={22}/> : <FiXCircle size={22}/>}
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Full Name"
            value={form.name}
            onChange={(v) => updateField("name", v)}
            placeholder="John Appleseed"
            icon={ <FaUserAlt size={18} className='text-gray-600' />}
         
          />
          <InputField
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(v) => updateField("email", v)}
            placeholder="you@icloud.com"
            icon={ <FaEnvelope size={18} className='text-gray-600'/>}
          />
          <TextareaField
            label="Message"
            value={form.message}
            onChange={(v) => updateField("message", v)}
            placeholder="Write something thoughtful…"
                 icon={ <MdChatBubble size={18} className='text-gray-600'/>}
          />

          <button
            type="submit"
            disabled={status === "loading" || cooldown > 0}
            aria-busy={status === "loading"}
            className="w-full h-12 rounded-2xl text-lg font-medium bg-gray-800 hover:bg-purple-700 dark:bg-gray-800 dark:hover:bg-gray-600 disabled:bg-gray-400 text-white transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {(status === "loading" || isPending) && <Spinner />}
            {buttonText}
          </button>
        </form>

        {/* Divider */}
<div className="relative my-8">
  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent" />
  <span className="absolute left-1/2 -translate-x-1/2 -top-3 px-3 text-xs text-gray-400 dark:text-gray-500 bg-white/5 dark:bg-black backdrop-blur-xl">
    OR
  </span>
</div>

{/* Create Ticket Section */}
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
  className="
    rounded-2xl
    border border-black/10 dark:border-white/10
    bg-white/60 dark:bg-white/5
    backdrop-blur-md
    p-5
    space-y-3
  "
>
  <div className="flex items-start gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
      🎫
    </div>

    <div className="flex-1">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
        Create a Support Ticket
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        Best for technical issues, bugs, or requests that need tracking and
        faster follow-up.
      </p>
    </div>
  </div>

  <div className="flex items-center justify-between flex-wrap gap-3">
    <p className="text-xs text-gray-500 dark:text-gray-500 flex gap-2">
    <Info className="text-gray-600 dark:text-white" size={16} /> You’ll receive a ticket ID and status updates.
    </p>
<br/>
    <Link
      to="/ticket"
      className="
        inline-flex items-center gap-2
        px-4 py-2
        rounded-xl
        text-sm font-medium
        bg-purple-600 text-white
        hover:bg-purple-700
        transition
        hover:scale-[1.03]
        active:scale-100
        shadow-sm
      "
    >
      Create Ticket
      <span aria-hidden>→</span>
    </Link>
  </div>
</motion.div>

      </div>
    </section>
  );
}

/* ----------------------------------
   REUSABLE INPUTS
----------------------------------- */

function InputField({ label, type = "text", value, onChange, placeholder,icon }) {
  const id = useId();
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300 flex gap-3">
       {icon} {label}
      </label>
      <input
        id={id}
        
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full h-12 px-4 rounded-2xl
          border border-black/10 dark:border-white/10
          bg-white/80 dark:bg-white/5
          text-gray-900 dark:text-white
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          focus:ring-4 focus:ring-purple-500/30
          outline-none transition 
        `}
      />
    </div>
  );
}

function TextareaField({ label, value, onChange, placeholder,icon }) {
  const id = useId();
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300 flex gap-3">
        {icon} {label}
      </label>
      <textarea
        id={id}
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full px-4 py-3 rounded-2xl
          border border-black/10 dark:border-white/10
          bg-white/80 dark:bg-white/5
          text-gray-900 dark:text-white
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          focus:ring-4 focus:ring-purple-500/30
          outline-none transition resize-none
        "
      />
    </div>
  );
}

/* ----------------------------------
   UTILS
----------------------------------- */

function formatTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h ? h + "h " : ""}${m}m ${s}s`;
}
