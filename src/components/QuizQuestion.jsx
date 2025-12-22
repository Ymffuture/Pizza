import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function QuizQuestion({ q, selected, onAnswer }) {
  return (
    <div className="space-y-6">
      {/* Question */}
      <h2 className="text-lg font-medium text-gray-900 dark:text-white">
        {q.question}
      </h2>

      {/* Code */}
      {q.code && (
        <SyntaxHighlighter
          language={q.language}
          style={oneDark}
          customStyle={{ borderRadius: 12 }}
        >
          {q.code}
        </SyntaxHighlighter>
      )}

      {/* MCQ */}
      {q.type === "mcq" && Array.isArray(q.options) && (
        <div className="space-y-3">
          {q.options.map((opt, index) => {
            const isSelected = selected === index;

            return (
              <button
                key={index}
                type="button"
                onClick={() => onAnswer(index)}
                className={`
                  w-full text-left px-4 py-3 rounded-xl border
                  transition
                  ${
                    isSelected
                      ? "border-gray-900 bg-gray-100 dark:text-black "
                      : "border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {/* OUTPUT */}
      {q.type === "output" && (
        <input
          type="text"
          value={selected ?? ""}
          placeholder="Type the output"
          onChange={(e) => onAnswer(e.target.value)}
          className="
            w-full rounded-xl border border-gray-300
            px-4 py-3
            focus:outline-none focus:ring-2 focus:ring-gray-900/10
          "
        />
      )}

      {/* SAFETY */}
      {!q.type && (
        <p className="text-sm text-red-500">
          ❌ Question type missing in quizzes.json
        </p>
      )}
    </div>
  );
}
