import { useState, useEffect, useRef } from 'react'
import './App.css'
import Terminal from './components/Terminal'
import UnitSelector from './components/UnitSelector'
import ProgressBar from './components/ProgressBar'
import WelcomePage from './components/WelcomePage'
import Settings from './components/Settings'
import SpinWheel from './components/SpinWheel'
import Shop from './components/Shop'
import QuizSystem from './components/QuizSystem'
import ReviewSystem from './components/ReviewSystem'
import type { UserProgress } from './core/types'
import { getNextLessonId, units } from './core/lessons'
import { checkAchievements } from './core/achievements'
// import { generateDailyChallenges } from './core/dailyChallenges'

function App() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [showSpinWheel, setShowSpinWheel] = useState(false)
  const [showShop, setShowShop] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  // const [dailyChallenges, setDailyChallenges] = useState<ReturnType<typeof generateDailyChallenges>>([])
  const hasLoadedRef = useRef(false)
  
  const [progress, setProgress] = useState<UserProgress>({
    xp: 0,
    level: 1,
    streak: 0,
    bits: 5, // Starting bits
    hasXpBoost: false,
    achievements: [],
    completedLessons: new Set(),
    lastActive: new Date(),
  })

  const [currentLesson, setCurrentLesson] = useState<string>('lesson-1')

  // Load progress from localStorage on mount
  useEffect(() => {
    if (hasLoadedRef.current) {
      console.log('⚠️ Load effect called again, skipping (already loaded)')
      return
    }
    
    hasLoadedRef.current = true
    const timestamp = new Date().toISOString()
    const savedProgress = localStorage.getItem('climaster-progress')
    const savedCurrentLesson = localStorage.getItem('climaster-currentLesson')
    
    console.log(`[${timestamp}] 🔍 Loading from localStorage:`)
    console.log('  - Progress:', savedProgress ? 'Found' : 'Not found')
    console.log('  - Current lesson:', savedCurrentLesson || 'Not found')
    
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress)
        console.log('📊 Parsed progress (raw):', parsed)
        
        // Ensure all required fields exist
        const loadedProgress: UserProgress = {
          xp: parsed.xp || 0,
          level: parsed.level || 1,
          streak: parsed.streak || 0,
          bits: parsed.bits ?? 5, // Default to 5 if not set
          hasXpBoost: parsed.hasXpBoost || false,
          achievements: parsed.achievements || [],
          completedLessons: new Set(parsed.completedLessons || []),
          lastActive: parsed.lastActive ? new Date(parsed.lastActive) : new Date()
        }
        
        console.log('✅ Setting progress:', loadedProgress)
        console.log('  Completed lessons:', Array.from(loadedProgress.completedLessons))
        console.log('  Bits:', loadedProgress.bits)
        console.log('  XP:', loadedProgress.xp)
        
        setProgress(loadedProgress)
        
        // Don't show welcome if user has progress
        if (loadedProgress.completedLessons.size > 0 || loadedProgress.xp > 0) {
          console.log('🚫 Hiding welcome page - user has progress')
          setShowWelcome(false)
        }
      } catch (e) {
        console.error('❌ Failed to load progress:', e)
        // Reset to defaults on corrupt data
        setProgress({
          xp: 0,
          level: 1,
          streak: 0,
          bits: 5,
          hasXpBoost: false,
          achievements: [],
          completedLessons: new Set(),
          lastActive: new Date()
        })
      }
    } else {
      console.log('📭 No saved progress found, using defaults')
    }
    
    if (savedCurrentLesson) {
      console.log('📖 Setting current lesson:', savedCurrentLesson)
      setCurrentLesson(savedCurrentLesson)
    }
    
    setIsLoading(false)
    console.log('🏁 Loading complete')
    
    // Generate daily challenges
    // setDailyChallenges(generateDailyChallenges(new Set()))
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    const timestamp = new Date().toISOString()
    try {
      const toSave = {
        ...progress,
        completedLessons: Array.from(progress.completedLessons)
      }
      console.log(`[${timestamp}] 💾 Saving progress to localStorage:`)
      console.log('  - XP:', toSave.xp)
      console.log('  - Bits:', toSave.bits)
      console.log('  - Completed lessons:', toSave.completedLessons.length)
      
      const jsonStr = JSON.stringify(toSave)
      console.log('  - JSON size:', jsonStr.length, 'bytes')
      
      localStorage.setItem('climaster-progress', jsonStr)
      console.log(`[${timestamp}] ✅ Progress save successful`)
    } catch (error: any) {
      console.error('❌ Failed to save progress to localStorage:', error)
      console.error('Error details:', error?.message || 'Unknown error')
      
      // Try to diagnose the error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('⚠️ localStorage quota exceeded! Clearing old data...')
        // Try to save minimal data
        const minimalSave = {
          xp: progress.xp,
          bits: progress.bits,
          level: progress.level,
          streak: progress.streak,
          hasXpBoost: progress.hasXpBoost,
          achievements: [],
          completedLessons: Array.from(progress.completedLessons),
          lastActive: progress.lastActive
        }
        try {
          localStorage.setItem('climaster-progress', JSON.stringify(minimalSave))
          console.log('✅ Saved minimal data')
        } catch (e2) {
          console.error('❌ Even minimal save failed:', e2)
        }
      }
    }
  }, [progress])

  // Save current lesson to localStorage
  useEffect(() => {
    try {
      console.log('📖 Saving current lesson:', currentLesson)
      localStorage.setItem('climaster-currentLesson', currentLesson)
    } catch (error: any) {
      console.error('❌ Failed to save current lesson:', error)
    }
  }, [currentLesson])

  const updateStreak = () => {
    const today = new Date().toDateString()
    const lastActive = new Date(progress.lastActive).toDateString()
    
    if (today === lastActive) return // Already active today
    
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (yesterday.toDateString() === lastActive) {
      // Consecutive day
      setProgress(prev => ({
        ...prev,
        streak: prev.streak + 1,
        lastActive: new Date(),
      }))
    } else {
      // Broken streak
      setProgress(prev => ({
        ...prev,
        streak: 1,
        lastActive: new Date(),
      }))
    }
  }

  const handleLessonComplete = (lessonId: string, xpEarned: number, isFinal: boolean) => {
    console.log('🎯 handleLessonComplete called:', { lessonId, xpEarned, isFinal })
    console.log('Current progress before update:', { 
      xp: progress.xp, 
      bits: progress.bits,
      hasXpBoost: progress.hasXpBoost,
      completedLessons: Array.from(progress.completedLessons) 
    })
    
    // Apply XP boost if active
    const finalXp = progress.hasXpBoost ? xpEarned * 2 : xpEarned;
    console.log('XP calculation:', { xpEarned, finalXp, hasXpBoost: progress.hasXpBoost })
    
    setProgress(prev => {
      const newProgress = {
        ...prev,
        xp: prev.xp + finalXp,
        level: Math.floor((prev.xp + finalXp) / 100) + 1,
        completedLessons: isFinal ? new Set([...prev.completedLessons, lessonId]) : prev.completedLessons,
        lastActive: new Date(),
// Consume XP boost after lesson completion (only when isFinal is true)
      hasXpBoost: isFinal && prev.hasXpBoost ? false : prev.hasXpBoost
      }
      
      // Check for achievements
      const unlockedAchievements = checkAchievements(newProgress, {
        type: 'lesson_complete',
        data: { lessonId, xpEarned: finalXp }
      });
      
      if (unlockedAchievements.length > 0) {
        console.log('🏆 Achievements unlocked:', unlockedAchievements.map(a => a.name));
        newProgress.achievements = [...prev.achievements, ...unlockedAchievements];
      }
      
      console.log('🔄 Setting new progress:', newProgress)
      return newProgress
    })
    
    // Update streak on lesson completion
    updateStreak()
    
    // Show spin wheel after completing a lesson (only on final completion)
    if (isFinal && !progress.completedLessons.has(lessonId)) {
      console.log('🎰 Showing spin wheel for lesson:', lessonId)
      setTimeout(() => setShowSpinWheel(true), 1000);
    } else {
      console.log('⏭️ Not showing spin wheel - isFinal:', isFinal, 'hasLesson:', progress.completedLessons.has(lessonId))
    }
  }

  const handleSpinComplete = (bitsWon: number, xpBoost: boolean) => {
    console.log('🎲 Spin wheel completed:', { bitsWon, xpBoost })
    console.log('Current bits before:', progress.bits)
    
    setProgress(prev => {
      const newProgress = {
        ...prev,
        bits: prev.bits + bitsWon,
        hasXpBoost: xpBoost ? true : prev.hasXpBoost
      }
      
      // Check for achievements
      const unlockedAchievements = checkAchievements(newProgress, {
        type: 'spin_wheel',
        data: { bitsWon, wonXpBoost: xpBoost }
      });
      
      if (unlockedAchievements.length > 0) {
        console.log('🏆 Spin wheel achievements unlocked:', unlockedAchievements.map(a => a.name));
        newProgress.achievements = [...prev.achievements, ...unlockedAchievements];
      }
      
      console.log('Bits after spin:', newProgress.bits)
      return newProgress
    })
    setShowSpinWheel(false)
  }

  const handleQuizComplete = (score: number, total: number) => {
    const xpEarned = Math.floor((score / total) * 50); // Up to 50 XP for quiz
    setProgress(prev => {
      const newProgress = {
        ...prev,
        xp: prev.xp + xpEarned,
        level: Math.floor((prev.xp + xpEarned) / 100) + 1
      };
      
      // Check for achievements
      const unlockedAchievements = checkAchievements(newProgress, {
        type: 'quiz_complete',
        data: { score, total, perfectScore: score === total }
      });
      
      if (unlockedAchievements.length > 0) {
        console.log('🏆 Quiz achievements unlocked:', unlockedAchievements.map(a => a.name));
        newProgress.achievements = [...prev.achievements, ...unlockedAchievements];
      }
      
      return newProgress;
    })
    setShowQuiz(false)
  }

  const handlePurchase = (itemId: string, cost: number): boolean => {
    if (progress.bits < cost) return false;
    
    if (itemId === 'xp-boost') {
      setProgress(prev => ({
        ...prev,
        bits: prev.bits - cost,
        hasXpBoost: true
      }))
    } else {
      // Handle other purchases
      setProgress(prev => ({
        ...prev,
        bits: prev.bits - cost
      }))
    }
    
    return true;
  }

  const handleResetProgress = () => {
    localStorage.removeItem('climaster-progress')
    localStorage.removeItem('climaster-currentLesson')
    setProgress({
      xp: 0,
      level: 1,
      streak: 0,
      bits: 5,
      hasXpBoost: false,
      achievements: [],
      completedLessons: new Set(),
      lastActive: new Date(),
    })
    setCurrentLesson('lesson-1')
    setShowSettings(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-4xl mb-6 animate-pulse">💻</div>
          <h1 className="text-2xl font-bold text-foreground mb-4">Loading CLI Master...</h1>
          <p className="text-primary-300">Restoring your progress from localStorage</p>
          <div className="mt-8 progress-bar w-64 mx-auto">
            <div className="progress-fill animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (showWelcome) {
    return <WelcomePage onStartLearning={() => setShowWelcome(false)} />
  }

  if (showSettings) {
    return (
      <Settings 
        onResetProgress={handleResetProgress} 
        onClose={() => setShowSettings(false)}
        onOpenShop={() => {
          setShowSettings(false);
          setShowShop(true);
        }}
      />
    )
  }

  if (showSpinWheel) {
    return <SpinWheel 
      onSpinComplete={handleSpinComplete}
      onClose={() => setShowSpinWheel(false)} 
    />
  }

  if (showShop) {
    return <Shop 
      bits={progress.bits}
      hasXpBoost={progress.hasXpBoost}
      onPurchase={handlePurchase}
      onClose={() => setShowShop(false)}
    />
  }

  if (showQuiz) {
    return <QuizSystem 
      lessonId={currentLesson}
      onComplete={handleQuizComplete}
      onClose={() => setShowQuiz(false)}
    />
  }

  if (showReview) {
    return <ReviewSystem 
      completedLessons={progress.completedLessons}
      onComplete={(lessonId, challengeId, success) => {
        console.log(`Review item ${lessonId}/${challengeId}: ${success ? 'correct' : 'incorrect'}`);
      }}
      onClose={() => setShowReview(false)}
    />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary-900 focus:text-foreground focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Skip to main content
      </a>
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary-900/95 backdrop-blur-sm border-b border-primary-800 overflow-hidden">
        <div className="container mx-auto px-3 py-2 md:px-4 md:py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-0">
            {/* Logo and Title */}
            <div className="flex items-center justify-between md:justify-start">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-accent-500 rounded-lg flex items-center justify-center" aria-hidden="true">
                  <span className="text-white font-bold text-lg md:text-xl">💻</span>
                </div>
                <div>
                  <h1 className="text-lg md:text-xl font-bold text-foreground">CLI Master</h1>
                  <p className="text-xs md:text-sm text-primary-400 hidden md:block">Learn Linux CLI through interactive lessons</p>
                </div>
              </div>
              
              {/* Mobile Action Buttons - Right side on mobile */}
              <div className="md:hidden flex items-center space-x-1">
                <button
                  onClick={() => setShowReview(true)}
                  className="text-primary-400 hover:text-foreground p-2"
                  title="Review"
                  aria-label="Review"
                >
                  <span aria-hidden="true" className="text-sm">🔁</span>
                </button>
                
                <button
                  onClick={() => setShowQuiz(true)}
                  className="text-primary-400 hover:text-foreground p-2"
                  title="Quiz"
                  aria-label="Quiz"
                >
                  <span aria-hidden="true" className="text-sm">📝</span>
                </button>
                
                <button
                  onClick={() => setShowSettings(true)}
                  className="text-primary-400 hover:text-foreground p-2"
                  title="Settings"
                  aria-label="Settings"
                >
                  <span aria-hidden="true" className="text-sm">⚙️</span>
                </button>
              </div>
            </div>
            
            {/* Stats Row - Stacked on mobile */}
            <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2 md:space-x-2">
              {/* Bits Display */}
              <button 
                onClick={() => setShowShop(true)}
                className="bg-primary-800 rounded-lg px-2 py-1.5 md:px-3 md:py-2 border border-primary-700 hover:border-accent-500 transition-colors flex-shrink-0"
                title={`${progress.bits} Bits`}
                aria-label={`${progress.bits} Bits - Tap to open shop`}
              >
                <div className="flex items-center space-x-1 md:space-x-2">
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-warning rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">🪙</span>
                  </div>
                  <span className="font-semibold text-foreground text-sm md:text-base">{progress.bits}</span>
                  <span className="text-xs text-primary-400 hidden md:inline">↗</span>
                </div>
              </button>
              
              {/* XP Display */}
              <div className="bg-primary-800 rounded-lg px-2 py-1.5 md:px-3 md:py-2 border border-primary-700 flex-shrink-0" title={`${progress.xp} XP`}>
                <div className="flex items-center space-x-1 md:space-x-2">
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">✨</span>
                  </div>
                  <span className="font-semibold text-foreground text-sm md:text-base">{progress.xp}</span>
                  {progress.hasXpBoost && (
                    <span className="text-xs bg-accent-500 text-white px-1 py-0.5 rounded hidden md:inline" title="2x XP Active">
                      🌟 2x
                    </span>
                  )}
                </div>
              </div>
              
              {/* Level Display */}
              <div className="bg-primary-800 rounded-lg px-2 py-1.5 md:px-3 md:py-2 border border-primary-700 flex-shrink-0" title={`Level ${progress.level}`}>
                <div className="flex items-center space-x-1 md:space-x-2">
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-accent-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{progress.level}</span>
                  </div>
                  <span className="font-semibold text-foreground text-sm md:text-base hidden md:inline">Lvl {progress.level}</span>
                </div>
              </div>
              
              {/* Streak Display */}
              <div className="bg-primary-800 rounded-lg px-2 py-1.5 md:px-3 md:py-2 border border-primary-700 flex-shrink-0" title={`${progress.streak} day streak`}>
                <div className="flex items-center space-x-1 md:space-x-2">
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-danger rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">🔥</span>
                  </div>
                  <span className="font-semibold text-foreground text-sm md:text-base">{progress.streak}</span>
                </div>
              </div>
              
              {/* Desktop Action Buttons */}
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={() => setShowReview(true)}
                  className="text-primary-400 hover:text-foreground p-2"
                  title="Spaced Repetition Review"
                  aria-label="Review learned material with spaced repetition"
                >
                  <span aria-hidden="true">🔁</span>
                </button>
                
                <button
                  onClick={() => setShowQuiz(true)}
                  className="text-primary-400 hover:text-foreground p-2"
                  title="Take Quiz"
                  aria-label="Take a quiz to test your knowledge"
                >
                  <span aria-hidden="true">📝</span>
                </button>
                
                <button
                  onClick={() => setShowSettings(true)}
                  className="text-primary-400 hover:text-foreground p-2"
                  title="Settings"
                  aria-label="Open settings"
                >
                  <span aria-hidden="true">⚙️</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-4 py-6 md:py-8" tabIndex={-1}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column: Terminal */}
          <div className="lg:col-span-2">
            <div className="card p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-foreground mb-2 md:mb-3">Interactive Lesson</h2>
              <p className="text-primary-400 mb-4 md:mb-6 text-sm md:text-base">Type commands below to complete the lesson challenge!</p>
            
              <div className="terminal-window p-4">
                <Terminal 
                  lessonId={currentLesson}
                  onLessonComplete={handleLessonComplete}
                  onActivity={() => {}}
                  onNextLesson={() => {
                    const nextLessonId = getNextLessonId(currentLesson);
                    if (nextLessonId) {
                      setCurrentLesson(nextLessonId);
                    }
                  }}
                  hasNextLesson={!!getNextLessonId(currentLesson)}
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
          
          {/* Right Column: Unit Selector & Stats */}
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
              <button className="btn-primary w-full">Spin Daily Wheel</button>
            </div>
            
            {/* Unit Selector */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Learning Units</h3>
                <div className="text-sm text-primary-400">
                  {progress.completedLessons.size} completed
                </div>
              </div>
              <UnitSelector
                units={units}
                currentLesson={currentLesson}
                onSelectLesson={setCurrentLesson}
                completedLessons={progress.completedLessons}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showSettings && (
        <Settings
          onResetProgress={handleResetProgress}
          onClose={() => setShowSettings(false)}
          onOpenShop={() => {
            setShowSettings(false);
            setShowShop(true);
          }}
        />
      )}
      
      {showSpinWheel && (
        <SpinWheel
          onSpinComplete={(bitsWon, xpBoost) => {
            if (bitsWon) {
              setProgress(prev => ({
                ...prev,
                bits: prev.bits + bitsWon
              }));
            }
            if (xpBoost) {
              setProgress(prev => ({
                ...prev,
                hasXpBoost: true
              }));
            }
          }}
          onClose={() => setShowSpinWheel(false)}
        />
      )}
      
      {showShop && (
        <Shop
          bits={progress.bits}
          hasXpBoost={progress.hasXpBoost}
          onPurchase={(type, cost) => {
            if (type === 'xpBoost') {
              setProgress(prev => ({
                ...prev,
                bits: prev.bits - cost,
                hasXpBoost: true
              }));
            }
          }}
          onClose={() => setShowShop(false)}
        />
      )}
      
      {showQuiz && (
        <QuizSystem
          onClose={() => setShowQuiz(false)}
          completedLessons={progress.completedLessons}
          onComplete={(correct, total) => {
            const xpEarned = Math.floor((correct / total) * 50);
            setProgress(prev => ({
              ...prev,
              xp: prev.xp + xpEarned
            }));
          }}
        />
      )}
      
      {showReview && (
        <ReviewSystem
          completedLessons={progress.completedLessons}
          onClose={() => setShowReview(false)}
          onComplete={(lessonId, challengeId, success) => {
            console.log('Review completed:', { lessonId, challengeId, success });
          }}
        />
      )}
    </div>
  );
}

export default App;
