import React from 'react';

const DashboardCard = ({ title, children, statusLabel = null, statusColor = null, onTitleClick }) => {
  return (
    <div className="bg-whoop-card rounded-2xl p-4 w-full flex flex-col justify-between min-h-[160px]">
      <div className="flex justify-between items-start mb-4">
        <h3 
          className={`text-xs font-bold tracking-widest uppercase text-white leading-tight w-2/3 ${onTitleClick ? 'cursor-pointer hover:text-whoop-primary transition-colors' : ''}`}
          onClick={onTitleClick}
        >
          {title}
        </h3>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-whoop-textDim" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      
      <div className="flex-grow">
        {children}
      </div>

      {statusLabel && (
        <div className="mt-4 flex items-center">
          <div className={`w-6 h-6 rounded flex items-center justify-center mr-2 ${statusColor ? statusColor : 'bg-whoop-card'}`}>
             {statusColor && <svg className="w-4 h-4 text-whoop-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
          </div>
          <div className="flex flex-col">
             <span className={`text-xs font-bold uppercase ${statusColor ? 'text-whoop-recovery' : 'text-whoop-textDim'}`}>{statusLabel}</span>
             <span className="text-[10px] text-whoop-textDim">5/5 Metrics</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
