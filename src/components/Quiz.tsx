import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trophy, RotateCcw, Brain } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'Which command creates a new Git repository?',
    options: ['git create', 'git init', 'git new', 'git start'],
    correct: 1,
    explanation: 'git init creates a new Git repository in the current directory by creating a .git folder.'
  },
  {
    id: '2',
    question: 'What does "git add ." do?',
    options: [
      'Adds all files to the repository',
      'Adds all changes to the staging area',
      'Adds a new branch',
      'Adds a remote repository'
    ],
    correct: 1,
    explanation: 'git add . stages all changes in the current directory and subdirectories for the next commit.'
  },
  {
    id: '3',
    question: 'How do you undo the last commit but keep the changes?',
    options: [
      'git reset --hard HEAD~1',
      'git revert HEAD',
      'git reset --soft HEAD~1',
      'git undo'
    ],
    correct: 2,
    explanation: 'git reset --soft HEAD~1 undoes the last commit but keeps the changes staged.'
  },
  {
    id: '4',
    question: 'Which command shows the difference between working directory and staging area?',
    options: ['git diff', 'git status', 'git log', 'git show'],
    correct: 0,
    explanation: 'git diff shows the differences between the working directory and the staging area.'
  },
  {
    id: '5',
    question: 'What does "git stash" do?',
    options: [
      'Permanently saves changes',
      'Temporarily saves changes',
      'Deletes changes',
      'Commits changes'
    ],
    correct: 1,
    explanation: 'git stash temporarily saves changes that are not ready to be committed, allowing you to work on something else.'
  }
];

const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(new Array(quizQuestions.length).fill(false));

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === quizQuestions[currentQuestion].correct;
    if (isCorrect && !answeredQuestions[currentQuestion]) {
      setScore(score + 1);
    }

    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestion] = true;
    setAnsweredQuestions(newAnsweredQuestions);

    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions(new Array(quizQuestions.length).fill(false));
  };

  const isQuizComplete = currentQuestion === quizQuestions.length - 1 && showResult;
  const question = quizQuestions[currentQuestion];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-900/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Test Your Knowledge
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Put your Git skills to the test with our interactive quiz!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Quiz header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Brain className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Git Knowledge Quiz</h3>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm opacity-90">Score</div>
                  <div className="text-2xl font-bold">{score}/{quizQuestions.length}</div>
                </div>
                <button
                  onClick={resetQuiz}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm opacity-90 mb-2">
                <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                <span>{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  className="bg-white h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Quiz content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {!isQuizComplete ? (
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-2xl font-semibold text-gray-800 dark:text-white mb-8">
                    {question.question}
                  </h4>

                  <div className="space-y-4 mb-8">
                    {question.options.map((option, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                          selectedAnswer === index
                            ? showResult
                              ? index === question.correct
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                                : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                              : 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300'
                            : showResult && index === question.correct
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                            : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}
                        whileHover={{ scale: showResult ? 1 : 1.02 }}
                        whileTap={{ scale: showResult ? 1 : 0.98 }}
                        disabled={showResult}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono">{option}</span>
                          {showResult && (
                            <span className="ml-2">
                              {index === question.correct ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : selectedAnswer === index ? (
                                <XCircle className="h-5 w-5 text-red-500" />
                              ) : null}
                            </span>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-6"
                    >
                      <h5 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                        {selectedAnswer === question.correct ? '✅ Correct!' : '❌ Incorrect'}
                      </h5>
                      <p className="text-blue-700 dark:text-blue-300">{question.explanation}</p>
                    </motion.div>
                  )}

                  <div className="flex justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {answeredQuestions.filter(Boolean).length} of {quizQuestions.length} answered
                    </div>
                    <div className="space-x-4">
                      {!showResult ? (
                        <button
                          onClick={handleSubmitAnswer}
                          disabled={selectedAnswer === null}
                          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                          Submit Answer
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuestion}
                          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Complete Quiz'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
                  <h4 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                    Quiz Complete!
                  </h4>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                    You scored {score} out of {quizQuestions.length}
                  </p>
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 mb-8">
                    <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {Math.round((score / quizQuestions.length) * 100)}%
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {score === quizQuestions.length
                        ? 'Perfect! You\'re a Git master! 🏆'
                        : score >= quizQuestions.length * 0.8
                        ? 'Great job! You know your Git commands well! 👏'
                        : score >= quizQuestions.length * 0.6
                        ? 'Good work! Keep practicing to improve! 👍'
                        : 'Keep learning! Git mastery comes with practice! 💪'}
                    </p>
                  </div>
                  <button
                    onClick={resetQuiz}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Take Quiz Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Quiz;