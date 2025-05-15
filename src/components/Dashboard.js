import React from 'react';

function Dashboard({ selectedUnits, result, onStartOver }) {
  return (
    <div className="bg-[#D1C4E9] p-4 rounded-lg mb-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#5F259F]">Selected Units</h2>
        <button 
          onClick={onStartOver}
          className="bg-[#00B2A9] hover:bg-[#B2E0E5] text-white hover:text-[#5F259F] font-medium py-2 px-4 rounded transition-colors duration-300 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Start Over
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {selectedUnits.length === 0 ? (
          <p className="text-gray-600 italic">No units selected yet</p>
        ) : (
          selectedUnits.map((unit) => (
            <span 
              key={unit} 
              className="bg-[#9B7FCB] text-white px-3 py-1 rounded-full text-sm"
            >
              {unit}
            </span>
          ))
        )}
      </div>

      {result && (
        <div className={`mt-4 p-4 rounded-lg ${result.eligible ? 'bg-[#B2E0E5]' : 'bg-[#FFF9C4]'}`}>
          <h3 className={`font-bold mb-1 ${result.eligible ? 'text-[#00B2A9]' : 'text-amber-700'}`}>
            {result.eligible ? '✅ Eligible for Award' : '⚠️ Not Eligible'}
          </h3>
          <p>{result.message}</p>
          
          {result.eligible && (
            <div className="mt-3 text-sm text-gray-700">
              <p>Remember to check with your examination officer for the final verification of your eligibility.</p>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600 border-t border-[#9B7FCB] pt-3">
        <p>Click <strong>Start Over</strong> to reset your unit selection and check different combinations.</p>
      </div>
    </div>
  );
}

export default Dashboard; 