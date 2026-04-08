import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import ReviewSystem from './ReviewSystem';
import type { UserProgress } from '../core/types';

type ContextType = {
  progress: UserProgress;
};

export default function ReviewPage() {
  const navigate = useNavigate();
  const { progress } = useOutletContext<ContextType>();
  const [showReview, setShowReview] = useState(true);
  const [xpEarned, setXpEarned] = useState(0);

  const handleReviewComplete = (correct: number, total: number) => {
    const earned = Math.floor((correct / total) * 20) + 10; // Base 10 XP + up to 20 for accuracy
    setXpEarned(earned);
    console.log(`🔁 Review completed! Correct: ${correct}/${total}, XP earned: ${earned}`);
    
    setTimeout(() => {
      setShowReview(false);
    }, 1000);
  };

  const handleBack = () => {
    navigate('/practice');
  };

  const handleExit = () => {
    navigate('/practice');
  };

  if (showReview) {
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
              <div className="text-foreground font-semibold">Spaced Repetition Review</div>
              <div className="w-6" /> {/* Spacer */}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <ReviewSystem 
            completedLessons={progress.completedLessons}
            onComplete={(lessonId, challengeId, success) => {
              console.log(`Review item ${lessonId}/${challengeId}: ${success ? 'correct' : 'incorrect'}`);
            }}
            onClose={handleExit}
            onSessionComplete={handleReviewComplete}
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
          <span className="text-3xl">🧠</span>
        </div>
        
        <h2 className="text-2xl font-bold text-foreground mb-3">Review Session Complete!</h2>
        <p className="text-primary-400 mb-6">
          Excellent work! Spaced repetition helps move knowledge to long-term memory.
        </p>
        
        <div className="bg-primary-800 rounded-lg p-4 mb-6">
          <div className="text-sm text-primary-400 mb-2">Session Rewards</div>
          <div className="text-xl font-bold text-warning">+{xpEarned} XP Earned</div>
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