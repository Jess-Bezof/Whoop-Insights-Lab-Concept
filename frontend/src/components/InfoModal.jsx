import React from 'react';

const InfoModal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-whoop-card border border-whoop-border rounded-2xl p-6 max-w-sm w-full shadow-2xl relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
          <button 
            onClick={onClose}
            className="text-whoop-textDim hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="text-whoop-textDim text-sm leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
