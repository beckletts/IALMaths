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
  
  // Determine the correct icon and color based on result
  const getStatusIcon = () => {
    if (result.eligible) {
      return '✅';
    } else if (result.qualification) {
      // Partially eligible - eligible for a lesser qualification
      return '✓';
    } else {
      return '⚠️';
    }
  };
  
  const getHeaderColor = () => {
    if (result.eligible) {
      return 'bg-[#059669]'; // Green with better contrast
    } else if (result.qualification) {
      // Partially eligible - amber with better contrast
      return 'bg-[#F59E0B]';
    } else {
      return 'bg-[#DC2626]'; // Red with better contrast
    }
  };
  
  const getHeaderTitle = () => {
    if (result.eligible) {
      return 'Eligible for Award';
    } else if (result.qualification) {
      return `Eligible for ${result.qualification}`;
    } else {
      return 'Not Eligible';
    }
  };

  // Helper function for text color based on background
  const getTextColor = () => {
    if (result.qualification) {
      return 'text-black'; // Black text on amber background for better contrast
    } 
    return 'text-white'; // White text on green or red
  };
  
  return (
    <div className={`fixed top-5 right-5 z-50 bg-white rounded-lg shadow-lg transition-all duration-300 ${
      isCollapsed ? 'w-14 h-14' : 'w-80'
    }`}>
      <div className={`${getHeaderColor()} ${getTextColor()} p-3 rounded-t-lg flex justify-between items-center`}>
        <h3 className={`font-medium text-sm ${isCollapsed ? 'hidden' : ''}`}>
          {getStatusIcon()} {getHeaderTitle()}
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
          <p className="text-sm mb-2 text-gray-900">{result.message}</p>
          
          {result.alternativeMessage && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-900 border border-gray-300">
              <p>{result.alternativeMessage}</p>
            </div>
          )}
          
          {(result.eligible || result.qualification) && (
            <div className="mt-3 text-xs text-gray-700 border-t border-gray-300 pt-2">
              <p>Remember to check with your examination officer for the final verification of your eligibility.</p>
            </div>
          )}
          
          <button 
            onClick={() => setIsVisible(false)}
            className="mt-3 w-full text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-2 rounded transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export default ResultPanel; 