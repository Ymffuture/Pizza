import { useState } from "react";
import quizzes from "../data/quizzes.json";
import QuizQuestion from "../components/QuizQuestion";
import { submitQuiz, requestVerification } from "../services/quizService";

export default function QuizPage() {
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const answerQuestion = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await submitQuiz({ email, answers });
    setResult(res);
    setLoading(false);
  };

  if (result) {
    return (
      <div className="pt-24 max-w-xl mx-auto px-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Quiz Result
          </h2>
          <p className="text-gray-700">
            Score: <span className="font-medium">{result.percentage}%</span>
          </p>
          <p
            className={`font-medium ${
              result.passed ? "text-green-600" : "text-red-600"
            }`}
          >
            {result.passed ? "Passed 🎉" : "Failed ❌"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6 space-y-10">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-gray-900">
            Coding Assessment
          </h1>
          <p className="text-gray-600">
            Answer all questions carefully. You need 50% to pass.
          </p>
        </header>

        {/* Email Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Email address
          </label>

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="
              w-full rounded-xl border border-gray-300 px-4 py-3
              focus:outline-none focus:ring-2 focus:ring-gray-900/10
            "
          />

          <button
            onClick={() => requestVerification(email)}
            className="
              inline-flex items-center justify-center
              rounded-xl bg-gray-900 px-5 py-2.5
              text-sm font-medium text-white
              hover:bg-gray-800 transition
            "
          >
            Verify Email
          </button>
        </div>

        {/* Questions */}
        <section className="space-y-12">
          {quizzes.map((q, index) => (
            <div
              key={q.id}
              className="rounded-2xl border border-gray-200 bg-white p-6"
            >
              <div className="mb-4 text-sm text-gray-500">
                Question {index + 1} of {quizzes.length}
              </div>

              <QuizQuestion
                q={q}
                onAnswer={(v) => answerQuestion(q.id, v)}
              />
            </div>
          ))}
        </section>

        {/* Submit */}
        <div className="pt-6">
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="
              w-full rounded-2xl bg-gray-900 py-4
              text-white font-medium text-lg
              hover:bg-gray-800 transition
              disabled:opacity-50
            "
          >
            {loading ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      </div>
    </main>
  );
}
