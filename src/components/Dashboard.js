import React from 'react';

function Dashboard({ selectedUnits, result, onStartOver }) {
  return (
    <div className="bg-[#D1C4E9] p-4 rounded-lg mb-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#5F259F]">Selected Units</h2>
        <button 
          onClick={onStartOver}
          className="bg-[#00B2A9] hover:bg-[#B2E0E5] text-white hover:text-[#5F259F] font-medium py-2 px-4 rounded transition-colors duration-300"
        >
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
        <div className={`mt-4 p-3 rounded-lg ${result.eligible ? 'bg-[#B2E0E5]' : 'bg-[#FFF9C4]'}`}>
          <h3 className="font-bold mb-1">
            {result.eligible ? 'Eligible for Award' : 'Not Eligible'}
          </h3>
          <p>{result.message}</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard; 