import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  current, 
  total, 
  label, 
  showPercentage = true 
}) => {
  const percentage = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        {label && (
          <span className="text-sm font-medium text-gray-700">{label}</span>
        )}
        {showPercentage && (
          <span className="text-sm font-bold text-primary-600">{percentage}%</span>
        )}
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-500">{current}/{total}</span>
        <div className="flex items-center space-x-2">
          {percentage === 100 && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              🎉 Complete!
            </span>
          )}
          {percentage >= 75 && percentage < 100 && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              Almost there!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;