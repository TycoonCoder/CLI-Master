import type { Unit } from '../core/lessons';

interface UnitSelectorProps {
  units: Unit[];
  currentLesson: string;
  onSelectLesson: (lessonId: string) => void;
  completedLessons: Set<string>;
}

export default function UnitSelector({ 
  units, 
  currentLesson, 
  onSelectLesson,
  completedLessons 
}: UnitSelectorProps) {
  const getUnitProgress = (unit: Unit) => {
    const total = unit.lessonIds.length;
    const completed = unit.lessonIds.filter(id => completedLessons.has(id)).length;
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const isLessonUnlocked = true;

  return (
    <div className="space-y-6">
      {units.map(unit => {
        const progress = getUnitProgress(unit);
        
        return (
          <div key={unit.id} className="card p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${unit.color}20`, color: unit.color }}
                >
                  {unit.icon}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{unit.name}</h3>
                  <p className="text-sm text-primary-400">{unit.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-foreground font-bold">{progress.completed}/{progress.total}</div>
                <div className="text-xs text-primary-400">lessons</div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-primary-300 mb-1">
                <span>Progress</span>
                <span>{progress.percentage}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${progress.percentage}%`,
                    backgroundColor: unit.color
                  }}
                ></div>
              </div>
            </div>
            
            {/* Lesson grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {unit.lessonIds.map(lessonId => {
const isCompleted = completedLessons.has(lessonId);
                const isCurrent = lessonId === currentLesson;
                const isUnlocked = isLessonUnlocked;
                
                return (
                  <button
                    key={lessonId}
                    onClick={() => onSelectLesson(lessonId)}
                    disabled={!isUnlocked}
                    className={`
                      relative p-3 rounded-lg text-sm font-medium transition-all
                      ${isCurrent 
                        ? 'ring-2 ring-offset-2 ring-opacity-50' 
                        : 'hover:scale-[1.02] hover:shadow-md'
                      }
                      ${isCompleted 
                        ? 'bg-success/20 text-success border border-success/30' 
                        : isUnlocked
                          ? 'bg-primary-800 text-foreground border border-primary-700 hover:border-primary-500'
                          : 'bg-primary-900/50 text-primary-500 border border-primary-800 cursor-not-allowed'
                      }
                    `}
                    style={isCurrent ? { 
                      backgroundColor: `${unit.color}15`
                    } as React.CSSProperties : {}}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-1">
                        {isCompleted ? '✓' : isUnlocked ? '→' : '🔒'}
                      </div>
                      <div className="text-xs truncate w-full text-center">
                        {lessonId.replace('lesson-', 'L').replace('review-', 'R')}
                      </div>
                    </div>
                    
                    {/* Current lesson indicator */}
                    {isCurrent && (
                      <div 
                        className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
                        style={{ backgroundColor: unit.color }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Unit stats */}
            <div className="mt-4 pt-4 border-t border-primary-800">
              <div className="flex justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: unit.color }} />
                  <span className="text-primary-400">XP Available:</span>
                </div>
                <span className="font-semibold text-foreground">
                  {unit.lessonIds.length * 50}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}