import React from 'react';

const CircularMetric = ({ value, label, color, subLabel = '', max = 100, suffix = '', onClick, size = 'w-24 h-24' }) => {
  const radius = 36;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / max) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`relative ${size} ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        {/* Background Ring */}
        <svg
          height="100%"
          width="100%"
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
          className="rotate-[-90deg]"
        >
          <circle
            stroke="#2A2A2A"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress Ring */}
          <circle
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        {/* Center Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">
            {value}<span className="text-sm align-top">{suffix}</span>
          </span>
        </div>
      </div>
      {/* Label */}
      <div 
        className={`mt-2 text-xs font-bold tracking-widest uppercase text-whoop-textDim flex items-center gap-1 ${onClick ? 'cursor-pointer hover:text-whoop-primary transition-colors' : ''}`}
        onClick={onClick}
      >
        {label}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
};

export default CircularMetric;
