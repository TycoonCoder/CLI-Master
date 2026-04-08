import { useNavigate, useOutletContext } from 'react-router-dom';
import LessonPath from './LessonPath';
import ProgressBar from './ProgressBar';
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

export default function DashboardPage() {
  const navigate = useNavigate();
  const {
    progress,
    currentLesson,
    setCurrentLesson
  } = useOutletContext<ContextType>();

  const handleStartLesson = (lessonId: string) => {
    navigate(`/lesson/${lessonId}`);
    setCurrentLesson(lessonId);
  };

  const handlePractice = () => {
    navigate('/practice');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Welcome Section */}
      <div className="lg:col-span-3 mb-6">
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Welcome back! 👋</h2>
          <p className="text-primary-400 mb-6">
            Continue your CLI learning journey. You've completed {progress.completedLessons.size} lessons and earned {progress.xp} XP!
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={() => handleStartLesson(currentLesson)}
              className="btn-primary flex-1"
            >
              Continue Current Lesson
            </button>
            <button
              onClick={handlePractice}
              className="btn-secondary flex-1"
            >
              Practice Mode
            </button>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="lg:col-span-2">
        <div className="card p-6">
          <h3 className="text-xl font-bold text-foreground mb-4">Your Learning Progress</h3>
          
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-2">Overall Completion</h4>
            <ProgressBar 
              current={progress.completedLessons.size}
              total={12}
              label={`${progress.completedLessons.size} of 12 lessons completed`}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-foreground mb-1">{progress.xp}</div>
              <div className="text-sm text-primary-400">Total XP</div>
            </div>
            <div className="bg-primary-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-foreground mb-1">{progress.level}</div>
              <div className="text-sm text-primary-400">Current Level</div>
            </div>
            <div className="bg-primary-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-foreground mb-1">{progress.streak}</div>
              <div className="text-sm text-primary-400">Day Streak</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
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
          <button onClick={() => handleStartLesson(currentLesson)} className="btn-primary w-full">
            Continue Learning
          </button>
        </div>
        
        {/* Practice Section */}
        <div className="card p-5">
          <h3 className="font-semibold text-foreground mb-4">Practice & Review</h3>
          <p className="text-primary-400 mb-4">
            Reinforce your learning with quizzes and spaced repetition.
          </p>
          <button
            onClick={handlePractice}
            className="btn-secondary w-full mb-3"
          >
            Take a Quiz
          </button>
          <button
            onClick={handlePractice}
            className="btn-tertiary w-full"
          >
            Spaced Repetition
          </button>
        </div>
        
        {/* Shop Link */}
        <div className="card p-5">
          <h3 className="font-semibold text-foreground mb-4">Shop & Rewards</h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-foreground">{progress.bits}</div>
              <div className="text-sm text-primary-400">Bits Available</div>
            </div>
            <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center">
              <span className="text-lg">🪙</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="btn-primary w-full"
          >
            Visit Shop
          </button>
        </div>
      </div>
      
      {/* Lesson Path */}
      <div className="lg:col-span-3">
        <div className="card p-6">
          <h3 className="text-xl font-bold text-foreground mb-4">Learning Path</h3>
          <LessonPath 
            currentLesson={currentLesson}
            onSelectLesson={handleStartLesson}
            completedLessons={progress.completedLessons}
          />
        </div>
      </div>
    </div>
  );
}