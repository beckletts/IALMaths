import React, { useState, useEffect } from 'react';

function ResultPanel({ result }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  useEffect(() => {
    if (result) {
      setIsVisible(true);
      setIsCollapsed(false);
    } else {
      setIsVisible(false);
    }
  }, [result]);
  
  if (!isVisible || !result) return null;
  
  return (
    <div className={`fixed top-5 right-5 z-50 bg-white rounded-lg shadow-lg transition-all duration-300 ${
      isCollapsed ? 'w-14 h-14' : 'w-80'
    }`}>
      <div className={`${result.eligible ? 'bg-[#00B2A9]' : 'bg-amber-500'} text-white p-3 rounded-t-lg flex justify-between items-center`}>
        <h3 className={`font-medium text-sm ${isCollapsed ? 'hidden' : ''}`}>
          {result.eligible ? '✅ Eligible for Award' : '⚠️ Not Eligible'}
        </h3>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="p-1 hover:bg-opacity-70 rounded-full focus:outline-none"
          aria-label={isCollapsed ? "Expand result panel" : "Collapse result panel"}
        >
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="p-3 max-h-48 overflow-y-auto">
          <p className="text-sm mb-2">{result.message}</p>
          
          {result.eligible && (
            <div className="mt-3 text-xs text-gray-600 border-t border-gray-200 pt-2">
              <p>Remember to check with your examination officer for the final verification of your eligibility.</p>
            </div>
          )}
          
          <button 
            onClick={() => setIsVisible(false)}
            className="mt-3 w-full text-xs text-gray-500 hover:text-gray-700 text-center"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export default ResultPanel; 