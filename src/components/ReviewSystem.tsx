import React, { useState, useEffect } from 'react';
import { getLessonById } from '../core/lessons';
import { CLISimulator } from '../core/simulator';
import TerminalOutput from './TerminalOutput';

interface ReviewItem {
  lessonId: string;
  challengeId: string;
  command: string;
  description: string;
  difficulty: number; // 1-5
  lastReviewed: Date | null;
  nextReview: Date;
  correctCount: number;
  incorrectCount: number;
}

interface ReviewSystemProps {
  completedLessons: Set<string>;
  onComplete: (lessonId: string, challengeId: string, success: boolean) => void;
  onClose: () => void;
  onSessionComplete?: (correct: number, total: number) => void;
}

const ReviewSystem: React.FC<ReviewSystemProps> = ({ completedLessons, onComplete, onClose, onSessionComplete }) => {
  const [simulator] = useState(() => new CLISimulator());
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isReviewComplete, setIsReviewComplete] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    // Generate review items from completed lessons
    const items: ReviewItem[] = [];
    
    Array.from(completedLessons).forEach(lessonId => {
      const lesson = getLessonById(lessonId);
      if (lesson) {
        // Take 1-3 challenges from each completed lesson
        const challengesToReview = lesson.challenges
          .filter(challenge => challenge.expectedCommand.trim() !== '') // Skip teaching messages
          .slice(0, 3); // Take up to 3 challenges per lesson
        
        challengesToReview.forEach(challenge => {
          const now = new Date();
          const nextReview = new Date(now);
          // Schedule review based on difficulty
          nextReview.setDate(now.getDate() + Math.floor(Math.random() * 3) + 1);
          
          items.push({
            lessonId,
            challengeId: challenge.id,
            command: challenge.expectedCommand,
            description: challenge.description,
            difficulty: Math.floor(Math.random() * 3) + 1, // 1-3
            lastReviewed: null,
            nextReview,
            correctCount: 0,
            incorrectCount: 0
          });
        });
      }
    });
    
    // Shuffle items
    const shuffled = items.sort(() => Math.random() - 0.5).slice(0, 10); // Limit to 10 items
    setReviewItems(shuffled);
    
    if (shuffled.length > 0) {
      const firstItem = shuffled[0];
      setTerminalOutput([`Review: ${firstItem.description}`]);
    }
  }, [completedLessons]);

  const handleCommandSubmit = () => {
    if (isReviewComplete || reviewItems.length === 0) return;
    
    const currentItem = reviewItems[currentItemIndex];
    const result = simulator.executeCommand(userInput);
    
    setTerminalOutput(prev => [
      ...prev,
      `$ ${userInput}`,
      ...(result.output.trim() ? [result.output.trim()] : [])
    ]);

    const normalizedInput = userInput.trim();
    const normalizedExpected = currentItem.command.trim();
    
    let isCorrect = false;
    
    // Simple exact match (for review we can be less strict)
    if (normalizedInput === normalizedExpected) {
      isCorrect = true;
    }
    // Handle command chains
    else if (normalizedExpected.includes('&&')) {
      const expectedParts = normalizedExpected.split('&&').map(p => p.trim());
      const inputParts = normalizedInput.split('&&').map(p => p.trim());
      
      if (expectedParts.length === inputParts.length) {
        isCorrect = expectedParts.every((part, i) => {
          if (part.startsWith('echo ') && inputParts[i].startsWith('echo ')) {
            const partContent = part.substring(5).replace(/["']/g, '');
            const inputContent = inputParts[i].substring(5).replace(/["']/g, '');
            return partContent === inputContent;
          }
          return part === inputParts[i];
        });
      }
    }

    if (isCorrect) {
      setTerminalOutput(prev => [...prev, '✅ Correct! Well remembered!']);
      setStats(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
      
      // Update item stats
      const updatedItems = [...reviewItems];
      updatedItems[currentItemIndex] = {
        ...currentItem,
        correctCount: currentItem.correctCount + 1,
        lastReviewed: new Date(),
        nextReview: new Date(Date.now() + (24 * 60 * 60 * 1000 * (currentItem.difficulty + 1))) // Days based on difficulty
      };
      setReviewItems(updatedItems);
      
      onComplete(currentItem.lessonId, currentItem.challengeId, true);
    } else {
      setTerminalOutput(prev => [...prev, `❌ Not quite. The command was: ${currentItem.command}`]);
      setStats(prev => ({ ...prev, total: prev.total + 1 }));
      
      // Update item stats
      const updatedItems = [...reviewItems];
      updatedItems[currentItemIndex] = {
        ...currentItem,
        incorrectCount: currentItem.incorrectCount + 1,
        lastReviewed: new Date(),
        nextReview: new Date(Date.now() + (24 * 60 * 60 * 1000)) // Review again tomorrow
      };
      setReviewItems(updatedItems);
      
      onComplete(currentItem.lessonId, currentItem.challengeId, false);
    }

    setTimeout(() => {
      if (currentItemIndex < reviewItems.length - 1) {
        setCurrentItemIndex(currentItemIndex + 1);
        const nextItem = reviewItems[currentItemIndex + 1];
        setTerminalOutput([`Review: ${nextItem.description}`]);
        setUserInput('');
      } else {
        setIsReviewComplete(true);
        if (onSessionComplete) {
          onSessionComplete(stats.correct, reviewItems.length);
        }
      }
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommandSubmit();
    }
  };

  const calculateMastery = () => {
    if (reviewItems.length === 0) return 0;
    return Math.round((stats.correct / reviewItems.length) * 100);
  };

  // This function is available if needed to manually end the session
// const handleSessionEnd = () => {
//   if (onSessionComplete && !isReviewComplete) {
//     onSessionComplete(stats.correct, reviewItems.length);
//   }
//   setIsReviewComplete(true);
// };

  if (reviewItems.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="card max-w-md w-full p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">📚</div>
            <h2 className="text-xl font-bold text-foreground mb-4">No Reviews Available</h2>
            <p className="text-primary-300 mb-6">
              Complete more lessons to generate review items. Spaced repetition helps reinforce learning.
            </p>
            <button onClick={onClose} className="btn-primary">Continue Learning</button>
          </div>
        </div>
      </div>
    );
  }

  if (isReviewComplete) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="card max-w-md w-full p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-xl font-bold text-foreground mb-4">Review Complete!</h2>
            
            <div className="mb-8">
              <div className="text-5xl font-bold text-foreground mb-2">
                {stats.correct}/{reviewItems.length}
              </div>
              <div className="text-lg text-primary-300">
                Mastery: {calculateMastery()}%
              </div>
              
              <div className="mt-6 progress-bar mx-auto max-w-md">
                <div 
                  className="progress-fill"
                  style={{ width: `${calculateMastery()}%` }}
                ></div>
              </div>
            </div>

            {/* Item Statistics */}
            <div className="mb-8 text-left">
              <h3 className="font-semibold text-foreground mb-4">Performance Summary</h3>
              <div className="space-y-2">
                {reviewItems.map((item, idx) => {
                  const isCorrect = item.correctCount > item.incorrectCount;
                  return (
                    <div key={idx} className="flex items-center justify-between p-2 bg-primary-800/30 rounded">
                      <span className="text-sm text-primary-300 truncate">{item.description.slice(0, 40)}...</span>
                      <span className={`text-sm font-semibold ${isCorrect ? 'text-terminal-success' : 'text-terminal-error'}`}>
                        {isCorrect ? '✓' : '✗'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next Review Schedule */}
            <div className="mb-8 p-4 bg-primary-800/30 rounded-lg border border-primary-700">
              <h3 className="font-semibold text-foreground mb-3">Next Review</h3>
              <p className="text-sm text-primary-300">
                Based on your performance, the system will schedule your next review session to optimize memory retention.
              </p>
              <div className="mt-4 flex items-center justify-center space-x-2">
                <span className="text-warning">⏰</span>
                <span className="font-semibold">Tomorrow</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => {
                  setCurrentItemIndex(0);
                  setIsReviewComplete(false);
                  setStats({ correct: 0, total: 0 });
                  const firstItem = reviewItems[0];
                  setTerminalOutput([`Review: ${firstItem.description}`]);
                  setUserInput('');
                }}
                className="btn-secondary"
              >
                Retry Review
              </button>
              <button
                onClick={onClose}
                className="btn-primary"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentItem = reviewItems[currentItemIndex];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">🔁 Spaced Repetition Review</h2>
            <p className="text-sm text-primary-300">
              Item {currentItemIndex + 1} of {reviewItems.length}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-primary-800 rounded-lg px-3 py-2">
              <div className="flex items-center space-x-2">
                <span className="text-warning">📊</span>
                <span className="font-semibold">{stats.correct}/{stats.total} Correct</span>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="text-primary-400 hover:text-foreground"
              aria-label="Close review"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-primary-300 mb-2">
            <span>Review Progress</span>
            <span>{Math.round(((currentItemIndex + 1) / reviewItems.length) * 100)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentItemIndex + 1) / reviewItems.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Difficulty Indicator */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-primary-300">Difficulty:</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map(level => (
                <div 
                  key={level}
                  className={`w-3 h-3 rounded-full ${level <= currentItem.difficulty ? 'bg-accent-500' : 'bg-primary-700'}`}
                />
              ))}
            </div>
            <span className="text-xs text-primary-400 ml-2">
              {currentItem.difficulty <= 2 ? 'Easy' : currentItem.difficulty <= 4 ? 'Medium' : 'Hard'}
            </span>
          </div>
        </div>

        {/* Terminal */}
        <TerminalOutput output={terminalOutput}>
          {/* Input prompt */}
          <div className="flex items-center mt-4">
            <span className="text-terminal-prompt" aria-hidden="true">user@climaster:~$</span>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 bg-transparent border-none outline-none text-terminal-text ml-2"
              placeholder="Type the command you remember..."
              autoFocus
              aria-label="Command input"
            />
          </div>
        </TerminalOutput>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-primary-800/30 rounded-lg border border-primary-700">
          <div className="flex items-start space-x-3">
            <div className="text-warning mt-0.5">💡</div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">How Spaced Repetition Works</h4>
              <p className="text-sm text-primary-300">
                This system schedules reviews based on memory science. Items you struggle with will appear more frequently,
                while mastered items appear less often. This optimizes long-term retention.
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between mt-6 pt-6 border-t border-primary-800">
          <div className="text-sm text-primary-400">
            Press <kbd className="px-2 py-1 bg-primary-800 rounded border border-primary-700">Enter</kbd> to submit command
          </div>
          <button
            onClick={handleCommandSubmit}
            disabled={!userInput.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewSystem;