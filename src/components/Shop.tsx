import React, { useState } from 'react';

interface ShopProps {
  bits: number;
  hasXpBoost: boolean;
  onPurchase: (itemId: string, cost: number) => void;
  onClose: () => void;
}

const Shop: React.FC<ShopProps> = ({ bits, hasXpBoost, onPurchase, onClose }) => {
  const [purchaseMessage, setPurchaseMessage] = useState<string>('');

  const items = [
    {
      id: 'xp-boost',
      name: '2x XP Boost',
      description: 'Double XP earned from your next lesson',
      cost: 10,
      icon: '🌟',
      owned: hasXpBoost
    },
    {
      id: 'streak-protect',
      name: 'Streak Protector',
      description: 'Protect your streak if you miss a day',
      cost: 20,
      icon: '🛡️',
      owned: false
    },
    {
      id: 'hint-pack',
      name: 'Hint Pack',
      description: '5 extra hints for challenging lessons',
      cost: 15,
      icon: '💡',
      owned: false
    },
    {
      id: 'theme-dark',
      name: 'Dark Theme',
      description: 'Unlock alternative dark theme',
      cost: 25,
      icon: '🌙',
      owned: false
    },
    {
      id: 'theme-terminal',
      name: 'Terminal Theme',
      description: 'Green-on-black classic terminal',
      cost: 30,
      icon: '💻',
      owned: false
    },
    {
      id: 'achievement-badge',
      name: 'Golden Badge',
      description: 'Special achievement badge for profile',
      cost: 50,
      icon: '🏆',
      owned: false
    }
  ];

  const handlePurchase = (itemId: string, cost: number) => {
    if (bits < cost) {
      setPurchaseMessage(`Not enough Bits! You need ${cost - bits} more.`);
      setTimeout(() => setPurchaseMessage(''), 3000);
      return;
    }
    
    onPurchase(itemId, cost);
    setPurchaseMessage('Purchase successful!');
    setTimeout(() => setPurchaseMessage(''), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="card max-w-2xl w-full p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">🛒 Bits Shop</h2>
            <div className="flex items-center space-x-2 mt-2">
              <div className="bg-warning text-black px-3 py-1 rounded-full font-bold">
                🪙 {bits} Bits
              </div>
              <div className="text-sm text-primary-400">
                Earn Bits from daily spins
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-primary-400 hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {purchaseMessage && (
          <div className={`mb-4 p-3 rounded ${purchaseMessage.includes('successful') ? 'bg-success/20 border border-success/50 text-terminal-success' : 'bg-danger/20 border border-danger/50 text-terminal-error'}`}>
            {purchaseMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {items.map((item) => (
            <div 
              key={item.id}
              className={`card p-4 ${item.owned ? 'border-accent-500' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-2xl">{item.icon}</span>
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                  </div>
                  <p className="text-sm text-primary-300 mb-3">{item.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-warning">🪙 {item.cost}</div>
                  {item.owned && (
                    <div className="text-xs text-terminal-success mt-1">Owned ✓</div>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => handlePurchase(item.id, item.cost)}
                disabled={item.owned || bits < item.cost}
                className={`w-full ${item.owned ? 'btn-secondary opacity-50 cursor-not-allowed' : bits < item.cost ? 'btn-secondary opacity-50 cursor-not-allowed' : 'btn-primary'}`}
              >
                {item.owned ? 'Already Owned' : bits < item.cost ? 'Need More Bits' : 'Purchase'}
              </button>
            </div>
          ))}
        </div>

        {/* How to earn Bits */}
        <div className="card p-4 mb-6">
          <h3 className="font-semibold text-foreground mb-3">How to Earn Bits</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-primary-300">Complete a lesson</span>
              <span className="font-bold text-foreground">+1 Spin</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-primary-300">Maintain 7-day streak</span>
              <span className="font-bold text-foreground">+1 Extra Spin</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-primary-300">Reach Level 10</span>
              <span className="font-bold text-foreground">+10 Bits Bonus</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-primary-300">Daily spin wheel</span>
              <span className="font-bold text-foreground">1-5 Bits + XP Boost chance</span>
            </div>
          </div>
        </div>

        {/* XP Boost Info */}
        <div className="card p-4 bg-accent-500/10 border border-accent-500/30">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🌟</div>
            <div>
              <h4 className="font-semibold text-foreground">XP Boost Active</h4>
              <p className="text-sm text-primary-300">
                {hasXpBoost 
                  ? 'Your next lesson will earn double XP!'
                  : 'Purchase 2x XP Boost for 10 Bits'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-primary-700">
          <button
            onClick={onClose}
            className="btn-secondary w-full"
          >
            Close Shop
          </button>
        </div>
      </div>
    </div>
  );
};

export default Shop;