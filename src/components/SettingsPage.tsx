import { useNavigate } from 'react-router-dom';
import Settings from './Settings';

export default function SettingsPage() {
  const navigate = useNavigate();

  const handleResetProgress = () => {
    console.log('🔄 Resetting progress');
    // Reset logic handled by parent
    navigate('/');
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleOpenShop = () => {
    navigate('/shop');
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
            <div className="text-foreground font-semibold">Settings</div>
            <div className="w-6" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Settings 
          onResetProgress={handleResetProgress}
          onClose={handleBack}
          onOpenShop={handleOpenShop}
        />
      </div>
    </div>
  );
}