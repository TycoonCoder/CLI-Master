import React, { useState, useEffect } from 'react';

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'command-input' | 'matching';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

interface QuizProps {
  lessonId?: string;
  completedLessons?: Set<string>;
  onComplete?: (score: number, total: number) => void;
  onClose: () => void;
}

const QuizSystem: React.FC<QuizProps> = ({ lessonId, onComplete, onClose }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds

  // Quiz questions by lesson topic
  const quizBank: Record<string, QuizQuestion[]> = {
    'navigation': [
      {
        id: 'q1',
        question: 'Which command shows your current directory?',
        type: 'multiple-choice',
        options: ['cd', 'ls', 'pwd', 'where'],
        correctAnswer: 'pwd',
        explanation: 'pwd stands for "Print Working Directory" and shows your current location.',
        difficulty: 'easy',
        tags: ['pwd', 'navigation']
      },
      {
        id: 'q2',
        question: 'To go to your home directory, you use:',
        type: 'multiple-choice',
        options: ['cd /', 'cd ~', 'cd home', 'cd $HOME'],
        correctAnswer: 'cd ~',
        explanation: 'Both cd ~ and cd $HOME work, but ~ is the standard shortcut for home directory.',
        difficulty: 'easy',
        tags: ['cd', 'navigation']
      }
    ],
    'file-operations': [
      {
        id: 'q3',
        question: 'Which command creates an empty file?',
        type: 'multiple-choice',
        options: ['mkdir', 'touch', 'create', 'new'],
        correctAnswer: 'touch',
        explanation: 'touch creates empty files or updates file timestamps.',
        difficulty: 'easy',
        tags: ['touch', 'files']
      },
      {
        id: 'q4',
        question: 'To create a directory called "projects", you use:',
        type: 'command-input',
        correctAnswer: 'mkdir projects',
        explanation: 'mkdir stands for "make directory" and creates new folders.',
        difficulty: 'easy',
        tags: ['mkdir', 'directories']
      }
    ],
    'text-processing': [
      {
        id: 'q5',
        question: 'Which command searches for patterns within files?',
        type: 'multiple-choice',
        options: ['find', 'grep', 'search', 'locate'],
        correctAnswer: 'grep',
        explanation: 'grep searches for text patterns using regular expressions.',
        difficulty: 'medium',
        tags: ['grep', 'search']
      },
      {
        id: 'q6',
        question: 'To find all .txt files in current directory:',
        type: 'command-input',
        correctAnswer: 'find . -name "*.txt"',
        explanation: 'find searches for files, . means current directory, -name matches filename pattern.',
        difficulty: 'medium',
        tags: ['find', 'files']
      }
    ],
    'advanced': [
      {
        id: 'q7',
        question: 'sed "s/old/new/" file.txt replaces:',
        type: 'multiple-choice',
        options: ['First occurrence of "old" with "new"', 'All occurrences of "old" with "new"', 'Deletes lines with "old"', 'Nothing - syntax is wrong'],
        correctAnswer: 'First occurrence of "old" with "new"',
        explanation: 'By default sed replaces only first occurrence per line. Add "g" flag for all: s/old/new/g',
        difficulty: 'hard',
        tags: ['sed', 'text-processing']
      },
      {
        id: 'q8',
        question: 'awk -F"," \'{print $1}\' data.csv prints:',
        type: 'multiple-choice',
        options: ['First line', 'First column', 'All data', 'Nothing - wrong syntax'],
        correctAnswer: 'First column',
        explanation: '-F"," sets comma as field separator, $1 refers to first field (column).',
        difficulty: 'hard',
        tags: ['awk', 'csv']
      }
    ]
  };

  useEffect(() => {
    // Select questions based on lesson
    let selectedQuestions: QuizQuestion[] = [];
    
    const lessonIdSafe = lessonId || 'mixed';
    
    if (lessonIdSafe.includes('lesson-1') || lessonIdSafe.includes('lesson-2') || lessonIdSafe.includes('lesson-3')) {
      selectedQuestions = [...quizBank['navigation']];
    } else if (lessonIdSafe.includes('lesson-4') || lessonIdSafe.includes('lesson-5') || lessonIdSafe.includes('lesson-6')) {
      selectedQuestions = [...quizBank['file-operations']];
    } else if (lessonIdSafe.includes('lesson-11') || lessonIdSafe.includes('lesson-12') || lessonIdSafe.includes('lesson-13')) {
      selectedQuestions = [...quizBank['text-processing']];
    } else {
      // Mixed quiz
      selectedQuestions = [
        ...quizBank['navigation'].slice(0, 2),
        ...quizBank['file-operations'].slice(0, 2),
        ...quizBank['text-processing'].slice(0, 2),
        ...quizBank['advanced'].slice(0, 2)
      ];
    }
    
    // Shuffle questions
    selectedQuestions = selectedQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, 8); // Take 8 questions
    
    setQuestions(selectedQuestions);
  }, [lessonId]);

  useEffect(() => {
    if (timeRemaining > 0 && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeRemaining, isSubmitted]);

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    
    questions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      const correctAnswer = question.correctAnswer;
      
      if (Array.isArray(correctAnswer)) {
        if (Array.isArray(userAnswer) && 
            userAnswer.length === correctAnswer.length &&
            userAnswer.every((ans, idx) => ans === correctAnswer[idx])) {
          calculatedScore++;
        }
      } else {
        if (userAnswer === correctAnswer) {
          calculatedScore++;
        }
      }
    });
    
    setScore(calculatedScore);
    setIsSubmitted(true);
    if (onComplete) {
      onComplete(calculatedScore, questions.length);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="card max-w-md w-full p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">📝</div>
            <h2 className="text-xl font-bold text-foreground mb-4">Loading Quiz...</h2>
            <p className="text-primary-300 mb-6">Preparing questions for your lesson.</p>
            <button onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">📝 Knowledge Check</h2>
            <p className="text-sm text-primary-300">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-primary-800 rounded-lg px-3 py-2">
              <div className="flex items-center space-x-2">
                <span className="text-warning">⏱️</span>
                <span className="font-semibold">{formatTime(timeRemaining)}</span>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="text-primary-400 hover:text-foreground"
            >
              ✕
            </button>
          </div>
        </div>

        {!isSubmitted ? (
          <>
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-primary-300 mb-2">
                <span>Progress</span>
                <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            {currentQuestion && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      currentQuestion.difficulty === 'easy' 
                        ? 'bg-green-100 text-green-800' 
                        : currentQuestion.difficulty === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {currentQuestion.difficulty.toUpperCase()}
                    </span>
                    <span className="text-sm text-primary-400">
                      {currentQuestion.tags.join(', ')}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-6">
                  {currentQuestion.question}
                </h3>

                {/* Question Type Renderer */}
                {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(currentQuestion.id, option)}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                          userAnswers[currentQuestion.id] === option
                            ? 'border-accent-500 bg-accent-500/10'
                            : 'border-primary-700 hover:border-accent-500'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            userAnswers[currentQuestion.id] === option
                              ? 'bg-accent-500 text-white'
                              : 'border border-primary-600'
                          }`}>
                            {userAnswers[currentQuestion.id] === option ? '✓' : ''}
                          </div>
                          <span className="text-foreground">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {currentQuestion.type === 'command-input' && (
                  <div className="space-y-4">
                    <div className="bg-terminal-bg rounded-lg p-4 font-mono">
                      <div className="flex items-center">
                        <span className="text-terminal-prompt">user@climaster:~$</span>
                        <input
                          type="text"
                          value={userAnswers[currentQuestion.id] || ''}
                          onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                          className="flex-1 bg-transparent border-none outline-none text-terminal-text ml-2"
                          placeholder="Type your command..."
                          autoFocus
                        />
                      </div>
                    </div>
                    <p className="text-sm text-primary-400">
                      Enter the command you would type to solve this problem.
                    </p>
                  </div>
                )}

                {currentQuestion.type === 'true-false' && (
                  <div className="grid grid-cols-2 gap-3">
                    {['True', 'False'].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleAnswer(currentQuestion.id, option)}
                        className={`p-4 rounded-lg border transition-all ${
                          userAnswers[currentQuestion.id] === option
                            ? 'border-accent-500 bg-accent-500/10'
                            : 'border-primary-700 hover:border-accent-500'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            userAnswers[currentQuestion.id] === option
                              ? 'bg-accent-500 text-white'
                              : 'border border-primary-600'
                          }`}>
                            {userAnswers[currentQuestion.id] === option ? '✓' : ''}
                          </div>
                          <span className="text-foreground font-semibold">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-primary-800">
                  <button
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0}
                    className={`btn-secondary ${currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    ← Previous
                  </button>
                  
                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      onClick={handleNext}
                      className="btn-primary"
                      disabled={!userAnswers[currentQuestion.id]}
                    >
                      Next Question →
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="btn-primary"
                      disabled={!userAnswers[currentQuestion.id]}
                    >
                      Submit Quiz
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Results Screen */
          <div className="text-center">
            <div className="text-6xl mb-6">🎯</div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Quiz Complete!</h2>
            
            <div className="mb-8">
              <div className="text-5xl font-bold text-foreground mb-2">
                {score}/{questions.length}
              </div>
              <div className="text-lg text-primary-300">
                {score === questions.length ? 'Perfect Score! 🎉' : 
                 score >= questions.length * 0.7 ? 'Great Job! 👍' : 
                 'Keep Practicing! 💪'}
              </div>
              
              <div className="mt-6 progress-bar mx-auto max-w-md">
                <div 
                  className="progress-fill"
                  style={{ width: `${(score / questions.length) * 100}%` }}
                ></div>
              </div>
              <div className="text-sm text-primary-400 mt-2">
                {Math.round((score / questions.length) * 100)}% Correct
              </div>
            </div>

            {/* Review Incorrect Answers */}
            {score < questions.length && (
              <div className="mb-8 text-left">
                <h3 className="font-semibold text-foreground mb-4">Review Incorrect Answers:</h3>
                <div className="space-y-4">
                  {questions.map((q) => {
                    const userAnswer = userAnswers[q.id];
                    const isCorrect = Array.isArray(q.correctAnswer) 
                      ? Array.isArray(userAnswer) && 
                        userAnswer.length === q.correctAnswer.length &&
                        userAnswer.every((ans, i) => ans === q.correctAnswer[i])
                      : userAnswer === q.correctAnswer;
                    
                    if (!isCorrect) {
                      return (
                        <div key={q.id} className="p-4 bg-primary-800/50 rounded-lg border border-primary-700">
                          <div className="flex items-start space-x-3">
                            <div className="text-danger">✗</div>
                            <div className="flex-1">
                              <p className="font-semibold text-foreground mb-2">{q.question}</p>
                              <div className="text-sm text-primary-300 mb-2">
                                <span className="font-semibold">Your answer:</span> {Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer}
                              </div>
                              <div className="text-sm text-terminal-success mb-2">
                                <span className="font-semibold">Correct answer:</span> {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}
                              </div>
                              <p className="text-sm text-primary-400">{q.explanation}</p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="mb-8 p-4 bg-primary-800/30 rounded-lg border border-primary-700">
              <h3 className="font-semibold text-foreground mb-3">Recommendations</h3>
              <div className="space-y-2 text-sm text-primary-300">
                {score === questions.length ? (
                  <p>Excellent! You've mastered these concepts. Move on to the next lesson!</p>
                ) : score >= questions.length * 0.7 ? (
                  <p>Good understanding! Review the incorrect answers above and try the review lesson.</p>
                ) : (
                  <p>Consider revisiting the lesson material and practicing more before continuing.</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setUserAnswers({});
                  setIsSubmitted(false);
                  setScore(0);
                  setTimeRemaining(600);
                }}
                className="btn-secondary"
              >
                Retake Quiz
              </button>
              <button
                onClick={onClose}
                className="btn-primary"
              >
                Continue Learning
              </button>
            </div>

            {/* XP Reward */}
            <div className="mt-8 p-4 bg-warning/10 rounded-lg border border-warning/30">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-warning">✨</span>
                <span className="font-semibold text-foreground">
                  +{Math.floor((score / questions.length) * 50)} XP Earned
                </span>
              </div>
              <p className="text-sm text-primary-300 mt-1">
                XP awarded based on quiz performance
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizSystem;