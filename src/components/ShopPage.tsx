// import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import Shop from './Shop';
import type { UserProgress } from '../core/types';

type ContextType = {
  progress: UserProgress;
};

export default function ShopPage() {
  const navigate = useNavigate();
  const { progress } = useOutletContext<ContextType>();

  const handlePurchase = (itemId: string, cost: number): boolean => {
    console.log(`🛒 Purchase attempted: ${itemId} for ${cost} bits`);
    // Purchase logic handled by parent
    return true;
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-primary-900/95 backdrop-blur-sm border-b border-primary-800">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                className="text-primary-400 hover:text-foreground flex items-center gap-2"
              >
                <span>←</span>
                Back to Dashboard
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center">
                  <span className="text-sm">🪙</span>
                </div>
                <div className="text-foreground font-semibold">{progress.bits} Bits Available</div>
              </div>
              <div className="w-6" /> {/* Spacer */}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Shop 
            bits={progress.bits}
            hasXpBoost={progress.hasXpBoost}
            onPurchase={handlePurchase}
            onClose={handleClose}
          />
        </div>
      </div>
    );
}