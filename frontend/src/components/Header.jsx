import React from 'react';

const Header = () => {
  return (
    <header className="flex justify-between items-center w-full px-4 py-2 mb-4">
      <div className="w-8 h-8 rounded-full border border-whoop-textDim flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    </header>
  );
};

export default Header;
