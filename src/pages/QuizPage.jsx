import { useState } from "react";
import { FiCheckCircle, FiMail, FiXCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";
import quizzes from "../data/quizzes.json";
import QuizQuestion from "../components/QuizQuestion";
import { submitQuiz, requestVerification } from "../services/quizService";

export default function QuizPage() {
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  const answerQuestion = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const allAnswered = quizzes.every(
    (q) => answers[q.id] !== undefined && answers[q.id] !== ""
  );

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
      toast.success("Verification email sent!");
    } catch (err) {
      setError(err.message || "Failed to send verification email");
    } finally {
      setVerifying(false);
    }
  };

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
      toast.success(res.passed ? "You passed!" : "You failed ❌");
    } catch (err) {
      setError(err.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="pt-24 max-w-xl mx-auto px-6 dark:text-white">
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 space-y-4 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Quiz Result
          </h2>
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

  return (
    <main className="pt-24 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors dark:text-white">
      <div className="max-w-3xl mx-auto px-6 space-y-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Coding Assessment
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            You must score at least 50% to pass.
          </p>
        </header>

        {/* Email */}
        <div className="rounded-2xl border-gray-400 bg-white dark:bg-gray-800 p-6 space-y-4 shadow-md">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <FiMail />
            <span>Email Address</span>
          </div>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:bg-gray-700 dark:text-white transition"
          />
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-gray-900 py-2.5 text-white hover:bg-gray-800 transition"
          >
            {verifying ? "Sending..." : "Verify Email"}
            {verified && <FiCheckCircle />}
          </button>
          {verified && (
            <p className="text-sm text-green-500 flex items-center gap-1">
              <FiCheckCircle /> Email verification sent
            </p>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {quizzes.map((q, index) => (
            <div
              key={q.id}
              className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md"
            >
              <div className="text-sm text-gray-500 dark:text-gray-500">
                Question {index + 1} of {quizzes.length}
              </div>
              <QuizQuestion
                q={q}
                selected={answers[q.id]}
                onAnswer={(v) => answerQuestion(q.id, v)}
              />
            </div>
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-500/10 p-2 rounded">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`flex items-center justify-center gap-2 w-full rounded-2xl py-4 text-white text-lg transition ${
            error ? "bg-red-700 hover:bg-red-600" : "bg-gray-900 hover:bg-gray-800"
          }`}
        >
          {loading ? "Submitting..." : "Submit Quiz"}
        </button>
      </div>
    </main>
  );
}
