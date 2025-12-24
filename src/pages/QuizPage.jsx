import { useState, useEffect, useRef } from "react";
import {
  FiCheckCircle,
  FiMail,
  FiXCircle,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

import quizzes from "../data/quizzes.json";
import QuizQuestion from "../components/QuizQuestion";
import { submitQuiz, requestVerification } from "../services/quizService";

/* ======================
   ERROR HANDLER (DEBUG FRIENDLY)
====================== */
const extractErrorMessage = (err) => {
  if (err?.response) {
    return (
      err.response.data?.message ||
      err.response.data?.error ||
      `Server error (${err.response.status})`
    );
  }
  if (err?.request) return "No response from server. Backend may be offline.";
  return err?.message || "Unexpected error occurred.";
};

export default function QuizPage() {
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  /* ======================
     SLIDE STATE
  ====================== */
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = quizzes.length;
  const currentQuestion = quizzes[currentIndex];

  /* ======================
     AUTO SCROLL ERROR
  ====================== */
  const errorRef = useRef(null);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [error]);

  /* ======================
     ANSWERS
  ====================== */
  const answerQuestion = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const isAnswered = answers[currentQuestion.id] !== undefined;

  const allAnswered = quizzes.every(
    (q) => answers[q.id] !== undefined && answers[q.id] !== ""
  );

  /* ======================
     EMAIL VERIFICATION
  ====================== */
  const handleVerify = async () => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setVerifying(true);
      setError("");
      await requestVerification(email);
      setVerified(true);
      toast.success("Verification email sent. Check inbox or spam.");
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      toast.error(msg);
      console.error("Email verification error:", err);
    } finally {
      setVerifying(false);
    }
  };

  /* ======================
     QUIZ SUBMISSION
  ====================== */
  const handleSubmit = async () => {
    if (!verified) {
      setError("Please verify your email before submitting.");
      return;
    }

    if (!allAnswered) {
      setError("Please answer all questions before submitting.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await submitQuiz({ email, answers });
      setResult(res);
      toast.success(res.passed ? "You passed 🎉" : "You failed ❌");
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      toast.error(msg);
      console.error("Quiz submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     RESULT VIEW
  ====================== */
  if (result) {
    return (
      <div className="pt-24 max-w-xl mx-auto px-6 dark:text-white">
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg space-y-4">
          <h2 className="text-xl font-semibold">Quiz Result</h2>

          <p>
            Score: <strong>{result.percentage}%</strong>
          </p>

          <p
            className={`flex items-center gap-2 font-medium ${
              result.passed ? "text-green-600" : "text-red-600"
            }`}
          >
            {result.passed ? <FiCheckCircle /> : <FiXCircle />}
            {result.passed ? "Passed 🎉" : "Failed ❌"}
          </p>
        </div>
      </div>
    );
  }

  /* ======================
     MAIN VIEW
  ====================== */
  const progress = Math.round(((currentIndex + 1) / total) * 100);
const completed = progress === 100;

  return (
    <main className="pt-24 pb-16 min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <div className="max-w-3xl mx-auto px-6 space-y-8">

        {/* Header */}
        <header>
          <h1 className="text-3xl font-semibold">Coding Assessment</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Minimum pass mark: 50%
          </p>
        </header>

        {/* Email Verification */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
          <label className="flex items-center gap-2 mb-2">
            <FiMail /> Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl px-4 py-3 dark:bg-gray-700 focus:outline-none"
          />

          <button
            onClick={handleVerify}
            disabled={verifying}
            className="mt-4 w-full rounded-xl bg-gray-900 text-white py-2.5 disabled:opacity-50"
          >
            {verifying ? "Sending..." : "Verify Email"}
          </button>

          {verified && (
            <p className="text-green-500 mt-2 flex items-center gap-1">
              <FiCheckCircle /> Verification email sent
            </p>
          )}
        </div>

        {/* Progress */}
<div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
  <span>
    Question {currentIndex + 1} / {total}
  </span>

  <div className="flex items-center gap-2">
    <span>{progress}%</span>

    <motion.span
  key={completed ? "done" : "progress"}
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.2 }}
  className={`
    px-2.5 py-1 rounded-full font-medium
    ${
      completed
        ? "bg-green-500/15 text-green-600 dark:text-green-400"
        : "bg-yellow-400/15 text-yellow-600 dark:text-yellow-400"
    }
  `}
>
  {completed ? "Completed" : "In Progress"}
</motion.span>

  </div>
</div>


        {/* Slide Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
          >
            <QuizQuestion
              q={currentQuestion}
              selected={answers[currentQuestion.id]}
              onAnswer={(v) =>
                answerQuestion(currentQuestion.id, v)
              }
            />
          </motion.div>
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              ref={errorRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-2 bg-red-500/10 p-3 rounded-xl text-red-600"
            >
              <FiXCircle className="mt-0.5 shrink-0 text-xl" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-4">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 disabled:opacity-40"
          >
            <FiArrowLeft /> Previous
          </button>

          {currentIndex < total - 1 ? (
            <button
              disabled={!isAnswered}
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white disabled:opacity-40"
            >
              Next <FiArrowRight />
            </button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: loading ? 1 : 1.03 }}
              onClick={handleSubmit}
              disabled={loading}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition
                ${error ? "bg-red-600" : "bg-green-600"}
                disabled:opacity-50
              `}
            >
              {loading ? (
                <>
                  <motion.span
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      ease: "linear",
                    }}
                  />
                  Submitting...
                </>
              ) : error ? (
                "Try Again"
              ) : (
                "Submit Quiz"
              )}
            </motion.button>
          )}
        </div>
      </div>
    </main>
  );
}
