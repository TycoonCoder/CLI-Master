import { useState } from 'react';
import '@xterm/xterm/css/xterm.css';
import './Terminal.css';
import LessonView from './LessonView';

interface TerminalProps {
  lessonId: string;
  onLessonComplete: (lessonId: string, xpEarned: number, isFinal: boolean) => void;
  onActivity: () => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

const Terminal: React.FC<TerminalProps> = ({ lessonId, onLessonComplete, onActivity, onNextLesson, hasNextLesson }) => {
  const [isLessonMode, setIsLessonMode] = useState(true);

  const handleLessonComplete = (xpEarned: number, isFinal: boolean) => {
    onLessonComplete(lessonId, xpEarned, isFinal);
  };

  const toggleMode = () => {
    setIsLessonMode(!isLessonMode);
  };

  if (isLessonMode) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Interactive Lesson</h3>
            <p className="text-gray-600 text-sm">Follow instructions and type commands to learn</p>
          </div>
          <button
            onClick={toggleMode}
            className="btn-secondary text-sm"
          >
            Switch to Free Practice
          </button>
        </div>
        
        <LessonView
          lessonId={lessonId}
          onComplete={handleLessonComplete}
          onActivity={onActivity}
          onNextLesson={onNextLesson}
          hasNextLesson={hasNextLesson}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Free Practice Mode</h3>
          <p className="text-gray-600 text-sm">Practice commands freely in the terminal</p>
        </div>
        <button
          onClick={toggleMode}
          className="btn-secondary text-sm"
        >
          Switch to Lesson Mode
        </button>
      </div>
      
      <div className="bg-gray-900 text-gray-100 rounded-2xl p-4 font-mono h-64 overflow-y-auto">
        <div className="text-green-400">Welcome to Free Practice Mode!</div>
        <div className="text-gray-400 mt-2">Try commands like: pwd, ls, cd, cat, echo, mkdir, touch, clear</div>
        <div className="text-gray-400 mt-4">Type "help" for available commands</div>
        
        <div className="mt-6">
          <div className="text-cyan-300">user@climaster:~$ <span className="animate-pulse">█</span></div>
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-600">
        Free practice mode coming soon! Currently only lesson mode is available.
      </div>
    </div>
  );
};

export default Terminal;