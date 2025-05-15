import React from 'react';
import { units } from '../data/units';

function Calculator({ 
  selectedUnits, 
  setSelectedUnits, 
  result, 
  setResult, 
  expandStates, 
  setExpandStates 
}) {
  const toggleExpand = (section) => {
    setExpandStates({
      ...expandStates,
      [section]: !expandStates[section]
    });
  };

  const toggleUnit = (unitCode) => {
    if (selectedUnits.includes(unitCode)) {
      setSelectedUnits(selectedUnits.filter(code => code !== unitCode));
    } else {
      setSelectedUnits([...selectedUnits, unitCode]);
    }
  };

  const checkIALEligibility = () => {
    try {
      if (selectedUnits.length === 0) {
        throw new Error("Please select at least one unit");
      }

      // Check Pure Mathematics eligibility
      const pureUnits = ["P1", "P2", "P3", "P4"];
      const hasPureComplete = pureUnits.every(unit => selectedUnits.includes(unit));

      // Check for valid applied pairs
      const validPairs = [
        ["S1", "S2"], ["M1", "M2"], ["S1", "M1"], 
        ["S1", "D1"], ["M1", "D1"]
      ];
      const hasValidPair = validPairs.some(pair => 
        pair.every(unit => selectedUnits.includes(unit))
      );

      if (!hasPureComplete) {
        setResult({
          eligible: false,
          message: "Missing one or more required Pure Mathematics units (P1-P4)"
        });
        return;
      }

      if (!hasValidPair) {
        setResult({
          eligible: false,
          message: "Missing a valid applied pair"
        });
        return;
      }

      setResult({
        eligible: true,
        message: "You are eligible for the IAL Mathematics qualification!"
      });

    } catch (error) {
      setResult({
        eligible: false,
        message: error.message
      });
    }
  };

  const renderSection = (sectionKey, title, unitList) => (
    <div className="mb-6">
      <div 
        className="flex items-center justify-between bg-[#9B7FCB] p-3 rounded-md cursor-pointer"
        onClick={() => toggleExpand(sectionKey)}
      >
        <h3 className="text-white font-medium">{title}</h3>
        <svg 
          className={`w-5 h-5 text-white transition-transform ${expandStates[sectionKey] ? 'transform rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {expandStates[sectionKey] && (
        <div className="bg-white p-4 border border-[#D1C4E9] rounded-b-md shadow-inner grid grid-cols-2 md:grid-cols-3 gap-3">
          {unitList.map(unit => (
            <div 
              key={unit.code}
              className={`p-2 rounded-md cursor-pointer transition-colors ${
                selectedUnits.includes(unit.code)
                  ? 'bg-[#5F259F] text-white' 
                  : 'bg-[#D1C4E9] text-[#5F259F] hover:bg-[#9B7FCB] hover:text-white'
              }`}
              onClick={() => toggleUnit(unit.code)}
            >
              <div className="font-bold">{unit.code}</div>
              <div className="text-sm">{unit.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-[#5F259F] mb-4">Select your units</h2>
      
      {renderSection("pure", "Pure Mathematics", units.pure)}
      {renderSection("further", "Further Pure Mathematics", units.further)}
      {renderSection("applied", "Applied Mathematics", units.applied)}

      <div className="mt-6">
        <button 
          className="w-full py-3 bg-[#5F259F] hover:bg-[#9B7FCB] text-white font-medium rounded-md shadow transition-colors"
          onClick={checkIALEligibility}
        >
          Check Eligibility
        </button>
      </div>
    </div>
  );
}

export default Calculator; 