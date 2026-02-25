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
  Sparkles,
  Zap,
  Shield,
  MessageSquare,
  Send,
  BrainCircuit,
} from "lucide-react";
import { Helmet } from "react-helmet";
import emailjs from "@emailjs/browser";

/* ============================================
   Smart Visual Components
============================================ */

const NeuralLoader = () => (
  <div className="relative flex items-center justify-center w-6 h-6">
    <motion.div
      className="absolute w-full h-full rounded-full border-2 border-blue-500/30"
      animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-3 h-3 bg-blue-500 rounded-full"
      animate={{ scale: [0.8, 1.2, 0.8] }}
      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-1.5 h-1.5 bg-white rounded-full"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 0.8, repeat: Infinity }}
    />
  </div>
);

const ThinkingDots = () => (
  <div className="flex gap-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 h-2 bg-blue-400 rounded-full"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
      />
    ))}
  </div>
);

const AISkeleton = () => (
  <div className="space-y-3">
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}
        className="h-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20"
        style={{ width: `${100 - i * 15}%` }}
      >
        <motion.div
          className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ["-100%", "300%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    ))}
  </div>
);

const ProgressBar = ({ progress }) => (
  <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
    <motion.div
      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.3 }}
    />
  </div>
);

export default function CreateTicket() {
  const [data, setData] = useState({ email: "", subject: "", message: "" });
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const emailSentRef = useRef(false);

  /* AI States */
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [showAI, setShowAI] = useState(false);
  const [aiConfidence, setAiConfidence] = useState(0);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const submit = async () => {
    if (!data.email || !data.message) return;
    if (!isValidEmail(data.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    emailSentRef.current = false;
    setEmailError("");
    setLoading(true);
    setSubmitProgress(0);

    // Simulate progress steps
    const progressInterval = setInterval(() => {
      setSubmitProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const res = await createTicket(data);
      setSubmitProgress(100);
      setTimeout(() => setTicket(res), 300);
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
    }
  };

  const copyId = async () => {
    if (!ticket) return;
    await navigator.clipboard.writeText(ticket.ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendEmail = async () => {
    try {
      await emailjs.send(
        "service_6kca9qq",
        "template_uiudp97",
        {
          to_email: data.email,
          ticket_id: ticket.ticketId,
          subject: data.subject,
          message: data.message,
        },
        "lAEXMMHEtd0LxCc51"
      );
    } catch (err) {
      console.error("EmailJS error:", err);
    }
  };

  useEffect(() => {
    if (!ticket?.ticketId || emailSentRef.current) return;
    emailSentRef.current = true;
    sendEmail();
  }, [ticket]);

  const generateWithAI = async () => {
    if (!data.message.trim() || aiLoading) return;

    setAiLoading(true);
    setShowAI(true);
    setAiSuggestion("");
    setAiConfidence(0);

    // Simulate confidence building
    const confidenceInterval = setInterval(() => {
      setAiConfidence((prev) => Math.min(prev + Math.random() * 20, 95));
    }, 300);

    try {
      const res = await analyzeTicketAI({
        email: data.email,
        subject: data.subject,
        message: data.message,
      });

      clearInterval(confidenceInterval);
      setAiConfidence(98);

      if (!res.success || !res.data?.improvedMessage) {
        throw new Error("Invalid AI response");
      }

      setAiSuggestion(res.data.improvedMessage);
    } catch (err) {
      setAiSuggestion("AI could not improve this message. Try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const applySuggestion = () => {
    if (!aiSuggestion) return;
    setData((prev) => ({ ...prev, message: aiSuggestion }));
    setShowAI(false);
    setAiConfidence(0);
  };

  const inputVariants = {
    focused: { scale: 1.02, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.15)" },
    unfocused: { scale: 1, boxShadow: "0 0 0 0px rgba(59, 130, 246, 0)" },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-neutral-50 via-white to-blue-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-blue-950/20 relative overflow-hidden">
      <Helmet>
        <title>Support - Create Ticket</title>
      </Helmet>

      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1], 
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1], 
            rotate: [0, -60, 0],
            opacity: [0.2, 0.4, 0.2] 
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-lg relative"
      >
        {/* Glass Card */}
        <div className="rounded-3xl border border-white/50 dark:border-white/10 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
          
          {/* Header Section */}
          <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-neutral-50/50 to-transparent dark:from-neutral-800/30">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="p-2 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl">
                <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Support Center
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-neutral-900 dark:text-white"
            >
              Create Ticket
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-2 text-neutral-500 dark:text-neutral-400 text-sm"
            >
              Describe your issue and we'll get back to you within 24 hours.
            </motion.p>
          </div>

          <div className="px-8 pb-8 space-y-6">
            {/* Warning Banner */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50"
            >
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  Important
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  Ticket IDs cannot be recovered. Please save your ID safely.
                </p>
              </div>
            </motion.div>

            {/* SLA Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Clock className="w-4 h-4" />
                <span>24h response time</span>
              </div>
              <motion.a
                href="/track"
                whileHover={{ x: 3 }}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700"
              >
                Track ticket
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </motion.div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Email Field */}
              <motion.div
                variants={inputVariants}
                animate={focusedField === "email" ? "focused" : "unfocused"}
                className="relative"
              >
                <input
                  type="email"
                  placeholder="Email address"
                  value={data.email}
                  disabled={loading}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => {
                    setData({ ...data, email: e.target.value });
                    setEmailError("");
                  }}
                  className="w-full px-4 py-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100 border-2 border-transparent focus:border-blue-500/50 outline-none transition-all placeholder:text-neutral-400"
                />
                <AnimatePresence>
                  {emailError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute -bottom-6 left-0 text-xs text-red-500 font-medium"
                    >
                      {emailError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Subject Field */}
              <motion.div
                variants={inputVariants}
                animate={focusedField === "subject" ? "focused" : "unfocused"}
              >
                <input
                  placeholder="Subject (optional)"
                  value={data.subject}
                  disabled={loading}
                  onFocus={() => setFocusedField("subject")}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setData({ ...data, subject: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100 border-2 border-transparent focus:border-blue-500/50 outline-none transition-all placeholder:text-neutral-400"
                />
              </motion.div>

              {/* Message Field */}
              <motion.div
                variants={inputVariants}
                animate={focusedField === "message" ? "focused" : "unfocused"}
                className="relative"
              >
                <textarea
                  placeholder="Describe your issue in detail..."
                  value={data.message}
                  disabled={loading}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setData({ ...data, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100 border-2 border-transparent focus:border-blue-500/50 outline-none transition-all resize-none placeholder:text-neutral-400"
                />
                <div className="absolute bottom-3 right-3 text-xs text-neutral-400">
                  {data.message.length} chars
                </div>
              </motion.div>
            </div>

            {/* AI Assist Button */}
            <motion.button
              onClick={generateWithAI}
              disabled={aiLoading || !data.message || loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full group relative overflow-hidden rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-700 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 transition-all hover:border-blue-400 dark:hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-3">
                {aiLoading ? (
                  <NeuralLoader />
                ) : (
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform" />
                )}
                <span className="font-medium text-neutral-700 dark:text-neutral-200">
                  {aiLoading ? "Analyzing with AI..." : "Enhance with AI"}
                </span>
              </div>
            </motion.button>

            {/* AI Result Panel */}
            <AnimatePresence>
              {showAI && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-blue-500/10 border border-blue-500/20 dark:border-blue-400/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-semibold text-neutral-900 dark:text-white">
                          AI Suggestion
                        </span>
                      </div>
                      {aiLoading && (
                        <div className="flex items-center gap-2 text-xs text-blue-600">
                          <span>Confidence {Math.round(aiConfidence)}%</span>
                          <ThinkingDots />
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {aiLoading ? <AISkeleton /> : aiSuggestion}
                    </div>

                    {!aiLoading && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={applySuggestion}
                        className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Apply suggestion
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              onClick={submit}
              disabled={loading || !data.email || !data.message}
              whileTap={{ scale: 0.98 }}
              className="w-full relative overflow-hidden rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold py-4 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating ticket...</span>
                    </div>
                    <div className="w-48">
                      <ProgressBar progress={submitProgress} />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="submit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    <span>Submit Ticket</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Success State */}
            <AnimatePresence>
              {ticket && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 p-6"
                >
                  {/* Success Animation Background */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-green-400/20 rounded-full"
                  />

                  <div className="relative flex items-start gap-4">
                    <div className="p-3 bg-green-500 rounded-xl shadow-lg shadow-green-500/30">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-green-900 dark:text-green-100 text-lg">
                        Ticket Created!
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        We've sent confirmation to your email.
                      </p>

                      <motion.div
                        onClick={copyId}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-4 p-4 bg-white/80 dark:bg-black/30 rounded-xl cursor-pointer border border-green-200 dark:border-green-800/50 backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">
                            Ticket ID
                          </span>
                          {copied ? (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex items-center gap-1 text-xs font-semibold text-green-600"
                            >
                              <Check className="w-3 h-3" /> Copied
                            </motion.span>
                          ) : (
                            <Copy className="w-4 h-4 text-green-600/50" />
                          )}
                        </div>
                        <p className="font-mono text-xl font-bold text-green-900 dark:text-green-100 tracking-wider">
                          {ticket.ticketId}
                        </p>
                      </motion.div>

                      <p className="mt-3 text-xs text-green-600/70 dark:text-green-400/70 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Save this ID to track your ticket status
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6 text-xs text-neutral-400 dark:text-neutral-600"
        >
          Secured by 256-bit encryption
        </motion.p>
      </motion.div>
    </div>
  );
}
