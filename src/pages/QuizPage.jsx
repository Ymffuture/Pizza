import { useState, useEffect } from "react";
import {
  FiCheckCircle,
  FiMail,
  FiXCircle,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import quizzes from "../data/quizzes.json";
import QuizQuestion from "../components/QuizQuestion";
import { submitQuiz, requestVerification } from "../services/quizService";

/* ======================
   ERROR HANDLER
====================== */
const extractErrorMessage = (err) => {
  if (err?.response) {
    return (
      err.response.data?.message ||
      err.response.data?.error ||
      `Server error (${err.response.status})`
    );
  }
  if (err?.request) return "No response from server";
  return err?.message || "Unexpected error";
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
      setError("Please enter your email");
      return;
    }

    try {
      setVerifying(true);
      setError("");
      await requestVerification(email);
      setVerified(true);
      toast.success("Verification email sent");
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setVerifying(false);
    }
  };

  /* ======================
     QUIZ SUBMIT
  ====================== */
  const handleSubmit = async () => {
    if (!verified) {
      setError("Verify your email first");
      return;
    }

    if (!allAnswered) {
      setError("Answer all questions");
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

          <p>Score: <strong>{result.percentage}%</strong></p>

          <p
            className={`flex items-center gap-2 font-medium ${
              result.passed ? "text-green-600" : "text-red-600"
            }`}
          >
            {result.passed ? <FiCheckCircle /> : <FiXCircle />}
            {result.passed ? "Passed" : "Failed"}
          </p>
        </div>
      </div>
    );
  }

  /* ======================
     MAIN VIEW
  ====================== */
  return (
    <main className="pt-24 pb-16 min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <div className="max-w-3xl mx-auto px-6 space-y-8">

        {/* Header */}
        <header>
          <h1 className="text-3xl font-semibold text-gray-800 ">Coding Assessment</h1>
          <p className="text-gray-500">Minimum pass: 50%</p>
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
            className="w-full rounded-xl px-4 py-3 dark:bg-gray-700"
          />

          <button
            onClick={handleVerify}
            disabled={verifying}
            className="mt-4 w-full rounded-xl bg-gray-900 text-white py-2.5"
          >
            {verifying ? "Sending..." : "Verify Email"}
          </button>

          {verified && (
            <p className="text-green-500 mt-2 flex items-center gap-1">
              <FiCheckCircle /> Email verified
            </p>
          )}
        </div>

        {/* Progress */}
        <div className="flex justify-between text-sm text-gray-500">
          <span>
            Question {currentIndex + 1} / {total} {''} <span className="text-gray-600 dark:bg-white dark:text-black rounded-full" >{Math.round(((currentIndex + 1) / total) * 100)===100? "Completed" :"In progress" }</span>
          </span>
          <span>{Math.round(((currentIndex + 1) / total) * 100)}%</span>
        </div>

        {/* Slide Question */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
          <QuizQuestion
            q={currentQuestion}
            selected={answers[currentQuestion.id]}
            onAnswer={(v) => answerQuestion(currentQuestion.id, v)}
          />
        </div>
{/* Error */}
        {error && (
          <div className="flex gap-2 bg-red-500/10 p-3 rounded-xl text-red-600">
            <FiXCircle className="text-2xl animate-pulse" />
            {error}
          </div>
        )}
        {/* Navigation */}
        <div className="flex justify-between items-center gap-4 dark:text-white">
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
            <button
  onClick={handleSubmit}
  disabled={loading}
  className={`px-6 py-3 rounded-xl text-white transition
    ${error ? "bg-red-600" : "bg-green-600"}
    disabled:opacity-50
  `}
>
  {loading
    ? "Submitting..."
    : error
    ? "Try Again"
    : "Submit Quiz"}
</button>

          )}
        </div>

        
      </div>
    </main>
  );
}
