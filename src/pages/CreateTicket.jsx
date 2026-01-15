import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createTicket } from "../api/ticketApi";
import { analyzeTicketAI } from "../api/aiApi";
import {
  CheckCircle,
  Copy,
  Check,
  Loader2,
  Clock,
  ArrowRight,
  Info,
} from "lucide-react";

/* ✅ React Icons ONLY */
import {
  FaRobot,
  FaSpinner,
  FaWandMagicSparkles,
} from "react-icons/fa6";
import emailjs from "@emailjs/browser";


export default function CreateTicket() {
  const [data, setData] = useState({
    email: "",
    subject: "",
    message: "",
  });

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailError, setEmailError] = useState("");
  const emailSentRef = useRef(false);

  /* 🧠 AI states */
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [showAI, setShowAI] = useState(false);

  /* ----------------------------------
     Email validation
  ----------------------------------- */
  const isValidEmail = email =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  /* ----------------------------------
     Submit Ticket
  ----------------------------------- */
  const submit = async () => {
    if (!data.email || !data.message) return;

    if (!isValidEmail(data.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
emailSentRef.current = false;

    setEmailError("");
    setLoading(true);

    try {
      const res = await createTicket(data);
      setTicket(res);
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------
     Copy Ticket ID
  ----------------------------------- */
  const copyId = async () => {
    if (!ticket) return;
    await navigator.clipboard.writeText(ticket.ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };


const sendEmail = async () => {
  try {
    await emailjs.send(
      "service_6kca9qq",
      "template_uiudp97",
      {
        to_email: data.email,
        ticket_id: ticket.ticketId,
        subject: data.subject || "Support Ticket",
        message: data.message,
      },
      "lAEXMMHEtd0LxCc51"
    );

    console.log(" Ticket email sent");
  } catch (err) {
    console.error(" EmailJS error:", err);
  }
};


  useEffect(() => {
  if (!ticket?.ticketId) return;
  if (emailSentRef.current) return;

  emailSentRef.current = true;
  sendEmail();
}, [ticket]);

  /* ----------------------------------
     🧠 AI Assist
  ----------------------------------- */
  
const generateWithAI = async () => {
  if (!data.message.trim() || aiLoading) return;

  setAiLoading(true);
  setShowAI(true);
  setAiSuggestion("");

  try {
    const res = await analyzeTicketAI({
      email: data.email,
      subject: data.subject,
      message: data.message,
    });

    if (!res.success || !res.data?.improvedMessage) {
      throw new Error("Invalid AI response");
    }

    setAiSuggestion(res.data.improvedMessage);
  } catch (err) {
    console.error(err);
    setAiSuggestion("AI could not improve this message. Try again.");
  } finally {
    setAiLoading(false);
  }
};



const applySuggestion = () => {
  if (!aiSuggestion) return;

  setData(prev => ({
    ...prev,
    message: aiSuggestion,
  }));

  setShowAI(false);
};

function AISkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-3 rounded bg-blue-500/30 w-full" />
      <div className="h-3 rounded bg-blue-500/30 w-11/12" />
      <div className="h-3 rounded bg-blue-500/30 w-10/12" />
      <div className="h-3 rounded bg-blue-500/30 w-9/12" />
    </div>
  );
}

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-100 dark:bg-neutral-950">
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md rounded-3xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-8"
      >
        {/* Header */}
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 pt-16">
          Create Support Ticket
        </h1>

        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Describe your issue and we’ll get back to you.
        </p>

        <p className="mt-2 text-sm text-yellow-500 bg-yellow-500/10 rounded-lg p-2 flex gap-2 items-center">
          <Info /> Ticket IDs cannot be recovered. Save it safely.
        </p>

        {/* SLA */}
        <div className="mt-4 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <Clock size={15} />
          <span>Response within 24 hours</span>
        </div>

        <a
          href="/track"
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          Track your ticket
          <ArrowRight size={14} className="animate-pulse" />
        </a>

        {/* Inputs */}
        <div className="space-y-4 mt-6">
          <input
            placeholder="Email address"
            value={data.email}
            disabled={loading}
            onChange={e => {
              setData({ ...data, email: e.target.value });
              setEmailError("");
            }}
            className="
                w-full px-4 py-3 rounded-xl
                bg-neutral-100 dark:bg-neutral-800
                text-neutral-900 dark:text-neutral-100
                border border-transparent
                focus:border-blue-500
                focus:ring-2 focus:ring-blue-500/30
                outline-none
              "
          />
<AnimatePresence>
              {emailError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-1 text-xs text-red-500"
                >
                  {emailError}
                </motion.p>
              )}
            </AnimatePresence>
          
          <input
            placeholder="Subject (optional)"
            value={data.subject}
            disabled={loading}
            onChange={e => setData({ ...data, subject: e.target.value })}
            className="
              w-full px-4 py-3 rounded-xl
              bg-neutral-100 dark:bg-neutral-800
              text-neutral-900 dark:text-neutral-100
              focus:ring-2 focus:ring-blue-500/30
              outline-none
            "
          />

          <textarea
            placeholder="Describe your issue..."
            value={data.message}
            disabled={loading}
            onChange={e => setData({ ...data, message: e.target.value })}
            rows={4}
            className="
              w-full px-4 py-3 rounded-xl
              bg-neutral-100 dark:bg-neutral-800
              text-neutral-900 dark:text-neutral-100
              focus:ring-2 focus:ring-blue-500/30
              outline-none resize-none
            "
            />
        </div>

        {/* 🧠 AI Assist */}
        <button
          onClick={generateWithAI}
          disabled={aiLoading || !data.message}
          className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border dark:border-blue-200 border-dashed py-2 text-sm text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-white"
        >
          {aiLoading ? <FaSpinner className="animate-spin" /> : <FaWandMagicSparkles />}
          Improve with AI
        </button>

        {/* AI Result */}
        <AnimatePresence>
          {showAI && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20"
            >
              <div className="flex gap-2 items-center mb-2 text-blue-600">
                <FaRobot /> AI Suggestion
              </div>

              <p className="text-sm whitespace-pre-wrap dark:text-white dark:bg-white/70">
                {aiLoading ? <AISkeleton />: aiSuggestion}
              </p>

              {!aiLoading && (
                <button
                  onClick={applySuggestion}
                  className="mt-3 text-sm text-blue-600 hover:underline"
                >
                  Use this suggestion
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          onClick={submit}
          className="
            mt-6 w-full h-11
            flex items-center justify-center
            rounded-xl
            bg-black dark:bg-white
            text-white dark:text-black
            font-medium
            disabled:opacity-60
          "
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.span
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader2 className="animate-spin" size={18} />
              </motion.span>
            ) : (
              <motion.span
                key="text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Submit Ticket
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Success */}
        <AnimatePresence>
          {ticket && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-3"
            >
              <div className="flex gap-3">
                <CheckCircle className="text-green-500 mt-1" size={20} />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Your ticket was successfully created.
                  </p>

                  <div
                    onClick={copyId}
                    className="mt-1 flex items-center gap-2 font-mono text-sm cursor-pointer"
                  >
                    <span>{ticket.ticketId}</span>
                    {copied ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <Copy size={16} className="text-neutral-500" />
                    )}
                  </div>

                  <p className="text-xs text-neutral-500">
                    Tap to copy your ticket ID
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
