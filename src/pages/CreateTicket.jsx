import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Copy,
  Check,
  Loader2,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { createTicket } from "../api/ticketApi";
import { analyzeTicketAI } from "../api/aiApi";

export default function CreateTicket() {
  const [data, setData] = useState({ email: "", subject: "", message: "" });
  const [ticket, setTicket] = useState(null);
  const [ai, setAi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const submit = async () => {
    if (!data.email || !data.message) return;

    setLoading(true);
    setAiLoading(true);

    let aiResult = null;

    try {
      const aiRes = await analyzeTicketAI(data);
      aiResult = aiRes.ai;
      setAi(aiResult);
    } catch {}

    try {
      const res = await createTicket({
        ...data,
        subject: data.subject || aiResult?.suggestedSubject,
        ai: aiResult,
      });
      setTicket(res);
    } finally {
      setLoading(false);
      setAiLoading(false);
    }
  };

  const copyId = async () => {
    await navigator.clipboard.writeText(ticket.ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-950 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-neutral-900 p-8 shadow-xl space-y-6">

        <h1 className="text-2xl font-semibold">Create Support Ticket</h1>

        <div className="space-y-4">
          <input
            placeholder="Email"
            value={data.email}
            onChange={e => setData({ ...data, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800"
          />

          <input
            placeholder="Subject (optional)"
            value={data.subject}
            onChange={e => setData({ ...data, subject: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800"
          />

          <textarea
            placeholder="Describe your issue..."
            rows={4}
            value={data.message}
            onChange={e => setData({ ...data, message: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800"
          />
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="w-full h-11 rounded-xl bg-black dark:bg-white text-white dark:text-black"
        >
          {loading ? <Loader2 className="animate-spin mx-auto" /> : "Submit Ticket"}
        </button>

        {/* AI Insight */}
        <AnimatePresence>
          {aiLoading && (
            <motion.div className="text-sm flex items-center gap-2 text-blue-500">
              <Sparkles size={16} /> AI analyzing your ticket...
            </motion.div>
          )}

          {ai && (
            <motion.div className="rounded-xl p-4 bg-blue-50 dark:bg-blue-900/20 space-y-1 text-sm">
              <p>📂 Category: {ai.category}</p>
              <p>⚠️ Urgency: {ai.urgency}</p>
              <p>💬 Sentiment: {ai.sentiment}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success */}
        {ticket && (
          <div className="rounded-xl p-4 bg-green-50 dark:bg-green-900/20">
            <p className="font-medium">Ticket Created</p>
            <div onClick={copyId} className="cursor-pointer font-mono flex gap-2">
              {ticket.ticketId}
              {copied ? <Check /> : <Copy />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
