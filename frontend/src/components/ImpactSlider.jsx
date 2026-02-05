import React from 'react';

const ImpactSlider = ({ label, value, min, max, step = 1, onChange, unit = '', valueLabel = null, reverseColor = false }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  // Determine color based on percentage
  let trackColor = 'bg-whoop-recovery'; // Green
  if (reverseColor) {
      // For metrics where "High" is bad (e.g., Stress, Alcohol)
      if (percentage > 66) trackColor = 'bg-whoop-red';
      else if (percentage > 33) trackColor = 'bg-whoop-yellow';
  } else {
      // For metrics where "High" is good (e.g., Sleep)
      if (percentage < 33) trackColor = 'bg-whoop-red';
      else if (percentage < 66) trackColor = 'bg-whoop-yellow';
  }

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
          {label}
        </label>
        <span className="text-sm font-bold text-white">
          {valueLabel ? valueLabel : `${value}${unit}`}
        </span>
      </div>
      <div className="relative w-full h-2 bg-whoop-card rounded-full border border-white/10">
        <div 
          className={`absolute top-0 left-0 h-full rounded-full transition-colors duration-300 ${trackColor}`}
          style={{ width: `${percentage}%` }}
        ></div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md pointer-events-none"
            style={{ left: `calc(${percentage}% - 8px)` }}
        ></div>
      </div>
    </div>
  );
};

export default ImpactSlider;
