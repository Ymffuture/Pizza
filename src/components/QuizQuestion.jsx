import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function QuizQuestion({ q, onAnswer }) {
  return (
    <div className="space-y-4">
      <h2>{q.question}</h2>

      <SyntaxHighlighter language={q.language} style={oneDark}>
        {q.code}
      </SyntaxHighlighter>

      {q.type === "mcq" ? (
        q.options.map((opt, i) => (
          <button key={i} onClick={() => onAnswer(i)}>
            {opt}
          </button>
        ))
      ) : (
        <input
          placeholder="Enter output"
          onChange={(e) => onAnswer(e.target.value)}
        />
      )}
    </div>
  );
}
