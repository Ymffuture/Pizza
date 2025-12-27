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
import { CheckCircle, AlertCircle } from "lucide-react";

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
    const remaining = 7200/2 - diff;
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

          dispatch({ type: "SET_COOLDOWN", value: 7200/2 });
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
    if (status === "loading" || isPending) return "Sending";
    if (cooldown > 0) return `Wait ${formatTime(cooldown)}`;
    return "Send Message";
  }, [status, cooldown, isPending]);

  /* ----------------------------------
     RENDER
  ----------------------------------- */

  return (
    <section className="bg-[#f5f5f7] dark:bg-black py-24">
      <div className="max-w-3xl mx-auto px-8 py-16 rounded-[32px] bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-lg">
        <header className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-purple-500">
            Newsletter
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
              <AlertCircle size={18} />
              One submission every 1 hours
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
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {status === "success" ? <CheckCircle /> : <AlertCircle />}
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
          />
          <InputField
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(v) => updateField("email", v)}
            placeholder="you@icloud.com"
          />
          <TextareaField
            label="Message"
            value={form.message}
            onChange={(v) => updateField("message", v)}
            placeholder="Write something thoughtful…"
          />

          <button
            type="submit"
            disabled={status === "loading" || cooldown > 0}
            aria-busy={status === "loading"}
            className="w-full h-12 rounded-2xl text-lg font-medium bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 disabled:bg-gray-400 text-white transition flex items-center justify-center gap-2"
          >
            {(status === "loading" || isPending) && <Spinner />}
            {buttonText}
          </button>
        </form>
      </div>
    </section>
  );
}

/* ----------------------------------
   REUSABLE INPUTS
----------------------------------- */

function InputField({ label, type = "text", value, onChange, placeholder }) {
  const id = useId();
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full h-12 px-4 rounded-2xl
          border border-black/10 dark:border-white/10
          bg-white/80 dark:bg-white/5
          text-gray-900 dark:text-white
          placeholder:text-purple-400 dark:placeholder:text-purple-500
          focus:ring-4 focus:ring-purple-500/30
          outline-none transition
        "
      />
    </div>
  );
}

function TextareaField({ label, value, onChange, placeholder }) {
  const id = useId();
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
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
          placeholder:text-purple-400 dark:placeholder:text-purple-500
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
