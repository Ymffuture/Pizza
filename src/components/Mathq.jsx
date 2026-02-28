import React, { useState, useMemo, useCallback, useEffect } from "react";
import quizData from "../data/grade11-math.json";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Printer, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Trophy,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Lock,
  Timer,
  FileText,
  BarChart3
} from "lucide-react";
import { toast } from "react-hot-toast";

// Cooldown Timer Component
const CooldownTimer = ({ remainingSeconds, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(remainingSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire?.();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-medium">
      <Clock className="w-4 h-4 animate-pulse" />
      <span>Retry in: {hours}h {minutes}m {seconds}s</span>
    </div>
  );
};

// Anti-Cheat Warning Modal
const AntiCheatWarning = ({ onAcknowledge }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl border border-red-200 dark:border-red-800"
    >
      <div className="flex items-center gap-3 mb-4 text-red-600 dark:text-red-400">
        <AlertTriangle className="w-8 h-8" />
        <h3 className="text-xl font-bold">Important Notice</h3>
      </div>
      
      <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
        <p>⚠️ <strong>Anti-Cheat Measures Active:</strong></p>
        <ul className="space-y-2 ml-4 list-disc">
          <li>Screen recording is monitored</li>
          <li>Tab switching is tracked</li>
          <li>Multiple submissions are blocked</li>
          <li>2-hour cooldown between attempts</li>
        </ul>
        <p className="text-xs text-gray-500 mt-4">
          By continuing, you agree to abide by these academic integrity policies.
        </p>
      </div>
      
      <button
        onClick={onAcknowledge}
        className="w-full mt-6 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
      >
        I Understand - Begin Quiz
      </button>
    </motion.div>
  </motion.div>
);

export default function Mathq() {
  const questions = useMemo(() => quizData.questions, []);
  
  // Anti-cheat state
  const [showWarning, setShowWarning] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [cooldownEnd, setCooldownEnd] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  
  // Quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  // Check for existing submission on mount
  useEffect(() => {
    const savedSubmission = localStorage.getItem('quizSubmission');
    const savedCooldown = localStorage.getItem('quizCooldownEnd');
    
    if (savedCooldown) {
      const end = parseInt(savedCooldown);
      const now = Date.now();
      if (end > now) {
        setCooldownEnd(end);
        setRemainingTime(Math.floor((end - now) / 1000));
        setIsSubmitted(true);
      } else {
        localStorage.removeItem('quizCooldownEnd');
        localStorage.removeItem('quizSubmission');
      }
    } else if (savedSubmission) {
      setIsSubmitted(true);
    }
  }, []);

  // Update remaining time
  useEffect(() => {
    if (!cooldownEnd) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.floor((cooldownEnd - now) / 1000);
      
      if (remaining <= 0) {
        setIsSubmitted(false);
        setCooldownEnd(null);
        localStorage.removeItem('quizCooldownEnd');
        localStorage.removeItem('quizSubmission');
        clearInterval(interval);
      } else {
        setRemainingTime(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldownEnd]);

  const currentQuestion = questions[currentIndex];

  // Select answer
  const selectAnswer = useCallback((optionIndex) => {
    if (isSubmitted) return;
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
  }, [answers, currentIndex, isSubmitted]);

  // Next question
  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  // Previous question
  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Finish quiz with anti-cheat
  const finishQuiz = () => {
    if (isSubmitted) {
      toast.error("You have already submitted this quiz!");
      return;
    }
    
    const now = Date.now();
    setEndTime(now);
    setFinished(true);
    setIsSubmitted(true);
    
    // Set 2-hour cooldown
    const twoHours = 2 * 60 * 60 * 1000;
    const cooldownEndTime = now + twoHours;
    
    localStorage.setItem('quizSubmission', JSON.stringify({
      answers,
      score: calculateScore(),
      timestamp: now,
      timeSpent: startTime ? now - startTime : 0
    }));
    localStorage.setItem('quizCooldownEnd', cooldownEndTime.toString());
    setCooldownEnd(cooldownEndTime);
    setRemainingTime(7200); // 2 hours in seconds
    
    toast.success("Quiz submitted successfully! Results saved.");
  };

  // Calculate score
  const calculateScore = () => {
    return answers.reduce((total, answer, index) => {
      if (answer === questions[index].correctAnswer) {
        return total + 1;
      }
      return total;
    }, 0);
  };

  const score = useMemo(calculateScore, [answers, questions]);

  // Print results
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const percentage = Math.round((score / questions.length) * 100);
    const timeSpent = startTime && endTime ? Math.floor((endTime - startTime) / 1000) : 0;
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Quiz Results - Grade 11 Mathematics</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
            .score-circle { width: 150px; height: 150px; border-radius: 50%; background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px; font-size: 48px; font-weight: bold; }
            .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
            .stat-box { background: #f3f4f6; padding: 20px; border-radius: 12px; text-align: center; }
            .stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 8px; }
            .stat-value { font-size: 24px; font-weight: bold; color: #111827; }
            .questions { margin-top: 30px; }
            .question { margin-bottom: 20px; padding: 20px; background: #f9fafb; border-radius: 12px; border-left: 4px solid ${percentage >= 70 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444'}; }
            .correct { color: #10b981; font-weight: 600; }
            .incorrect { color: #ef4444; font-weight: 600; }
            .timestamp { text-align: center; color: #6b7280; font-size: 14px; margin-top: 40px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Grade 11 Mathematics - Quiz Results</h1>
            <p>SwiftMeta Learning Platform</p>
          </div>
          
          <div class="score-circle">${percentage}%</div>
          
          <div class="stats">
            <div class="stat-box">
              <div class="stat-label">Score</div>
              <div class="stat-value">${score}/${questions.length}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Correct</div>
              <div class="stat-value">${score}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Time Spent</div>
              <div class="stat-value">${minutes}m ${seconds}s</div>
            </div>
          </div>
          
          <div class="questions">
            <h2>Question Breakdown</h2>
            ${questions.map((q, idx) => {
              const userAnswer = answers[idx];
              const isCorrect = userAnswer === q.correctAnswer;
              return `
                <div class="question">
                  <p><strong>Q${idx + 1}:</strong> ${q.question}</p>
                  <p>Your answer: ${userAnswer !== null ? q.options[userAnswer] : 'Not answered'}</p>
                  <p class="${isCorrect ? 'correct' : 'incorrect'}">
                    ${isCorrect ? '✓ Correct' : `✗ Incorrect - Correct answer: ${q.options[q.correctAnswer]}`}
                  </p>
                </div>
              `;
            }).join('')}
          </div>
          
          <p class="timestamp">Generated on ${new Date().toLocaleString()}</p>
          
          <div class="no-print" style="text-align: center; margin-top: 30px;">
            <button onclick="window.print()" style="padding: 12px 24px; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
              Print / Save as PDF
            </button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Start quiz
  const handleStart = () => {
    setShowWarning(false);
    setStartTime(Date.now());
  };

  // Cooldown expired
  const handleCooldownExpire = () => {
    setIsSubmitted(false);
    setCooldownEnd(null);
    setRemainingTime(0);
    restartQuiz();
  };

  // Restart quiz (only if cooldown expired)
  const restartQuiz = () => {
    if (cooldownEnd && Date.now() < cooldownEnd) {
      toast.error("Please wait for the cooldown period to end");
      return;
    }
    
    setAnswers(Array(questions.length).fill(null));
    setCurrentIndex(0);
    setFinished(false);
    setIsSubmitted(false);
    setStartTime(null);
    setEndTime(null);
    setCooldownEnd(null);
    setRemainingTime(0);
    localStorage.removeItem('quizSubmission');
    localStorage.removeItem('quizCooldownEnd');
    setShowWarning(true);
  };

  // Result screen
  if (finished || isSubmitted) {
    const percentage = Math.round((score / questions.length) * 100);
    const timeSpent = startTime && endTime ? Math.floor((endTime - startTime) / 1000) : 0;
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    
    let grade = 'F';
    let color = 'text-red-500';
    let bgGradient = 'from-red-500 to-orange-500';
    
    if (percentage >= 90) {
      grade = 'A+';
      color = 'text-emerald-500';
      bgGradient = 'from-emerald-400 to-teal-500';
    } else if (percentage >= 80) {
      grade = 'A';
      color = 'text-emerald-500';
      bgGradient = 'from-emerald-400 to-green-500';
    } else if (percentage >= 70) {
      grade = 'B';
      color = 'text-blue-500';
      bgGradient = 'from-blue-400 to-indigo-500';
    } else if (percentage >= 60) {
      grade = 'C';
      color = 'text-yellow-500';
      bgGradient = 'from-yellow-400 to-orange-500';
    } else if (percentage >= 50) {
      grade = 'D';
      color = 'text-orange-500';
      bgGradient = 'from-orange-400 to-red-400';
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className={`bg-gradient-to-r ${bgGradient} p-8 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
                <p className="text-white/80">Grade 11 Mathematics</p>
              </div>
              <Trophy className="w-12 h-12 text-white/80" />
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* Score Circle */}
            <div className="flex justify-center">
              <div className={`w-40 h-40 rounded-full bg-gradient-to-br ${bgGradient} flex flex-col items-center justify-center text-white shadow-xl`}>
                <span className="text-5xl font-bold">{percentage}%</span>
                <span className="text-sm font-medium opacity-80">Grade {grade}</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 text-center">
                <BarChart3 className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{score}/{questions.length}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Score</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 text-center">
                <CheckCircle className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{score}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Correct</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 text-center">
                <Timer className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{minutes}m {seconds}s</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Time</p>
              </div>
            </div>

            {/* Question Review */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Question Review
              </h3>
              <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {questions.map((q, idx) => {
                  const userAnswer = answers[idx];
                  const isCorrect = userAnswer === q.correctAnswer;
                  return (
                    <div 
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        isCorrect 
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' 
                          : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          Q{idx + 1}: {q.question}
                        </p>
                        {!isCorrect && (
                          <p className="text-xs text-gray-500">
                            Correct: {q.options[q.correctAnswer]}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                <Printer className="w-5 h-5" />
                Print Results
              </button>
              
              {cooldownEnd && remainingTime > 0 ? (
                <div className="flex-1">
                  <CooldownTimer 
                    remainingSeconds={remainingTime} 
                    onExpire={handleCooldownExpire}
                  />
                </div>
              ) : (
                <button
                  onClick={restartQuiz}
                  disabled={cooldownEnd && Date.now() < cooldownEnd}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Retake Quiz
                </button>
              )}
            </div>

            {/* Anti-cheat notice */}
            <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              Results secured • Anti-cheat measures active
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Warning modal
  if (showWarning) {
    return <AntiCheatWarning onAcknowledge={handleStart} />;
  }

  // Quiz screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Progress Header */}
        <div className="bg-gray-900 dark:bg-gray-800 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold">Grade 11 Mathematics</h1>
              <p className="text-sm text-gray-400">Question {currentIndex + 1} of {questions.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Progress</p>
              <p className="text-2xl font-bold">{Math.round(((currentIndex + 1) / questions.length) * 100)}%</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white leading-relaxed">
                {currentQuestion.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = answers[currentIndex] === index;
                  const letters = ["A", "B", "C", "D", "E", "F"];
                  
                  return (
                    <motion.button
                      key={index}
                      onClick={() => selectAnswer(index)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`
                        w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left
                        ${isSelected
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/10"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }
                      `}
                    >
                      <span className={`
                        w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-colors
                        ${isSelected
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                        }
                      `}>
                        {letters[index]}
                      </span>
                      <span className={`
                        flex-1 font-medium
                        ${isSelected ? "text-blue-900 dark:text-blue-100" : "text-gray-700 dark:text-gray-300"}
                      `}>
                        {option}
                      </span>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={prevQuestion}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <button
              onClick={nextQuestion}
              disabled={answers[currentIndex] === null && currentIndex !== questions.length - 1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
            >
              {currentIndex === questions.length - 1 ? (
                <>
                  Finish
                  <CheckCircle className="w-5 h-5" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Custom Scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}
