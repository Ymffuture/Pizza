import React, { useState, useMemo, useCallback } from "react";
import quizData from "../data/grade11-math.json";
import { motion, AnimatePresence } from "framer-motion";

export default function Mathq() {

  const questions = useMemo(() => quizData.questions, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(
    Array(questions.length).fill(null)
  );
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  // Select answer
  const selectAnswer = useCallback((optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
  }, [answers, currentIndex]);

  // Next question
  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setFinished(true);
    }
  };

  // Previous question
  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Score calculation
  const score = useMemo(() => {
    return answers.reduce((total, answer, index) => {
      if (answer === questions[index].correctAnswer) {
        return total + 1;
      }
      return total;
    }, 0);
  }, [answers, questions]);

  // Restart quiz
  const restartQuiz = () => {
    setAnswers(Array(questions.length).fill(null));
    setCurrentIndex(0);
    setFinished(false);
  };

  // Result screen
  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg text-center"
        >
          <h2 className="text-2xl font-bold mb-4">
            Quiz Completed 🎉
          </h2>

          <p className="text-xl mb-2">
            Score: {score} / {questions.length}
          </p>

          <p className="mb-4">
            Percentage: {Math.round((score / questions.length) * 100)}%
          </p>

          <button
            onClick={restartQuiz}
            className="px-6 py-2 bg-blue-600 text-white rounded"
          >
            Restart Quiz
          </button>

        </motion.div>

      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="max-w-xl w-full bg-white shadow-lg rounded-xl p-6">

        {/* Progress */}
        <div className="mb-4 text-sm text-gray-600">
          Question {currentIndex + 1} of {questions.length}
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">

          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
          >
            <h3 className="text-lg font-semibold mb-4">
              {currentQuestion.question}
            </h3>

            {/* Options */}
            <div className="space-y-2">

              {currentQuestion.options.map((option, index) => {

                const selected = answers[currentIndex] === index;

                return (
                  <button
                    key={index}
                    onClick={() => selectAnswer(index)}
                    className={`w-full p-3 border rounded text-left
                      ${selected
                        ? "bg-blue-500 text-white"
                        : "bg-gray-50 hover:bg-gray-100"
                      }
                    `}
                  >
                    {option}
                  </button>
                );
              })}

            </div>

          </motion.div>

        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">

          <button
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Previous
          </button>

          <button
            onClick={nextQuestion}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {currentIndex === questions.length - 1
              ? "Finish"
              : "Next"}
          </button>

        </div>

      </div>

    </div>
  );
}
