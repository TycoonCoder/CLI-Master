import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import QuizSystem from './QuizSystem';
import type { UserProgress } from '../core/types';

type ContextType = {
  progress: UserProgress;
  currentLesson: string;
  handleQuizComplete?: (score: number, total: number) => void;
  handleLessonComplete?: (lessonId: string, xpEarned: number, isFinal: boolean) => void;
  handleSpinComplete?: (bitsWon: number, xpBoost: boolean) => void;
  handlePurchase?: (itemId: string, cost: number) => boolean;
  handleResetProgress?: () => void;
};

export default function QuizPage() {
  const navigate = useNavigate();
  const context = useOutletContext<ContextType>();
  const { currentLesson } = context;
  const [showQuiz, setShowQuiz] = useState(true);

  const handleQuizComplete = (score: number, total: number) => {
    const xpEarned = Math.floor((score / total) * 50);
    console.log(`🎯 Quiz completed! Score: ${score}/${total}, XP earned: ${xpEarned}`);
    
    // Call parent handler to update progress
    if (context.handleQuizComplete) {
      context.handleQuizComplete(score, total);
    }
    
    // Show completion message
    setTimeout(() => {
      setShowQuiz(false);
      // Show completion modal
    }, 1000);
  };

  const handleBack = () => {
    navigate('/practice');
  };

  const handleExit = () => {
    navigate('/practice');
  };

  if (showQuiz) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-primary-900/95 backdrop-blur-sm border-b border-primary-800">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                className="text-primary-400 hover:text-foreground flex items-center gap-2"
              >
                <span>←</span>
                Back to Practice
              </button>
              <div className="text-foreground font-semibold">Quiz Mode</div>
              <div className="w-6" /> {/* Spacer */}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <QuizSystem 
            lessonId={currentLesson}
            onComplete={handleQuizComplete}
            onClose={handleExit}
          />
        </div>
      </div>
    );
  }

  // Completion screen
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="card p-8 max-w-md text-center">
        <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🎉</span>
        </div>
        
        <h2 className="text-2xl font-bold text-foreground mb-3">Quiz Completed!</h2>
        <p className="text-primary-400 mb-6">
          Great job! You've earned XP for completing the quiz.
        </p>
        
        <div className="bg-primary-800 rounded-lg p-4 mb-6">
          <div className="text-sm text-primary-400 mb-2">Quiz Rewards</div>
          <div className="text-xl font-bold text-warning">+50 XP Earned</div>
          <div className="text-sm text-primary-300 mt-1">Added to your total XP</div>
        </div>
        
        <button
          onClick={handleExit}
          className="btn-primary w-full"
        >
          Return to Practice
        </button>
      </div>
    </div>
  );
}