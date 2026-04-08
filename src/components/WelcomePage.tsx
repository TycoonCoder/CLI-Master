import React, { useState } from 'react';

interface WelcomePageProps {
  onStartLearning: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onStartLearning }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Welcome to CLI Master",
      content: "Learn Linux command line through interactive, gamified lessons. No installation required - everything runs in your browser!",
      illustration: "🚀"
    },
    {
      title: "Why Learn CLI?",
      content: "The command line is a powerful tool used by developers, sysadmins, and tech professionals worldwide. It's faster, more efficient, and essential for automation.",
      illustration: "⚡"
    },
    {
      title: "Gamified Learning",
      content: "Earn XP, maintain streaks, and unlock achievements as you progress. Learn like playing a game with our Duolingo-inspired approach.",
      illustration: "🎮"
    },
    {
      title: "Safe Environment",
      content: "Practice commands in a simulated Linux environment. No risk of breaking your system - perfect for beginners!",
      illustration: "🛡️"
    },
    {
      title: "Ready to Start?",
      content: "Begin with basic commands like `pwd` and `ls`, then progress to advanced topics. Complete challenges and build real skills.",
      illustration: "💻"
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💻</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground">CLI Master</h1>
          </div>
          <p className="text-primary-300">Master the command line through interactive learning</p>
        </div>

        {/* Slides */}
        <div className="card p-8 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center">
            {/* Illustration */}
            <div className="md:w-1/3 mb-6 md:mb-0 md:mr-8">
              <div className="text-8xl text-center">{currentSlideData.illustration}</div>
            </div>
            
            {/* Content */}
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold text-foreground mb-4">{currentSlideData.title}</h2>
              <div className="text-primary-300 text-lg mb-6 leading-relaxed">
                {currentSlideData.content}
              </div>
              
              {/* Progress indicators */}
              <div className="flex items-center justify-between mt-8">
                <div className="flex space-x-2">
                  {slides.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-3 h-3 rounded-full ${idx === currentSlide ? 'bg-accent-500' : 'bg-primary-700'}`}
                    />
                  ))}
                </div>
                
                <div className="text-sm text-primary-300">
                  {currentSlide + 1} of {slides.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`btn-secondary ${currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            ← Previous
          </button>
          
          {currentSlide === slides.length - 1 ? (
            <button
              onClick={onStartLearning}
              className="btn-primary px-8 py-3 text-lg"
            >
              Start Learning Now →
            </button>
          ) : (
            <button
              onClick={nextSlide}
              className="btn-primary"
            >
              Next →
            </button>
          )}
        </div>

        {/* Quick Start Option */}
        {currentSlide === slides.length - 1 && (
          <div className="mt-12 text-center">
            <p className="text-primary-300 mb-4">Or jump right in:</p>
            <button
              onClick={onStartLearning}
              className="btn-secondary"
            >
              Skip Tutorial & Start Learning
            </button>
          </div>
        )}

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 text-center">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="font-semibold text-foreground mb-2">Interactive Lessons</h3>
            <p className="text-primary-300 text-sm">Practice commands in real-time with instant feedback</p>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="font-semibold text-foreground mb-2">Track Progress</h3>
            <p className="text-primary-300 text-sm">Monitor your improvement with XP, streaks, and achievements</p>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-3xl mb-4">🆓</div>
            <h3 className="font-semibold text-foreground mb-2">100% Free</h3>
            <p className="text-primary-300 text-sm">No signup required, works entirely in your browser</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-primary-800 text-center text-primary-400 text-sm">
          <p>CLI Master - Learn Linux command line through gamified interactive lessons</p>
          <p className="mt-2">No backend required • Works offline • Open source</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;