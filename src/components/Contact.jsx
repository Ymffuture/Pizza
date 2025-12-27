// src/pages/Contact.jsx
import React, {
  useEffect,
  useReducer,
  useRef,
  useTransition,
  useCallback,
  useId,
  useMemo,
  useDeferredValue,
} from "react";
import { Helmet } from "react-helmet";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Linkedin,
  Twitter,
  Github,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

/**
 * Contact page - SwiftMeta style
 * - Modern hooks: useTransition, useDeferredValue, useRef, useId
 * - Top form status (success/error) - animated UX
 * - SVG spinner in submit button
 * - Offline queue (localStorage) + auto-flush on reconnect
 * - Accessible labels, aria-live, honeypot for spam
 * - Dark-mode + purple placeholders
 *
 * Wire the form to /api/contact (POST) that accepts JSON:
 * { name, email, subject, message }
 *
 * If /api/contact is not available, the message will be queued locally
 * and retried when the user comes back online.
 */

/* ---------------------------
   Reducer - form & status
   --------------------------- */
const initialState = {
  form: { name: "", email: "", subject: "", message: "" },
  status: "idle", // idle | loading | success | error
  statusMessage: "",
  cooldown: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, form: { ...state.form, [action.field]: action.value } };
    case "LOADING":
      return { ...state, status: "loading", statusMessage: "" };
    case "SUCCESS":
      return { ...state, status: "success", statusMessage: action.message, form: initialState.form };
    case "ERROR":
      return { ...state, status: "error", statusMessage: action.message };
    case "RESET_STATUS":
      return { ...state, status: "idle", statusMessage: "" };
    default:
      return state;
  }
}

/* ---------------------------
   Small components (memoized)
   --------------------------- */

const InfoCard = React.memo(function InfoCard({ icon: Icon, title, children }) {
  return (
    <div className="bg-white/75 dark:bg-white/5 border border-black/5 dark:border-white/8 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-md bg-sky-50 dark:bg-sky-900/20">
          <Icon className="text-sky-600" />
        </div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{title}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{children}</div>
        </div>
      </div>
    </div>
  );
});

/* Simple accessible spinner used inside submit button */
function ButtonSpinner({ className = "h-5 w-5" }) {
  return (
    <svg className={className + " animate-spin"} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" fill="none"></circle>
      <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" opacity="0.8"></path>
    </svg>
  );
}

/* ---------------------------
   Contact page
   --------------------------- */

export default function Contact() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isPending, startTransition] = useTransition();

  const abortRef = useRef(null);
  const queueKey = "contact_offline_queue_v1";

  // stable IDs for inputs (a11y, SSR-safe)
  const idName = useId();
  const idEmail = useId();
  const idSubject = useId();
  const idMessage = useId();
  const honeyId = useId();

  // deferred values (helps UI remain responsive while typing)
  const deferredForm = {
    name: useDeferredValue(state.form.name),
    email: useDeferredValue(state.form.email),
    subject: useDeferredValue(state.form.subject),
    message: useDeferredValue(state.form.message),
  };

  const { form, status, statusMessage } = state;

  // Auto-attempt flush of offline queue when online
  useEffect(() => {
    const tryFlush = async () => {
      const q = JSON.parse(localStorage.getItem(queueKey) || "[]");
      if (!q.length) return;
      for (const item of q) {
        try {
          await sendToServer(item, { retryOnFail: false });
          // on success remove item from queue
          const remaining = JSON.parse(localStorage.getItem(queueKey) || "[]").filter((x) => x.id !== item.id);
          localStorage.setItem(queueKey, JSON.stringify(remaining));
        } catch {
          // keep it in queue
        }
      }
    };

    if (navigator.onLine) tryFlush();
    const onOnline = () => tryFlush();
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper: basic email validation (small, client-side)
  const isEmailValid = useCallback((value) => /\S+@\S+\.\S+/.test(value), []);

  // Generate a short id for queue items
  const id = useMemo(() => () => Math.random().toString(36).slice(2, 9), []);

  // Send to server: POST /api/contact (expects JSON)
  // options.retryOnFail: if false, throws error to be handled by caller
  const sendToServer = useCallback(
    async (payload, options = { retryOnFail: true }) => {
      // abort previous if exists
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;

      // NOTE: replace /api/contact with your backend route
      const url = "/api/contact";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        const err = new Error(text || "Failed to send");
        if (!options.retryOnFail) throw err;
        throw err;
      }

      return res.json();
    },
    []
  );

  const enqueueOffline = useCallback((payload) => {
    const q = JSON.parse(localStorage.getItem(queueKey) || "[]");
    q.unshift(payload);
    localStorage.setItem(queueKey, JSON.stringify(q));
  }, []);

  // Submit handler with concurrency (non-blocking UI)
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      // honeypot field (spam)
      const honey = e.currentTarget.elements[honeypotName]?.value;
      if (honey) {
        // silently drop
        return;
      }

      if (!form.name || !form.email || !form.message) {
        dispatch({ type: "ERROR", message: "Please fill in all required fields." });
        return;
      }
      if (!isEmailValid(form.email)) {
        dispatch({ type: "ERROR", message: "Please enter a valid email address." });
        return;
      }

      dispatch({ type: "LOADING" });

      startTransition(async () => {
        const payload = {
          id: id(),
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
          ts: Date.now(),
        };

        // If offline, queue and show message
        if (!navigator.onLine) {
          enqueueOffline(payload);
          dispatch({ type: "SUCCESS", message: "You're offline — message saved and will be sent when you're online." });
          return;
        }

        try {
          await sendToServer(payload);
          dispatch({ type: "SUCCESS", message: "Thanks — we received your message and will reply within 1 business day." });
        } catch (err) {
          // network/server failure: queue locally and notify user
          enqueueOffline(payload);
          dispatch({
            type: "ERROR",
            message: "We couldn't reach the server. Message queued and will retry automatically when you're online.",
          });
        }
      });
    },
    [form, isEmailValid, enqueueOffline, sendToServer, id, honeypotName]
  );

  // UI helper: set field
  const setField = useCallback((field, value) => dispatch({ type: "SET_FIELD", field, value }), []);

  // Honeypot field name (stable)
  const honeypotName = useMemo(() => "__hp_" + Math.random().toString(36).slice(2, 8), []);

  // button text - derived, uses deferred values so typing doesn't block
  const buttonText = useMemo(() => {
    if (status === "loading" || isPending) return "Sending…";
    return "Send message";
  }, [status, isPending]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black py-16 px-4">
      <Helmet>
        <title>Contact — SwiftMeta</title>
        <meta name="description" content="Contact SwiftMeta — reach us for support, sales, or custom work." />
      </Helmet>

      <div className="max-w-5xl mx-auto">
        {/* hero */}
        <header className="rounded-2xl p-8 md:p-12 bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/8 shadow mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">Get in touch</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-xl">
                Whether you need help building, deploying, or securing your application — we’re here to help. Use the form or one of the direct channels below.
              </p>
            </div>

            <div className="flex gap-3">
              <a href="mailto:hello@swiftmeta.dev" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 text-white hover:opacity-95">
                <Mail /> Email us
              </a>
              <a href="/contact" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/0 border border-black/5 dark:border-white/8">
                <Phone /> Request a call
              </a>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* left column: contact info */}
          <aside className="space-y-6 lg:col-span-1">
            <InfoCard icon={Mail} title="Email">
              hello@swiftmeta.dev
            </InfoCard>
            <InfoCard icon={Phone} title="Phone">
              +27 63 441 4863
            </InfoCard>
            <InfoCard icon={MapPin} title="Office">
              Orange Farm, Johannesburg • Open by appointment
            </InfoCard>

            <div className="bg-white/75 dark:bg-white/5 border border-black/5 dark:border-white/8 rounded-2xl p-5">
              <div className="font-semibold text-gray-900 dark:text-white">Follow</div>
              <div className="flex gap-3 mt-3">
                <a href="#" aria-label="Twitter" className="p-2 rounded-md bg-gray-100 dark:bg-white/6">
                  <Twitter />
                </a>
                <a href="#" aria-label="LinkedIn" className="p-2 rounded-md bg-gray-100 dark:bg-white/6">
                  <Linkedin />
                </a>
                <a href="#" aria-label="GitHub" className="p-2 rounded-md bg-gray-100 dark:bg-white/6">
                  <Github />
                </a>
              </div>
            </div>
          </aside>

          {/* right column: form */}
          <section className="lg:col-span-2 bg-white/85 dark:bg-white/3 border border-black/5 dark:border-white/8 rounded-2xl p-6 shadow">
            {/* top status */}
            <div aria-live="polite" className="mb-4">
              <div className={`rounded-lg p-3 ${status === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300" : status === "error" ? "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300" : ""}`}>
                {status === "success" && (
                  <div className="flex items-center gap-2">
                    <CheckCircle /> {statusMessage || "Message sent"}
                  </div>
                )}
                {status === "error" && (
                  <div className="flex items-center gap-2">
                    <AlertCircle /> {statusMessage || "Something went wrong"}
                  </div>
                )}
                {status === "idle" && (
                  <div className="text-sm text-gray-600 dark:text-gray-300">We typically reply within 1 business day.</div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* honeypot */}
              <input type="text" name={honeypotName} style={{ display: "none" }} tabIndex="-1" autoComplete="off" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={idName} className="text-sm font-medium text-gray-700 dark:text-gray-300">Full name</label>
                  <input
                    id={idName}
                    name="name"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    className="mt-1 block w-full h-11 rounded-lg px-3 border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 placeholder:text-purple-400 dark:placeholder:text-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none"
                    placeholder="Kgomotso Nkosi"
                    required
                  />
                </div>

                <div>
                  <label htmlFor={idEmail} className="text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
                  <input
                    id={idEmail}
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    className="mt-1 block w-full h-11 rounded-lg px-3 border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 placeholder:text-purple-400 dark:placeholder:text-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none"
                    placeholder="you@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor={idSubject} className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                <input
                  id={idSubject}
                  name="subject"
                  value={form.subject}
                  onChange={(e) => setField("subject", e.target.value)}
                  className="mt-1 block w-full h-11 rounded-lg px-3 border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 placeholder:text-purple-400 dark:placeholder:text-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor={idMessage} className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                <textarea
                  id={idMessage}
                  name="message"
                  rows={6}
                  value={form.message}
                  onChange={(e) => setField("message", e.target.value)}
                  className="mt-1 block w-full rounded-lg px-3 py-3 border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 placeholder:text-purple-400 dark:placeholder:text-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none resize-none"
                  placeholder="Tell us about your project, timeline, budget, and any links..."
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <div><strong>Privacy:</strong> We won't share your data. See our <a href="/policy" className="text-sky-600 underline">privacy policy</a>.</div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={status === "loading" || !form.message || !form.email}
                    aria-busy={status === "loading"}
                    className="inline-flex items-center gap-3 px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {(status === "loading" || isPending) && <ButtonSpinner className="h-4 w-4" />}
                    <span>{buttonText}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: "RESET_STATUS" });
                    }}
                    className="px-3 py-2 rounded-lg border border-black/5 dark:border-white/8 text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </form>

            {/* extra: map + faq */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg overflow-hidden border border-black/5 dark:border-white/8">
                <iframe
                  title="office-map"
                  src="https://www.google.com/maps?q=orange+farm+johannesburg&output=embed"
                  className="w-full h-48"
                />
              </div>

              <div className="p-4 rounded-lg border border-black/5 dark:border-white/8">
                <div className="font-semibold mb-2">Frequently asked</div>
                <details className="mb-2">
                  <summary className="cursor-pointer">What are your business hours?</summary>
                  <div className="text-sm mt-2 text-gray-600 dark:text-gray-300"><Clock /> Mon–Fri, 09:00–17:00 SAST</div>
                </details>

                <details className="mb-2">
                  <summary className="cursor-pointer">Do you sign NDAs?</summary>
                  <div className="text-sm mt-2 text-gray-600 dark:text-gray-300">Yes — we can sign NDAs before starting sensitive work.</div>
                </details>

                <details>
                  <summary className="cursor-pointer">How long until I get a reply?</summary>
                  <div className="text-sm mt-2 text-gray-600 dark:text-gray-300">Typical response time is 1 business day.</div>
                </details>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
