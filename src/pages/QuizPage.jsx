import { useState } from "react";
import Slider from "react-slick";
import { FiCheckCircle, FiMail, FiXCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import quizzes from "../data/quizzes.json";
import QuizQuestion from "../components/QuizQuestion";
import { submitQuiz, requestVerification } from "../services/quizService";

/* ======================
   UTILS
   ====================== */
const extractErrorMessage = (err) => {
  if (err?.response) {
    return (
      err.response.data?.message ||
      err.response.data?.error ||
      `Server error (${err.response.status})`
    );
  }

  if (err?.request) {
    return "No response from server. Backend may be down.";
  }

  return err?.message || "Unexpected error occurred";
};

/* ======================
   SLIDER SETTINGS
   ====================== */
const sliderSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  adaptiveHeight: true,
  swipe: true,
  draggable: true,
  accessibility: true,
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
     ANSWERS
     ====================== */
  const answerQuestion = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const answeredCount = Object.keys(answers).length;
  const allAnswered = quizzes.every(
    (q) => answers[q.id] !== undefined && answers[q.id] !== ""
  );

  /* ======================
     EMAIL VERIFICATION
     ====================== */
  const handleVerify = async () => {
    if (!email) {
      setError("Please enter your email first");
      return;
    }

    try {
      setVerifying(true);
      setError("");

      await requestVerification(email);

      setVerified(true);
      toast.success("Verification email sent. Check inbox or spam.");
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message);
      toast.error(message);
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
      setError("Please verify your email before submitting");
      return;
    }

    if (!allAnswered) {
      setError("Please answer all questions before submitting");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await submitQuiz({ email, answers });

      setResult(res);
      toast.success(res.passed ? "You passed 🎉" : "You failed ❌");
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message);
      toast.error(message);
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
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 space-y-4 shadow-lg">
          <h2 className="text-xl font-semibold">Quiz Result</h2>

          <p className="text-gray-700 dark:text-gray-300">
            Score: <span className="font-medium">{result.percentage}%</span>
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
  return (
    <main className="pt-24 pb-16 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors dark:text-white">
      <div className="max-w-3xl mx-auto px-6 space-y-10">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Coding Assessment</h1>
          <p className="text-gray-600 dark:text-gray-300">
            You must score at least 50% to pass.
          </p>
        </header>

        {/* Email Verification */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 space-y-4 shadow-md">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <FiMail />
            <span>Email Address</span>
          </div>

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:bg-gray-700 dark:text-white"
          />

          <button
            onClick={handleVerify}
            disabled={verifying}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-gray-900 py-2.5 text-white hover:bg-gray-800 transition disabled:opacity-50"
          >
            {verifying ? "Sending..." : "Verify Email"}
            {verified && <FiCheckCircle />}
          </button>

          {verified && (
            <p className="text-sm text-green-500 flex items-center gap-1">
              <FiCheckCircle /> Verification email sent
            </p>
          )}
        </div>

        {/* QUESTIONS SLIDER */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-md">
          <Slider {...sliderSettings}>
            {quizzes.map((q, index) => (
              <div key={q.id} className="px-2">
                <div className="space-y-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Question {index + 1} of {quizzes.length}
                  </div>

                  <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 p-6">
                    <QuizQuestion
                      q={q}
                      selected={answers[q.id]}
                      onAnswer={(v) => answerQuestion(q.id, v)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
            <FiXCircle className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || !allAnswered}
          className={`flex items-center justify-center gap-2 w-full rounded-2xl py-4 text-white text-lg transition
            ${
              !allAnswered
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-900 hover:bg-gray-800"
            }
            disabled:opacity-50`}
        >
          {loading
            ? "Submitting..."
            : allAnswered
            ? "Submit Quiz"
            : `Answer all questions (${answeredCount}/${quizzes.length})`}
        </button>
      </div>
    </main>
  );
}
