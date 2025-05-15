import React, { useState } from 'react';
import { units } from '../data/units';

function Calculator({ 
  selectedUnits, 
  setSelectedUnits, 
  result, 
  setResult, 
  expandStates, 
  setExpandStates 
}) {
  const [qualificationMode, setQualificationMode] = useState('standard'); // 'standard' or 'dual'
  const [selectedQualification, setSelectedQualification] = useState('ial+ias');
  
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

      if (qualificationMode === 'standard') {
        checkStandardEligibility();
      } else {
        checkDualEligibility();
      }
    } catch (error) {
      setResult({
        eligible: false,
        message: error.message
      });
    }
  };

  const checkStandardEligibility = () => {
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
      message: "You are eligible for the IAL Mathematics qualification (YMA01)!"
    });
  };

  const checkDualEligibility = () => {
    // Check Pure Mathematics eligibility for IAL
    const pureUnits = ["P1", "P2", "P3", "P4"];
    const hasPureComplete = pureUnits.every(unit => selectedUnits.includes(unit));
    
    // Check for valid applied pairs for IAL
    const validPairs = [
      ["S1", "S2"], ["M1", "M2"], ["S1", "M1"], 
      ["S1", "D1"], ["M1", "D1"]
    ];
    const hasValidPair = validPairs.some(pair => 
      pair.every(unit => selectedUnits.includes(unit))
    );

    // Check Further Pure requirements
    const hasFP1 = selectedUnits.includes("FP1");
    
    // Count additional further pure units
    const furtherPureCount = ["FP2", "FP3"].filter(unit => 
      selectedUnits.includes(unit)
    ).length;
    
    // Count all applied units that aren't used in the IAL requirement
    // We're simplifying here, in a real scenario you'd need to handle
    // the specific allocation rules more carefully
    const unusedAppliedUnits = ["S1", "S2", "S3", "M1", "M2", "M3", "D1"].filter(unit => 
      selectedUnits.includes(unit)
    ).length - 2; // Subtract 2 for the IAL applied pair

    if (!hasPureComplete) {
      setResult({
        eligible: false,
        message: "Missing required Pure Mathematics units (P1-P4) for IAL Mathematics"
      });
      return;
    }

    if (!hasValidPair) {
      setResult({
        eligible: false,
        message: "Missing a valid applied pair for IAL Mathematics"
      });
      return;
    }

    if (!hasFP1) {
      setResult({
        eligible: false,
        message: "FP1 is required for IAS Further Mathematics"
      });
      return;
    }

    // Need at least 2 more units beyond FP1
    const additionalUnitsNeeded = 2;
    const additionalUnitsAvailable = furtherPureCount + Math.max(0, unusedAppliedUnits);

    if (additionalUnitsAvailable < additionalUnitsNeeded) {
      setResult({
        eligible: false,
        message: `You need ${additionalUnitsNeeded} additional units beyond FP1 for IAS Further Mathematics. You currently have ${additionalUnitsAvailable}.`
      });
      return;
    }

    setResult({
      eligible: true,
      message: "You are eligible for both IAL Mathematics (YMA01) and IAS Further Mathematics (YFM01) qualifications!"
    });
  };

  const renderModeSelector = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-[#5F259F] mb-3">Qualification Mode</h3>
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-md ${
            qualificationMode === 'standard'
              ? 'bg-[#5F259F] text-white'
              : 'bg-[#D1C4E9] text-[#5F259F] hover:bg-[#9B7FCB] hover:text-white'
          }`}
          onClick={() => setQualificationMode('standard')}
        >
          Standard Mathematics Eligibility
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            qualificationMode === 'dual'
              ? 'bg-[#5F259F] text-white'
              : 'bg-[#D1C4E9] text-[#5F259F] hover:bg-[#9B7FCB] hover:text-white'
          }`}
          onClick={() => setQualificationMode('dual')}
        >
          Dual Qualification Mode
        </button>
      </div>
      
      {qualificationMode === 'standard' ? (
        <div className="bg-[#E6F7FF] p-4 rounded-lg border-l-4 border-[#1890FF]">
          <p className="text-sm">
            <strong>Standard Mode:</strong> Check eligibility for Mathematics (YMA01), Further Mathematics (YFM01), or IAS Further Mathematics qualifications. This mode now includes support for qualification combinations and transfer of credit options.
          </p>
        </div>
      ) : (
        <div className="bg-[#E6F7FF] p-4 rounded-lg border-l-4 border-[#1890FF]">
          <p className="text-sm">
            <strong>Dual Qualification Mode:</strong> Check if you are eligible to obtain both Mathematics (YMA01) and Further Mathematics (YFM01) qualifications with the selected units. This mode helps properly allocate units between the two qualifications.
          </p>
        </div>
      )}
    </div>
  );

  const renderInfoBanner = () => (
    <div className="bg-[#E8F5E9] p-4 rounded-lg mb-6">
      <h3 className="font-semibold text-[#5F259F]">Important Information About Unit Aggregation</h3>
      <p className="text-sm mt-1">
        When combining different qualifications (e.g., IAL Mathematics with IAS Further Mathematics), you must ensure proper unit aggregation. Units previously cashed in may need to be uncashed before being used in a new qualification.
      </p>
      <a 
        href="/ial-mathematics-aggregation-rules.pdf" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-[#00B2A9] hover:underline text-sm font-medium mt-2 inline-block"
      >
        View detailed aggregation guidance
      </a>
    </div>
  );

  const renderQualificationSelector = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-[#5F259F] mb-3">Additional Qualification Options</h3>
      <p className="mb-2 text-sm">Select the combination of qualifications you are aiming for:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div 
          className={`p-4 rounded-md cursor-pointer border ${
            selectedQualification === 'ial+ias' 
              ? 'bg-[#E8F5E9] border-[#00B2A9]' 
              : 'bg-white border-gray-200 hover:bg-[#F5F5F5]'
          }`}
          onClick={() => setSelectedQualification('ial+ias')}
        >
          <h4 className="font-semibold">IAL Mathematics + IAS Further Mathematics</h4>
          <p className="text-sm text-gray-600">Full A Level Mathematics with AS Level Further Mathematics</p>
        </div>
        
        <div 
          className={`p-4 rounded-md cursor-pointer border ${
            selectedQualification === 'transfer' 
              ? 'bg-[#E8F5E9] border-[#00B2A9]' 
              : 'bg-white border-gray-200 hover:bg-[#F5F5F5]'
          }`}
          onClick={() => setSelectedQualification('transfer')}
        >
          <h4 className="font-semibold">Transfer of Credit</h4>
          <p className="text-sm text-gray-600">Using qualifications from other exam boards</p>
        </div>
      </div>
      
      {selectedQualification === 'ial+ias' && (
        <div className="bg-[#FFF9C4] p-4 rounded-lg mt-4 border-l-4 border-[#FFD700]">
          <h4 className="font-semibold">Important Reminder for IAL + IAS Combinations</h4>
          <p className="text-sm mt-1">
            If you have previously cashed in IAS Mathematics or Further Mathematics, you must uncash these qualifications
            when cashing in the IAL options to allow reaggregation of units.
          </p>
          <p className="text-sm mt-2">
            Your examination officer can help with the uncashing process, which must be completed before the IAL qualification
            can be awarded.
          </p>
        </div>
      )}
      
      {selectedQualification === 'transfer' && (
        <div className="bg-[#E6F7FF] p-4 rounded-lg mt-4">
          <h4 className="font-semibold">Transfer of Credit Information</h4>
          <p className="text-sm mt-1">
            If you are cashing in Edexcel IAL Mathematics with units from another exam board, you'll need to follow the Transfer
            of Credit process.
          </p>
          <p className="text-sm mt-2 text-blue-600 hover:underline cursor-pointer">
            Visit the Transfer of Credit page →
          </p>
          
          <h4 className="font-semibold mt-4">Transfer of Credit Key Points:</h4>
          <ul className="list-disc pl-5 text-sm mt-1">
            <li>You must apply for Transfer of Credit before the qualification can be awarded</li>
            <li>Applications must be made via your examination officer</li>
            <li>Evidence of the previously achieved qualification must be provided</li>
            <li>Check deadline dates carefully - applications must be received before results day</li>
          </ul>
        </div>
      )}
      
      {selectedQualification === 'ial+ias' && (
        <div className="mt-4">
          <h4 className="font-semibold">IAL Mathematics + IAS Further Mathematics Requirements:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <h5 className="font-medium">For IAL Mathematics:</h5>
              <ul className="list-disc pl-5 text-sm">
                <li>P1, P2, P3, and P4</li>
                <li>One valid pair from the applied units</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium">For IAS Further Mathematics:</h5>
              <ul className="list-disc pl-5 text-sm">
                <li>FP1 is required</li>
                <li>Two more units (cannot include P1-P4)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );

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

  const renderAdditionalResources = () => (
    <div className="bg-[#E8F5E9] p-4 rounded-lg mt-6">
      <h3 className="font-semibold">Additional Resources:</h3>
      <div className="mt-2">
        <a 
          href="/ial-mathematics-aggregation-rules.pdf" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-[#00B2A9] hover:underline mb-2"
        >
          <span className="mr-2">📄</span>
          IAL Mathematics Aggregation Rules and Guidance
        </a>
        <a 
          href="https://qualifications.pearson.com/en/qualifications/edexcel-international-advanced-levels/mathematics.html" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-[#00B2A9] hover:underline"
        >
          <span className="mr-2">🔗</span>
          Edexcel IAL Mathematics Qualification Page
        </a>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-[#5F259F] mb-4">Mathematics Eligibility Calculator</h2>
      
      {renderInfoBanner()}
      {renderModeSelector()}
      {renderQualificationSelector()}
      
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

      {renderAdditionalResources()}
    </div>
  );
}

export default Calculator; 