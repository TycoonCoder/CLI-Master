import React, { useState, useEffect } from 'react';

interface SpinWheelProps {
  onSpinComplete: (bitsWon: number, xpBoost: boolean) => void;
  onClose?: () => void;
  onRedirect?: () => void;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ onSpinComplete, onClose, onRedirect }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<{ bits: number; xpBoost: boolean } | null>(null);
  const [hasRedirected, setHasRedirected] = useState(false);

  const prizes = [
    { bits: 10, xpBoost: false, label: '10 Bits', color: '#FFD700' },
    { bits: 5, xpBoost: false, label: '5 Bits', color: '#C0C0C0' },
    { bits: 20, xpBoost: false, label: '20 Bits', color: '#CD7F32' },
    { bits: 15, xpBoost: false, label: '15 Bits', color: '#FFD700' },
    { bits: 25, xpBoost: true, label: '25 Bits + XP Boost', color: '#FF6B6B' },
    { bits: 8, xpBoost: false, label: '8 Bits', color: '#C0C0C0' },
    { bits: 12, xpBoost: false, label: '12 Bits', color: '#CD7F32' },
    { bits: 30, xpBoost: false, label: '30 Bits', color: '#FFD700' },
  ];

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    // Random outcome
    const randomPrizeIndex = Math.floor(Math.random() * prizes.length);
    const selectedPrize = prizes[randomPrizeIndex];
    
    // Calculate rotation for selected prize
    const prizeAngle = 360 / prizes.length;
    const targetRotation = 5 * 360 + (randomPrizeIndex * prizeAngle + prizeAngle / 2);
    
    // Animate spin
    setRotation(targetRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      setResult(selectedPrize);
      
      // Notify parent of result
      onSpinComplete(selectedPrize.bits, selectedPrize.xpBoost);
    }, 3000);
  };

  useEffect(() => {
    if (result && !hasRedirected && onRedirect) {
      const timer = setTimeout(() => {
        onRedirect();
        setHasRedirected(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [result, hasRedirected, onRedirect]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="card max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-foreground">🎰 Spin the Wheel!</h2>
          {onClose && (
            <button
              onClick={handleClose}
              className="text-primary-400 hover:text-foreground"
              aria-label="Close"
            >
              ✕
            </button>
          )}
        </div>

        <p className="text-primary-400 mb-6">
          Congratulations on completing the lesson! Spin the wheel to win Bits or an XP Boost.
        </p>

        {/* Wheel Container */}
        <div className="relative mb-8 mx-auto" style={{ width: '300px', height: '300px' }}>
          <div 
            className="rounded-full border-8 border-primary-800 bg-gradient-to-b from-primary-900 to-primary-700 relative"
            style={{ 
              width: '300px', 
              height: '300px',
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 3s cubic-bezier(0.2, 0.8, 0.3, 1)' : 'none'
            }}
          >
            {/* Wheel segments */}
            {prizes.map((prize, index) => {
              const angle = (360 / prizes.length) * index;
              const segmentAngle = 360 / prizes.length;
              
              return (
                <div
                  key={index}
                  className="absolute top-0 left-0 w-full h-full origin-center"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div 
                    className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-left"
                    style={{ 
                      transform: `rotate(${segmentAngle / 2}deg)`,
                      transformOrigin: '0 100%'
                    }}
                  >
                    <div 
                      className="absolute w-full h-full"
                      style={{ 
                        clipPath: 'polygon(100% 50%, 0 0, 0 100%)',
                        backgroundColor: prize.color,
                        opacity: 0.8
                      }}
                    />
                  </div>
                  
                  {/* Prize label */}
                  <div 
                    className="absolute"
                    style={{
                      top: '40px',
                      left: '50%',
                      transform: `rotate(${segmentAngle / 2}deg) translateX(100px)`,
                      transformOrigin: '0 0',
                      color: '#000',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      textAlign: 'center',
                      width: '60px',
                    }}
                  >
                    {prize.label}
                  </div>
                </div>
              );
            })}
            
            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary-900 rounded-full border-4 border-primary-800 flex items-center justify-center">
              <div className="text-center">
                <span className="text-lg font-bold text-foreground">SPIN</span>
              </div>
            </div>
            
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <div 
                className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[24px] border-transparent border-b-danger"
              />
            </div>
          </div>
        </div>

        {/* Spin Button */}
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="btn-primary w-full mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSpinning ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin mr-2">🌀</span>
              Spinning...
            </span>
          ) : (
            'Spin the Wheel!'
          )}
        </button>

        {/* Result Display */}
        {result && (
          <div className={`p-4 rounded-lg border mb-4 animate-pulse ${result.xpBoost ? 'border-accent-500 bg-accent-500/10' : 'border-warning bg-warning/10'}`}>
            <div className="flex items-center justify-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${result.xpBoost ? 'bg-accent-500' : 'bg-warning'}`}>
                <span className="text-2xl">{result.xpBoost ? '🌟' : '🪙'}</span>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-foreground">You won!</h3>
                <p className="text-foreground">
                  <span className="font-bold text-xl">{result.bits} Bits</span>
                  {result.xpBoost && (
                    <>
                      {' '}<span className="text-accent-500">+ XP Boost!</span>
                    </>
                  )}
                </p>
              </div>
            </div>
            
            {onRedirect && (
              <div className="mt-4 text-center text-primary-300 text-sm">
                <p>Redirecting to lesson selection in 3 seconds...</p>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-primary-800/30 rounded-lg border border-primary-700">
          <h4 className="font-semibold text-foreground mb-2">How It Works</h4>
          <ul className="space-y-2 text-sm text-primary-300">
            <li className="flex items-start space-x-2">
              <span className="text-warning mt-0.5">🪙</span>
              <span>Bits are currency for the shop where you can buy XP Boosts</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-accent-500 mt-0.5">🌟</span>
              <span>XP Boost doubles your XP earnings for your next lesson</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-foreground mt-0.5">🎰</span>
              <span>Spin the wheel after completing each lesson for rewards</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SpinWheel;