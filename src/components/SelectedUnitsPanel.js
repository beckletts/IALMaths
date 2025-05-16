import React, { useState } from 'react';
import ReactGA from 'react-ga4';

function SelectedUnitsPanel({ selectedUnits }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleCollapse = () => {
    // Track panel collapse/expand
    ReactGA.event({
      category: 'UI',
      action: isCollapsed ? 'Expand Selected Units Panel' : 'Collapse Selected Units Panel'
    });
    
    setIsCollapsed(!isCollapsed);
  };
  
  return (
    <div className={`fixed bottom-5 right-5 z-50 bg-white rounded-lg shadow-lg transition-all duration-300 ${
      isCollapsed ? 'w-14 h-14' : 'w-64'
    }`}>
      <div className="bg-[#4A1D7A] text-white p-3 rounded-t-lg flex justify-between items-center">
        <h3 className={`font-medium text-sm ${isCollapsed ? 'hidden' : ''}`}>Selected Units</h3>
        <button 
          onClick={handleCollapse} 
          className="p-1 hover:bg-[#5F259F] rounded-full focus:outline-none"
          aria-label={isCollapsed ? "Expand selected units panel" : "Collapse selected units panel"}
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
          {selectedUnits.length === 0 ? (
            <p className="text-gray-700 text-sm italic">No units selected</p>
          ) : (
            <div className="flex flex-wrap gap-1">
              {selectedUnits.map(unit => (
                <span 
                  key={unit} 
                  className="bg-[#9B7FCB] text-white px-2 py-1 rounded text-xs font-medium"
                >
                  {unit}
                </span>
              ))}
            </div>
          )}
          <div className="border-t border-gray-300 mt-2 pt-2">
            <p className="text-xs text-gray-700">Total: {selectedUnits.length} units</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SelectedUnitsPanel; 