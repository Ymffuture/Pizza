import React, {
  useEffect,
  useReducer,
  useTransition,
  useCallback,
  useId,
  useMemo,
  useDeferredValue,
  useRef,
  useSyncExternalStore,
  Suspense,
  memo,
} from "react";
import emailjs from "@emailjs/browser";

/* ----------------------------------
   useFormStatus (client polyfill)
----------------------------------- */
function useFormStatus(status) {
  return {
    pending: status === "loading",
  };
}

/* ----------------------------------
   LOCAL STORAGE STORE (Correct sync)
----------------------------------- */
function subscribe(callback) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  return localStorage.getItem("newsletter_last_sent");
}

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
      return {
        ...state,
        form: { ...state.form, [action.field]: action.value },
      };
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
   COMPONENT
----------------------------------- */

export default function Newsletter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isPending, startTransition] = useTransition();
  const { pending } = useFormStatus(state.status);

  const abortRef = useRef(null);
  const emailKeyRef = useRef("IolitXztFVvhZg6PX");

  const deferredForm = {
    name: useDeferredValue(state.form.name),
    email: useDeferredValue(state.form.email),
    message: useDeferredValue(state.form.message),
  };

  const lastSent = useSyncExternalStore(subscribe, getSnapshot);

  /* ----------------------------------
     COOLDOWN INIT (sync-safe)
  ----------------------------------- */
  useEffect(() => {
    if (!lastSent) return;
    const diff = Math.floor((Date.now() - Number(lastSent)) / 1000);
    const remaining = 7200 - diff;
    if (remaining > 0) dispatch({ type: "SET_COOLDOWN", value: remaining });
  }, [lastSent]);

  /* ----------------------------------
     COOLDOWN TICK
  ----------------------------------- */
  useEffect(() => {
    if (state.cooldown <= 0) return;
    const timer = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(timer);
  }, [state.cooldown]);

  /* ----------------------------------
     HANDLERS
  ----------------------------------- */

  const updateField = useCallback((field, value) => {
    dispatch({ type: "SET_FIELD", field, value });
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (state.cooldown > 0) return;

      if (!state.form.name || !state.form.email || !state.form.message) {
        dispatch({ type: "ERROR", message: "Please fill in all fields." });
        return;
      }

      dispatch({ type: "LOADING" });

      abortRef.current?.abort();
      abortRef.current = new AbortController();

      startTransition(async () => {
        try {
          if (!navigator.onLine) {
            localStorage.setItem(
              "newsletter_offline_queue",
              JSON.stringify(state.form)
            );
            throw new Error("Offline");
          }

          await emailjs.send(
            "service_kw38oux",
            "template_etyg50k",
            deferredForm,
            emailKeyRef.current
          );

          localStorage.setItem(
            "newsletter_last_sent",
            Date.now().toString()
          );

          dispatch({
            type: "SUCCESS",
            message: "Message sent successfully. Thank you!",
          });

          dispatch({ type: "SET_COOLDOWN", value: 7200 });
        } catch (err) {
          dispatch({
            type: "ERROR",
            message:
              err.message === "Offline"
                ? "Offline — message queued."
                : "Failed to send message.",
          });
        }
      });
    },
    [state.form, state.cooldown, deferredForm]
  );

  /* ----------------------------------
     DERIVED UI
  ----------------------------------- */

  const buttonText = useMemo(() => {
    if (pending || isPending) return "Sending…";
    if (state.cooldown > 0) return `Wait ${formatTime(state.cooldown)}`;
    return "Send Message";
  }, [pending, isPending, state.cooldown]);

  /* ----------------------------------
     RENDER
  ----------------------------------- */

  return (
    <Suspense fallback={<div className="text-center py-20">Loading…</div>}>
      <section className="bg-[#f5f5f7] dark:bg-black py-24">
        <div className="max-w-3xl mx-auto px-8 py-16 rounded-[32px] bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-lg">
          <header className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
              Newsletter
            </p>
            <h2 className="text-4xl font-semibold">Stay Inspired</h2>
            <p className="text-gray-600 mt-2">
              Thoughtful updates — delivered occasionally.
            </p>
          </header>

          {state.message && (
            <div
              role="alert"
              className={`mb-6 rounded-xl px-4 py-3 ${
                state.status === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {state.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <MemoInputField
              label="Full Name"
              value={state.form.name}
              onChange={(v) => updateField("name", v)}
              placeholder="John Appleseed"
            />

            <MemoInputField
              label="Email Address"
              type="email"
              value={state.form.email}
              onChange={(v) => updateField("email", v)}
              placeholder="you@icloud.com"
            />

            <MemoTextareaField
              label="Message"
              value={state.form.message}
              onChange={(v) => updateField("message", v)}
              placeholder="Write something thoughtful…"
            />

            <button
              disabled={pending || state.cooldown > 0}
              className="w-full h-12 rounded-2xl bg-blue-600 text-white"
            >
              {buttonText}
            </button>
          </form>
        </div>
      </section>
    </Suspense>
  );
}

/* ----------------------------------
   MEMOIZED INPUTS
----------------------------------- */

const MemoInputField = memo(InputField);
const MemoTextareaField = memo(TextareaField);

/* ----------------------------------
   UTILS
----------------------------------- */

function formatTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h}h ${m}m ${s}s`;
}
