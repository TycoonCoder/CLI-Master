import { useNavigate, useOutletContext } from 'react-router-dom';
import type { UserProgress } from '../core/types';

type ContextType = {
  progress: UserProgress;
  currentLesson: string;
  setCurrentLesson: (lessonId: string) => void;
  handleLessonComplete?: (lessonId: string, xpEarned: number, isFinal: boolean) => void;
  handleSpinComplete?: (bitsWon: number, xpBoost: boolean) => void;
  handleQuizComplete?: (score: number, total: number) => void;
  handlePurchase?: (itemId: string, cost: number) => boolean;
  handleResetProgress?: () => void;
};

export default function PracticePage() {
  const navigate = useNavigate();
  const { progress } = useOutletContext<ContextType>();

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  const handleStartReview = () => {
    navigate('/review');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={handleBack}
        className="text-primary-400 hover:text-foreground flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary-800 transition-colors mb-6"
      >
        <span>←</span>
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="card p-6 mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-3">Practice Mode</h2>
        <p className="text-primary-400">
          Choose between quiz mode or spaced repetition review to reinforce your learning.
          Earn XP for completing practice sessions!
        </p>
      </div>

      {/* Practice Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Quiz Card */}
        <div className="card p-6 hover:border-accent-500 transition-colors cursor-pointer"
             onClick={handleStartQuiz}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Take a Quiz</h3>
              <p className="text-sm text-primary-400">Test your knowledge</p>
            </div>
          </div>
          
          <p className="text-primary-300 mb-4">
            Answer multiple-choice questions about CLI commands you've learned.
            Earn up to 50 XP based on your score!
          </p>
          
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-primary-400">Questions:</span>
              <span className="font-semibold text-foreground">10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-400">Time:</span>
              <span className="font-semibold text-foreground">10-15 min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-400">XP Reward:</span>
              <span className="font-semibold text-warning">Up to 50 XP</span>
            </div>
          </div>
          
          <button className="btn-primary w-full">
            Start Quiz
          </button>
        </div>

        {/* Review Card */}
        <div className="card p-6 hover:border-accent-500 transition-colors cursor-pointer"
             onClick={handleStartReview}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔁</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Spaced Repetition</h3>
              <p className="text-sm text-primary-400">Reinforce your memory</p>
            </div>
          </div>
          
          <p className="text-primary-300 mb-4">
            Review previously learned material using spaced repetition techniques.
            This helps move knowledge from short-term to long-term memory.
          </p>
          
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-primary-400">Items:</span>
              <span className="font-semibold text-foreground">Based on completion</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-400">Time:</span>
              <span className="font-semibold text-foreground">5-10 min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-400">XP Reward:</span>
              <span className="font-semibold text-warning">10 XP per session</span>
            </div>
          </div>
          
          <button className="btn-secondary w-full">
            Start Review
          </button>
        </div>
      </div>

      {/* Practice Stats */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">Your Practice Stats</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-primary-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground mb-1">{progress.completedLessons.size}</div>
            <div className="text-sm text-primary-400">Lessons Completed</div>
          </div>
          <div className="bg-primary-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground mb-1">
              {Math.floor(progress.completedLessons.size * 3.5)}
            </div>
            <div className="text-sm text-primary-400">Commands Learned</div>
          </div>
          <div className="bg-primary-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground mb-1">
              {Math.floor(progress.completedLessons.size * 15)}
            </div>
            <div className="text-sm text-primary-400">Minutes Practiced</div>
          </div>
        </div>

        <div className="border-t border-primary-800 pt-4">
          <h4 className="font-semibold text-foreground mb-3">Tips for Effective Practice</h4>
          <ul className="space-y-2 text-primary-300">
            <li className="flex items-start gap-2">
              <span className="text-accent-500">•</span>
              <span>Take quizzes regularly to test your understanding</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-500">•</span>
              <span>Use spaced repetition for long-term retention</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-500">•</span>
              <span>Focus on areas where you make mistakes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-500">•</span>
              <span>Practice daily to maintain your streak</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}