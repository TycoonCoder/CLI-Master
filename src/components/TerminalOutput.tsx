import React, { useEffect, useRef } from 'react';

interface TerminalOutputProps {
  output: string[];
  children?: React.ReactNode;
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({ output, children }) => {
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div 
      ref={outputRef}
      className="bg-terminal-bg text-terminal-text rounded-lg p-4 font-mono h-64 overflow-y-auto"
      role="log"
      aria-live="polite"
      aria-label="Terminal output"
    >
      {output.map((line, index) => (
        <div key={index} className="mb-1 whitespace-pre-wrap" role="text">
          {line.startsWith('✅') ? (
            <span className="text-terminal-success" aria-label="Correct">{line}</span>
          ) : line.startsWith('❌') ? (
            <span className="text-terminal-error" aria-label="Incorrect">{line}</span>
          ) : line.startsWith('$') ? (
            <span className="text-terminal-prompt" aria-label="Command prompt">{line}</span>
          ) : line.startsWith('🎉') ? (
            <span className="text-warning animate-pulse" aria-label="Celebration">{line}</span>
          ) : line.startsWith('💡') ? (
            <span className="text-warning" aria-label="Hint">{line}</span>
          ) : (
            <span>{line}</span>
          )}
        </div>
      ))}
      {children}
    </div>
  );
};

export default TerminalOutput;