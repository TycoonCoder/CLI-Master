import React, { useState, useEffect } from 'react';
import { getLessonById } from '../core/lessons';
import { CLISimulator } from '../core/simulator';
import TerminalOutput from './TerminalOutput';
import type { Challenge } from '../core/types';

interface LessonViewProps {
  lessonId: string;
  onComplete: (xp: number, isFinal: boolean) => void;
  onActivity: () => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

const LessonView: React.FC<LessonViewProps> = ({ lessonId, onComplete, onActivity, onNextLesson, hasNextLesson }) => {
  const [simulator] = useState(() => new CLISimulator());
  const [lesson, setLesson] = useState(() => getLessonById(lessonId));
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    const newLesson = getLessonById(lessonId);
    if (newLesson) {
      setLesson(newLesson);
      setTerminalOutput([]);
      setCurrentChallengeIndex(0);
      setIsCompleted(false);
      setShowHint(false);
      
      // Initialize simulator with first challenge state
      if (newLesson.challenges.length > 0) {
        simulator.setFileSystemState(newLesson.challenges[0].fileSystemState);
        addOutput(newLesson.challenges[0].description);
      }
    }
  }, [lessonId]);

  const addOutput = (text: string) => {
    setTerminalOutput(prev => [...prev, text]);
  };

  const handleTabCompletion = () => {
    if (!userInput.trim()) return;
    
    const input = userInput.trim();
    const lastWord = input.split(' ').pop() || '';
    
    // Simple completion for current directory contents
    const state = simulator.getCurrentState();
    const allItems = [
      ...state.directories.map(d => d.name + '/'),
      ...state.files.map(f => f.name)
    ];
    
    const matches = allItems.filter(item => 
      item.startsWith(lastWord)
    );
    
    if (matches.length === 1) {
      const prefix = input.substring(0, input.lastIndexOf(lastWord));
      setUserInput(prefix + matches[0] + (matches[0].endsWith('/') ? '' : ' '));
    } else if (matches.length > 1) {
      addOutput(`\nPossible completions:\n${matches.join('  ')}\n`);
    }
  };

  const getCurrentChallenge = (): Challenge | null => {
    if (!lesson || currentChallengeIndex >= lesson.challenges.length) return null;
    return lesson.challenges[currentChallengeIndex];
  };

  const handleCommandSubmit = () => {
    if (!lesson || isCompleted) return;
    
    onActivity();
    const challenge = getCurrentChallenge();
    if (!challenge) return;

    const command = userInput.trim();
    
    // For teaching messages (empty expected command)
    if (challenge.expectedCommand === '' && command === '') {
      addOutput('✓ Continuing...');
      proceedToNextChallenge();
      setUserInput('');
      return;
    }

    // Save to command history
    if (command && !commandHistory.includes(command)) {
      setCommandHistory(prev => [...prev, command].slice(-50)); // Keep last 50 commands
    }
    setHistoryIndex(-1);

    // Execute command
    const result = simulator.executeCommand(command);
    
    // Show command and output
    addOutput(`$ ${command}`);
    if (result.output.trim()) {
      addOutput(result.output.trim());
    }

    // Check if command matches expected
    const normalizedInput = command;
    const normalizedExpected = challenge.expectedCommand.trim();
    
    let isCorrect = false;
    
    // Simple exact match or 'continue' command
    if (normalizedInput === normalizedExpected || normalizedExpected === 'continue') {
      isCorrect = true;
    }
    // Handle command chains with &&
    else if (normalizedExpected.includes('&&')) {
      const expectedParts = normalizedExpected.split('&&').map((p: string) => p.trim());
      const inputParts = normalizedInput.split('&&').map((p: string) => p.trim());
      
      if (expectedParts.length === inputParts.length) {
        isCorrect = expectedParts.every((part: string, i: number) => {
          // Allow variation in quotes for echo commands
          if (part.startsWith('echo ') && inputParts[i].startsWith('echo ')) {
            const partContent = part.substring(5).replace(/["']/g, '');
            const inputContent = inputParts[i].substring(5).replace(/["']/g, '');
            return partContent === inputContent;
          }
          return part === inputParts[i];
        });
      }
    }
    // Handle echo with > redirection (allow quote variations)
    else if (normalizedExpected.includes('>') && normalizedInput.includes('>')) {
      const [expectedCmd, expectedFile] = normalizedExpected.split('>').map((p: string) => p.trim());
      const [inputCmd, inputFile] = normalizedInput.split('>').map((p: string) => p.trim());
      
      if (expectedCmd.startsWith('echo ') && inputCmd.startsWith('echo ')) {
        const expectedContent = expectedCmd.substring(5).replace(/["']/g, '');
        const inputContent = inputCmd.substring(5).replace(/["']/g, '');
        isCorrect = expectedContent === inputContent && expectedFile === inputFile;
      }
    }

    if (isCorrect) {
      addOutput(`✅ Correct! ${challenge.hints[0] || 'Well done!'}`);
      
      // Award partial XP based on challenge position
      const xpPerChallenge = Math.floor(lesson.xpReward / lesson.challenges.length);
      onComplete(xpPerChallenge, false);
      
      setTimeout(() => {
        proceedToNextChallenge();
      }, 1000);
    } else {
      addOutput(`❌ Not quite right. Try again!`);
      setShowHint(true);
    }

    setUserInput('');
  };

  const proceedToNextChallenge = () => {
    if (!lesson) return;
    
    const nextIndex = currentChallengeIndex + 1;
    if (nextIndex < lesson.challenges.length) {
      setCurrentChallengeIndex(nextIndex);
      const nextChallenge = lesson.challenges[nextIndex];
      simulator.setFileSystemState(nextChallenge.fileSystemState);
      addOutput('\n' + nextChallenge.description);
      setShowHint(false);
    } else {
      // Lesson completed
      addOutput('\n🎉 Lesson Complete! 🎉');
      addOutput(`You earned ${lesson.xpReward} XP!`);
      setIsCompleted(true);
      
      // Award remaining XP
      const awardedSoFar = Math.floor(lesson.xpReward / lesson.challenges.length) * currentChallengeIndex;
      const remainingXp = lesson.xpReward - awardedSoFar;
      if (remainingXp > 0) {
        onComplete(remainingXp, true);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommandSubmit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        let newIndex = historyIndex;
        if (newIndex < 0) {
          newIndex = commandHistory.length - 1;
        } else if (newIndex > 0) {
          newIndex--;
        }
        setHistoryIndex(newIndex);
        setUserInput(commandHistory[newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        let newIndex = historyIndex;
        if (newIndex < commandHistory.length - 1) {
          newIndex++;
          setUserInput(commandHistory[newIndex] || '');
        } else {
          newIndex = -1;
          setUserInput('');
        }
        setHistoryIndex(newIndex);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
    }
  };

  const currentChallenge = getCurrentChallenge();
  if (!lesson || !currentChallenge) {
    return <div className="text-center p-8">Loading lesson...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <div className="bg-gradient-to-r from-primary-100 to-accent-100 rounded-2xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{lesson.title}</h3>
            <p className="text-gray-600 mt-2">{lesson.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Progress</div>
            <div className="text-2xl font-bold text-primary-600">
              {currentChallengeIndex + 1}/{lesson.challenges.length}
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentChallengeIndex + 1) / lesson.challenges.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Teaching Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <span className="text-2xl">📚</span>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-800 text-lg">Current Challenge</h4>
            <p className="text-gray-700 mt-2">{currentChallenge.description}</p>
            
            {showHint && currentChallenge.hints.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-600">💡 Hint:</span>
                  <span className="text-yellow-700">{currentChallenge.hints[0]}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Terminal Output */}
      <TerminalOutput output={terminalOutput}>
        {/* Input prompt */}
        <div className="flex items-center mt-4">
          <span className="text-terminal-prompt" aria-hidden="true">user@climaster:~$</span>
            <span className="sr-only">Command prompt:</span>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 bg-transparent border-none outline-none text-terminal-text ml-2"
            placeholder={isCompleted ? "Lesson complete!" : "Type your command..."}
            disabled={isCompleted}
            autoFocus
            aria-label="Command input"
            aria-describedby="command-hint"
          />
        </div>
      </TerminalOutput>

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCommandSubmit}
          disabled={isCompleted || !userInput.trim()}
          className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCompleted ? 'Completed!' : 'Submit Command'}
        </button>
        
        <button
          onClick={() => setShowHint(!showHint)}
          className="btn-secondary"
        >
          {showHint ? 'Hide Hint' : 'Show Hint'}
        </button>
        
        {isCompleted && (
          <>
            {hasNextLesson && onNextLesson && (
              <button
                onClick={onNextLesson}
                className="btn-primary"
              >
                Next Lesson →
              </button>
            )}
            <button
              onClick={() => {
                setTerminalOutput([]);
                setCurrentChallengeIndex(0);
                setIsCompleted(false);
                setUserInput('');
                const firstChallenge = lesson.challenges[0];
                simulator.setFileSystemState(firstChallenge.fileSystemState);
                addOutput(firstChallenge.description);
              }}
              className="btn-secondary"
            >
              Restart Lesson
            </button>
          </>
        )}
      </div>

      {/* Lesson Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary-600">{lesson.xpReward}</div>
          <div className="text-sm text-gray-600">Total XP</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-accent-600">{lesson.commands.length}</div>
          <div className="text-sm text-gray-600">Commands</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{currentChallengeIndex + 1}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{lesson.challenges.length}</div>
          <div className="text-sm text-gray-600">Challenges</div>
        </div>
      </div>
    </div>
  );
};

export default LessonView;