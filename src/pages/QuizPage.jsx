import { useState } from "react";
import quizzes from "../data/quizzes.json";
import QuizQuestion from "../components/QuizQuestion";
import { submitQuiz, requestVerification } from "../services/quizService";

export default function QuizPage() {
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const answerQuestion = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    const res = await submitQuiz({ email, answers });
    setResult(res);
  };

  if (result) return <pre>{JSON.stringify(result, null, 2)}</pre>;

  return (
    <div>
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <button onClick={() => requestVerification(email)}>
        Verify Email
      </button>

      {quizzes.map(q => (
        <QuizQuestion
          key={q.id}
          q={q}
          onAnswer={(v) => answerQuestion(q.id, v)}
        />
      ))}

      <button onClick={handleSubmit}>Submit Quiz</button>
    </div>
  );
}
