import { useState } from "react";
import quizzes from "../data/quizzes.json";
import QuizQuestion from "../components/QuizQuestion";
import { submitQuiz, requestVerification } from "../services/quizService";
import {toast} from "react-hot-toast" ;
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
      toast("Verification email sent. Check your inbox.");
    } catch (err) {
      setError(err.message);
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="pt-24 max-w-xl mx-auto px-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 space-y-4">
          <h2 className="text-xl font-semibold">Quiz Result</h2>
          <p>Score: {result.percentage}%</p>
          <p className={result.passed ? "text-green-600" : "text-red-600"}>
            {result.passed ? "Passed 🎉" : "Failed ❌"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6 space-y-10">
        <header>
          <h1 className="text-3xl font-semibold">Coding Assessment</h1>
          <p className="text-gray-600">
            You must score at least 50% to pass.
          </p>
        </header>

        {/* Email */}
        <div className="rounded-2xl bg-white p-6 space-y-4">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
          />

          <button
            onClick={handleVerify}
            disabled={verifying}
            className="rounded-xl bg-gray-900 px-5 py-2.5 text-white"
          >
            {verifying ? "Sending..." : "Verify Email"}
          </button>

          {verified && (
            <p className="text-sm text-green-600">✔ Email verification sent</p>
          )}

          

        {/* Questions */}
        {quizzes.map((q, index) => (
          <div
            key={q.id}
            className="rounded-2xl bg-white p-6 space-y-4"
          >
            <div className="text-sm text-gray-500">
              Question {index + 1} of {quizzes.length}
            </div>

            <QuizQuestion
              q={q}
              selected={answers[q.id]}
              onAnswer={(v) => answerQuestion(q.id, v)}
            />
          </div>
        ))}
{error && <p className="text-sm text-red-600 bg-red-500/10 p-2 m-2">{error}</p>}
        </div>
        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={` ${error? "bg-red-900" :"bg-gray-900" } w-full rounded-2xl py-4 text-white text-lg`} 
        >
          {loading ? "Submitting..." : "Submit Quiz"}
        </button>
      </div>
    </main>
  );
}
