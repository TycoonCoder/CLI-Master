import React from 'react';
import { isLessonUnlocked } from '../core/lessons';

interface LessonPathProps {
  currentLesson: string;
  onSelectLesson: (lessonId: string) => void;
  completedLessons: Set<string>;
}

const lessons = [
  { id: 'lesson-1', title: 'Welcome to Terminal', description: 'Learn basic navigation', xp: 40, commands: ['pwd'] },
  { id: 'lesson-2', title: 'Listing Files', description: 'Use ls to see files', xp: 50, commands: ['ls'] },
  { id: 'lesson-3', title: 'Changing Directories', description: 'Navigate with cd', xp: 60, commands: ['cd'] },
  { id: 'lesson-4', title: 'Viewing Files', description: 'Read files with cat', xp: 60, commands: ['cat'] },
  { id: 'lesson-5', title: 'Creating Files', description: 'Make files with touch', xp: 70, commands: ['touch'] },
  { id: 'lesson-6', title: 'Creating Directories', description: 'Make folders with mkdir', xp: 70, commands: ['mkdir'] },
  { id: 'lesson-7', title: 'Printing Text', description: 'Print text with echo', xp: 80, commands: ['echo'] },
  { id: 'lesson-8', title: 'Cleaning Screen', description: 'Clean terminal with clear', xp: 90, commands: ['clear'] },
  { id: 'lesson-9', title: 'Review Practice', description: 'Practice all commands', xp: 100, commands: ['pwd', 'ls', 'cd', 'cat', 'touch', 'mkdir', 'echo', 'clear'] },
  { id: 'lesson-10', title: 'Final Challenge', description: 'Complete project setup', xp: 150, commands: ['all'] },
  { id: 'lesson-11', title: 'Finding Files', description: 'Search with find command', xp: 160, commands: ['find'] },
  { id: 'lesson-12', title: 'Text Searching', description: 'Search within files using grep', xp: 170, commands: ['grep'] },
  { id: 'lesson-13', title: 'Text Processing', description: 'Transform text with sed and awk', xp: 180, commands: ['sed', 'awk'] },
  { id: 'lesson-14', title: 'Process Management', description: 'Manage running processes', xp: 190, commands: ['ps', 'kill'] },
  { id: 'review-1', title: 'Mid-Course Review', description: 'Reinforce core concepts', xp: 120, commands: ['pwd', 'ls', 'cd', 'cat'] },
  { id: 'review-2', title: 'Advanced Practice', description: 'Master command combinations', xp: 140, commands: ['all'] },
];

const LessonPath: React.FC<LessonPathProps> = ({ currentLesson, onSelectLesson, completedLessons }) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Connection lines */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-accent-500/30 transform -translate-x-1/2"></div>
        
        <div className="space-y-6 relative z-10">
          {lessons.map((lesson, index) => {
            const isCompleted = completedLessons.has(lesson.id);
            const isCurrent = currentLesson === lesson.id;
            let prerequisites: string[] = [];
            if (lesson.id === 'review-1') {
              prerequisites = ['lesson-5'];
            } else if (lesson.id === 'review-2') {
              prerequisites = ['review-1'];
            } else if (index > 0) {
              prerequisites = [lessons[index - 1].id];
            }
            
            const isLocked = !isCompleted && !isLessonUnlocked({
              id: lesson.id,
              title: lesson.title,
              description: lesson.description,
              commands: lesson.commands,
              challenges: [],
              prerequisites: prerequisites,
              xpReward: lesson.xp
            } as any, completedLessons);
            
            return (
              <div key={lesson.id} className="flex items-start">
                {/* Lesson node */}
                <div className="relative">
                  <div 
                    className={`w-14 h-14 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      isCurrent 
                        ? 'bg-accent-500 scale-105 border-2 border-accent-400' 
                        : isCompleted
                        ? 'bg-success border border-success/50'
                        : isLocked
                        ? 'bg-primary-700 border border-primary-600'
                        : 'bg-primary-800 border border-primary-700 hover:border-accent-500'
                    }`}
                    onClick={() => !isLocked && onSelectLesson(lesson.id)}
                  >
                    {isLocked ? (
                      <span className="text-xl">🔒</span>
                    ) : isCompleted ? (
                      <span className="text-xl">✅</span>
                    ) : (
                      <span className="text-foreground font-bold">{index + 1}</span>
                    )}
                  </div>
                  
                  {/* XP badge */}
                  <div className="absolute -top-2 -right-2 bg-warning text-black text-xs font-bold px-2 py-1 rounded">
                    {lesson.xp} XP
                  </div>
                </div>
                
                {/* Lesson info */}
                <div className="ml-4 flex-1">
                  <div 
                    className={`lesson-card cursor-pointer transition-all duration-300 ${
                      isCurrent ? 'ring-2 ring-primary-500' : ''
                    } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !isLocked && onSelectLesson(lesson.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">{lesson.title}</h4>
                        <p className="text-gray-600 text-sm mt-1">{lesson.description}</p>
                      </div>
                      {isCurrent && (
                        <span className="bg-primary-100 text-primary-800 text-xs font-bold px-3 py-1 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      {lesson.commands.map((cmd, idx) => (
                        <span 
                          key={idx}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-mono px-2 py-1 rounded"
                        >
                          {cmd}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        {isCompleted && (
                          <>
                            <span className="text-green-600">✓ Completed</span>
                            <span className="text-yellow-600 font-bold">+{lesson.xp} XP</span>
                          </>
                        )}
                      </div>
                      
                      <button
                        className={`text-sm font-bold px-4 py-2 rounded-lg ${
                          isCompleted
                            ? 'bg-green-100 text-green-800'
                            : isCurrent
                            ? 'btn-primary text-sm'
                            : isLocked
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'btn-secondary text-sm'
                        }`}
                        onClick={() => !isLocked && onSelectLesson(lesson.id)}
                        disabled={isLocked}
                      >
                        {isCompleted ? 'Review' : isCurrent ? 'Continue' : isLocked ? 'Locked' : 'Start'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Progress summary */}
      <div className="mt-8 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl border border-primary-200">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-bold text-gray-800">Learning Progress</h4>
            <p className="text-sm text-gray-600">
              {completedLessons.size} of {lessons.length} lessons completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-800">
              {Math.round((completedLessons.size / lessons.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>
        <div className="mt-3 progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(completedLessons.size / lessons.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LessonPath;