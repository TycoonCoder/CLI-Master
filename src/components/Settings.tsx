import React, { useState } from 'react';

interface SettingsProps {
  onResetProgress: () => void;
  onClose: () => void;
  onOpenShop?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onResetProgress, onClose, onOpenShop }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const handleResetConfirm = () => {
    onResetProgress();
    setShowConfirm(false);
  };

  const handleDebugLocalStorage = () => {
    const saved = localStorage.getItem('climaster-progress');
    let info = '=== LocalStorage Debug ===\n\n';
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        info += `✅ Found saved progress:\n`;
        info += `XP: ${parsed.xp || 0}\n`;
        info += `Bits: ${parsed.bits ?? 5}\n`;
        info += `Level: ${parsed.level || 1}\n`;
        info += `Completed Lessons: ${(parsed.completedLessons || []).length}\n`;
        info += `Has XP Boost: ${parsed.hasXpBoost || false}\n`;
        info += `Last Active: ${parsed.lastActive || 'N/A'}\n\n`;
        info += `Raw JSON (first 500 chars):\n${saved.substring(0, 500)}...`;
      } catch (e) {
        info += `❌ Error parsing: ${e}\n\nRaw content:\n${saved}`;
      }
    } else {
      info += '❌ No saved progress found in localStorage';
    }
    
    setDebugInfo(info);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-start md:justify-center z-50 p-3 md:p-4 animate-fade-in overflow-y-auto">
      <div className="card max-w-md w-full p-4 md:p-6 animate-slide-up my-auto md:my-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-foreground">Settings</h2>
          <button
            onClick={onClose}
            className="text-primary-400 hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Progress Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Progress Management</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-primary-800 rounded border border-primary-700">
                <div>
                  <div className="font-medium text-foreground">Reset All Progress</div>
                  <div className="text-sm text-primary-300 mt-1">
                    Delete all saved progress, XP, and achievements
                  </div>
                </div>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="btn-danger text-sm"
                >
                  Reset
                </button>
              </div>
              
              {showConfirm && (
                <div className="p-4 bg-primary-800 border border-primary-700 rounded-lg">
                  <p className="text-foreground font-medium mb-3">Are you sure?</p>
                  <p className="text-primary-300 text-sm mb-4">
                    This will permanently delete all your progress, including XP, streaks, and completed lessons. This action cannot be undone.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleResetConfirm}
                      className="btn-danger flex-1"
                    >
                      Yes, Reset Everything
                    </button>
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Display Settings */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Display</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-primary-800 rounded border border-primary-700">
                <div>
                  <div className="font-medium text-foreground">Terminal Font Size</div>
                  <div className="text-sm text-primary-300 mt-1">
                    Adjust terminal text size
                  </div>
                </div>
                <select className="bg-primary-900 border border-primary-700 rounded px-3 py-1.5 text-foreground">
                  <option>Small</option>
                  <option selected>Medium</option>
                  <option>Large</option>
                </select>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-primary-800 rounded border border-primary-700">
                <div>
                  <div className="font-medium text-foreground">Show Hints</div>
                  <div className="text-sm text-primary-300 mt-1">
                    Display hints when stuck on challenges
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-primary-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">About CLI Master</h3>
            <div className="p-3 bg-primary-800 rounded border border-primary-700">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-primary-300">Version</span>
                  <span className="text-foreground">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-300">Lessons</span>
                  <span className="text-foreground">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-300">Commands</span>
                  <span className="text-foreground">8+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-300">Storage</span>
                  <span className="text-foreground">Browser (localStorage)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shop */}
          {onOpenShop && (
            <div>
              <h3 className="font-semibold text-foreground mb-3">Shop</h3>
              <button 
                onClick={onOpenShop}
                className="btn-primary w-full py-2"
              >
                🛒 Open Bits Shop
              </button>
              <p className="text-xs text-primary-400 mt-2">
                Spend Bits on XP boosts and cosmetics
              </p>
            </div>
          )}

          {/* Export/Import */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Data Management</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="btn-secondary py-2">
                Export Progress
              </button>
              <button className="btn-secondary py-2">
                Import Progress
              </button>
            </div>
            <p className="text-xs text-primary-400 mt-2">
              Export/Import feature coming soon
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-primary-700">
          <button
            onClick={onClose}
            className="btn-primary w-full"
          >
            Close Settings
          </button>
        </div>

        {/* Debug Section */}
        <div className="mt-8 pt-6 border-t border-primary-800">
          <h3 className="font-semibold text-foreground mb-3">Debug</h3>
          
          <div className="space-y-3">
            <button
              onClick={handleDebugLocalStorage}
              className="w-full btn-secondary text-sm"
            >
              Debug LocalStorage
            </button>
            
            {debugInfo && (
              <div className="mt-4 p-4 bg-primary-800/50 rounded-lg border border-primary-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-foreground">Debug Info</span>
                  <button 
                    onClick={() => setDebugInfo('')}
                    className="text-xs text-primary-400 hover:text-foreground"
                  >
                    Clear
                  </button>
                </div>
                <pre className="text-xs text-primary-300 whitespace-pre-wrap overflow-auto max-h-64">
                  {debugInfo}
                </pre>
              </div>
            )}
            
            <div className="text-xs text-primary-400 mt-2">
              <p>Current localStorage key: <code>climaster-progress</code></p>
              <p>Check browser console for detailed logs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;