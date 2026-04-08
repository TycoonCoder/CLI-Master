import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import Terminal from './Terminal';
import ProgressBar from './ProgressBar';
import LessonPath from './LessonPath';
import SpinWheel from './SpinWheel';
import type { UserProgress } from '../core/types';
import { getNextLessonId } from '../core/lessons';

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

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const currentLessonId = lessonId || 'lesson-1';
  
  const {
    progress,
    setCurrentLesson,
    handleLessonComplete,
    handleSpinComplete
  } = useOutletContext<ContextType>();

  const onLessonComplete = (lessonId: string, xpEarned: number, isFinal: boolean) => {
    console.log('🎯 Lesson complete:', { lessonId, xpEarned, isFinal });
    
    // Call parent handler to update progress
    if (handleLessonComplete) {
      handleLessonComplete(lessonId, xpEarned, isFinal);
    }
    
    // Show spin wheel on final completion
    if (isFinal) {
      setTimeout(() => setShowSpinWheel(true), 1000);
    }
  };

  const onSpinComplete = (bitsWon: number, xpBoost: boolean) => {
    console.log('🎲 Spin wheel completed:', { bitsWon, xpBoost });
    setShowSpinWheel(false);
    // Call parent handler to update progress
    if (handleSpinComplete) {
      handleSpinComplete(bitsWon, xpBoost);
    }
    // Redirect to lesson selection page (dashboard)
    navigate('/');
  };

  const handleNextLesson = () => {
    const nextLessonId = getNextLessonId(currentLessonId);
    if (nextLessonId) {
      navigate(`/lesson/${nextLessonId}`);
      setCurrentLesson(nextLessonId);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (showSpinWheel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <SpinWheel 
          onSpinComplete={onSpinComplete}
          onClose={() => setShowSpinWheel(false)}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Back button */}
      <div className="lg:col-span-3 mb-4">
        <button
          onClick={handleBack}
          className="text-primary-400 hover:text-foreground flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary-800 transition-colors"
        >
          <span>←</span>
          Back to Lessons
        </button>
      </div>
      
      {/* Left Column: Terminal */}
      <div className="lg:col-span-2">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-foreground mb-3">Interactive Lesson: {currentLessonId}</h2>
          <p className="text-primary-400 mb-6">Type commands below to complete the lesson challenge!</p>
          
          <div className="terminal-window p-4">
            <Terminal 
              lessonId={currentLessonId}
              onLessonComplete={onLessonComplete}
              onActivity={() => {/* handled by parent */}}
              onNextLesson={handleNextLesson}
              hasNextLesson={!!getNextLessonId(currentLessonId)}
            />
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold text-foreground mb-2">Overall Progress</h3>
            <ProgressBar 
              current={progress.completedLessons.size}
              total={12}
              label={`${progress.completedLessons.size} of 12 lessons completed`}
            />
          </div>
        </div>
      </div>
      
      {/* Right Column: Lesson Path & Stats */}
      <div className="space-y-6">
        {/* Daily Goal */}
        <div className="card p-5">
          <h3 className="font-semibold text-foreground mb-3">Daily Goal</h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-foreground">{progress.completedLessons.size}/3</div>
              <div className="text-sm text-primary-400">lessons today</div>
            </div>
            <div className="w-14 h-14 rounded-full bg-accent-500 flex items-center justify-center">
              <span className="text-white font-bold">{Math.min(100, Math.floor((progress.completedLessons.size / 3) * 100))}%</span>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="btn-primary w-full">
            View All Lessons
          </button>
        </div>
        
        {/* Lesson Path */}
        <div className="card p-5">
          <h3 className="font-semibold text-foreground mb-4">Learning Path</h3>
          <LessonPath 
            currentLesson={currentLessonId}
            onSelectLesson={(lessonId) => {
              navigate(`/lesson/${lessonId}`);
              setCurrentLesson(lessonId);
            }}
            completedLessons={progress.completedLessons}
          />
        </div>
        
        {/* Quick Stats */}
        <div className="card p-5">
          <h3 className="font-semibold text-foreground mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-primary-400">Total Commands</span>
              <span className="font-bold text-foreground">{progress.completedLessons.size * 3}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-primary-400">Accuracy Rate</span>
              <span className="font-bold text-terminal-success">92%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-primary-400">Time Practiced</span>
              <span className="font-bold text-foreground">{progress.completedLessons.size * 15} min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}