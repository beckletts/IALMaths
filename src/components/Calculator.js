import React, { useState } from 'react';
import ReactGA from 'react-ga4';
import { units } from '../data/units';
import SelectedUnitsPanel from './SelectedUnitsPanel';

function Calculator({ 
  selectedUnits, 
  setSelectedUnits, 
  result, 
  setResult, 
  expandStates, 
  setExpandStates,
  onStartOver
}) {
  const [qualificationMode, setQualificationMode] = useState('standard'); // 'standard' or 'dual'
  const [selectedQualification, setSelectedQualification] = useState('ial+ias');
  const [showQualOptions, setShowQualOptions] = useState(false);
  
  const toggleExpand = (section) => {
    // Track section expansion/collapse
    ReactGA.event({
      category: 'UI',
      action: expandStates[section] ? 'Collapse Section' : 'Expand Section',
      label: section
    });
    
    setExpandStates({
      ...expandStates,
      [section]: !expandStates[section]
    });
  };

  const toggleUnit = (unitCode) => {
    // Track unit selection/deselection
    ReactGA.event({
      category: 'Unit',
      action: selectedUnits.includes(unitCode) ? 'Deselect Unit' : 'Select Unit',
      label: unitCode
    });
    
    if (selectedUnits.includes(unitCode)) {
      setSelectedUnits(selectedUnits.filter(code => code !== unitCode));
    } else {
      setSelectedUnits([...selectedUnits, unitCode]);
    }
  };

  const checkIALEligibility = () => {
    try {
      // Track the eligibility check event
      ReactGA.event({
        category: 'Calculator',
        action: 'Check Eligibility',
        label: JSON.stringify({
          units: selectedUnits,
          mode: qualificationMode,
          qualification: selectedQualification
        })
      });

      if (selectedUnits.length === 0) {
        throw new Error("Please select at least one unit");
      }

      if (qualificationMode === 'standard') {
        checkStandardEligibility();
      } else {
        checkDualEligibility();
      }
    } catch (error) {
      // Track errors in eligibility check
      ReactGA.event({
        category: 'Error',
        action: 'Eligibility Check Error',
        label: error.message
      });
      
      setResult({
        eligible: false,
        message: error.message
      });
    }
  };

  const checkStandardEligibility = () => {
    // Check Further Pure requirements first
    const hasFP1 = selectedUnits.includes("FP1");
    
    // Count further pure units (FP1, FP2, FP3)
    const furtherPureUnits = ["FP1", "FP2", "FP3"].filter(unit => 
      selectedUnits.includes(unit)
    );
    
    // Count all applied units
    const appliedUnits = ["S1", "S2", "S3", "M1", "M2", "M3", "D1"].filter(unit => 
      selectedUnits.includes(unit)
    );

    // Check for P1 and P2
    const hasP1P2 = ["P1", "P2"].every(unit => selectedUnits.includes(unit));

    // Check for all P units
    const pureUnits = ["P1", "P2", "P3", "P4"];
    const hasPureComplete = pureUnits.every(unit => selectedUnits.includes(unit));

    // For YFM01 (IAL Further Mathematics)
    // Must have either:
    // 1. All three FP units plus three applied units, OR
    // 2. Two FP units plus four applied units
    const hasTwoFP = furtherPureUnits.length >= 2;
    const hasAllFP = furtherPureUnits.length === 3;
    const totalAppliedUnits = appliedUnits.length;
    const isEligibleForYFM01 = (hasAllFP && totalAppliedUnits >= 3) || 
                              (hasTwoFP && totalAppliedUnits >= 4);

    // Check YFM01 eligibility first
    if (isEligibleForYFM01) {
      setResult({
        eligible: true,
        message: "You are eligible for the IAL Further Mathematics qualification (YFM01)!",
        qualification: "IAL Further Mathematics (YFM01)"
      });
      return;
    }

    // Check for YPM01 eligibility (P1-P4 and at least one FP unit)
    if (hasPureComplete && furtherPureUnits.length >= 1) {
      setResult({
        eligible: true,
        message: "You are eligible for the IAL Pure Mathematics qualification (YPM01)!",
        qualification: "IAL Pure Mathematics (YPM01)"
      });
      return;
    }

    // For XFM01 (IAS Further Mathematics)
    // Must have FP1 plus two additional units (can be further pure or applied)
    const totalUnitsForXFM01 = (furtherPureUnits.length - 1) + appliedUnits.length; // -1 because we don't count FP1 twice
    const isEligibleForXFM01 = hasFP1 && totalUnitsForXFM01 >= 2;

    // Check XFM01 eligibility
    if (isEligibleForXFM01) {
      setResult({
        eligible: true,
        message: "You are eligible for the IAS Further Mathematics qualification (XFM01)!",
        qualification: "IAS Further Mathematics (XFM01)"
      });
      return;
    }

    // Check for XPM01 eligibility (P1, P2, and FP1)
    if (hasP1P2 && hasFP1 && !hasPureComplete) {
      setResult({
        eligible: true,
        message: "You are eligible for the IAS Pure Mathematics qualification (XPM01)!",
        qualification: "IAS Pure Mathematics (XPM01)"
      });
      return;
    }

    // If they have FP1 but not enough units, give specific guidance
    if (hasFP1) {
      if (hasTwoFP) {
        const appliedUnitsNeeded = 4 - totalAppliedUnits;
        setResult({
          eligible: false,
          message: `You have two Further Pure units but need ${appliedUnitsNeeded} more applied unit${appliedUnitsNeeded > 1 ? 's' : ''} to be eligible for IAL Further Mathematics (YFM01).`
        });
      } else {
        const unitsNeeded = 2 - totalUnitsForXFM01;
        setResult({
          eligible: false,
          message: `You have FP1 but need ${unitsNeeded} more unit${unitsNeeded > 1 ? 's' : ''} (either Further Pure or Applied) to be eligible for IAS Further Mathematics (XFM01).`
        });
      }
      return;
    }

    // Only check Pure Mathematics requirements if not eligible for Further Mathematics
    const pureUnits = ["P1", "P2", "P3", "P4"];
    const selectedPureUnits = pureUnits.filter(unit => selectedUnits.includes(unit));
    const hasPureComplete = pureUnits.every(unit => selectedUnits.includes(unit));
    
    // Check for AS Level eligibility (P1, P2 and one applied)

    // Check for valid applied pairs for IAL
    const validPairs = [
      ["S1", "S2"], ["M1", "M2"], ["S1", "M1"], 
      ["S1", "D1"], ["M1", "D1"]
    ];
    const hasValidPair = validPairs.some(pair => 
      pair.every(unit => selectedUnits.includes(unit))
    );

    // Check if user is eligible for IAS Mathematics
    const isEligibleForIAS = hasP1P2 && appliedUnits.length >= 1;

    if (!hasPureComplete && isEligibleForIAS) {
      setResult({
        eligible: true,
        message: "You are eligible for the IAS Mathematics qualification (XMA01), but not for the full IAL Mathematics (YMA01).",
        qualification: "IAS Mathematics (XMA01)",
        alternativeMessage: "To be eligible for IAL Mathematics (YMA01), you need to complete all Pure units (P1-P4) and have a valid applied pair."
      });
      return;
    }

    if (!hasPureComplete) {
      let message = "Missing one or more required Pure Mathematics units (P1-P4)";
      
      // If they have some pure units, be more specific
      if (selectedPureUnits.length > 0) {
        const missingUnits = pureUnits.filter(unit => !selectedUnits.includes(unit));
        message = `Missing ${missingUnits.join(", ")} from the required Pure Mathematics units`;
      }
      
      // Add recommendations if they're close to IAS
      if (selectedPureUnits.length >= 1) {
        const neededForIAS = [];
        if (!selectedUnits.includes("P1")) neededForIAS.push("P1");
        if (!selectedUnits.includes("P2")) neededForIAS.push("P2");
        if (appliedUnits.length === 0) neededForIAS.push("one applied unit");
        
        message += `. You could aim for IAS Mathematics (XMA01) by adding ${neededForIAS.join(" and ")}.`;
      }
      
      setResult({
        eligible: false,
        message: message
      });
      return;
    }

    if (!hasValidPair) {
      // Construct helpful message about what pairs they could add
      let message = "Missing a valid applied pair. You need one of: ";
      const possiblePairs = [];
      
      validPairs.forEach(pair => {
        const havePair = pair.filter(unit => selectedUnits.includes(unit));
        const missingFromPair = pair.filter(unit => !selectedUnits.includes(unit));
        
        if (havePair.length === 1) {
          possiblePairs.push(`${havePair[0]}+${missingFromPair[0]}`);
        } else if (havePair.length === 0) {
          possiblePairs.push(`${pair[0]}+${pair[1]}`);
        }
      });
      
      message += possiblePairs.join(", ");
      
      setResult({
        eligible: false,
        message: message
      });
      return;
    }

    setResult({
      eligible: true,
      message: "You are eligible for the IAL Mathematics qualification (YMA01)!"
    });
  };

  const checkDualEligibility = () => {
    // Check Further Pure requirements first
    const hasFP1 = selectedUnits.includes("FP1");
    
    // Count further pure units (FP1, FP2, FP3)
    const furtherPureUnits = ["FP1", "FP2", "FP3"].filter(unit => 
      selectedUnits.includes(unit)
    );
    
    // Count all applied units
    const appliedUnits = ["S1", "S2", "S3", "M1", "M2", "M3", "D1"].filter(unit => 
      selectedUnits.includes(unit)
    );

    // Check for P1 and P2
    const hasP1P2 = ["P1", "P2"].every(unit => selectedUnits.includes(unit));

    // For YFM01 (IAL Further Mathematics)
    // Must have either:
    // 1. All three FP units plus three applied units, OR
    // 2. Two FP units plus four applied units
    const hasTwoFP = furtherPureUnits.length >= 2;
    const hasAllFP = furtherPureUnits.length === 3;
    const totalAppliedUnits = appliedUnits.length;
    const isEligibleForYFM01 = (hasAllFP && totalAppliedUnits >= 3) || 
                              (hasTwoFP && totalAppliedUnits >= 4);

    // For XFM01 (IAS Further Mathematics)
    // Must have FP1 plus two additional units (can be further pure or applied)
    const totalUnitsForXFM01 = (furtherPureUnits.length - 1) + appliedUnits.length; // -1 because we don't count FP1 twice
    const isEligibleForXFM01 = hasFP1 && totalUnitsForXFM01 >= 2;

    // Only check Pure Mathematics requirements if not eligible for Further Mathematics
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
    
    // Check if eligible for IAS Mathematics (XMA01)
    const isEligibleForXMA01 = hasP1P2 && appliedUnits.length >= 1;
    
    // Check if eligible for Pure Mathematics (YPM01)
    const isEligibleForYPM01 = hasPureComplete && furtherPureUnits.length >= 1;
    
    // Check if student can get YMA01 (P1-P4 + valid applied pair)
    const canGetYMA01 = hasPureComplete && hasValidPair;

    // Check YMA01 and YPM01 conflict
    if (isEligibleForYPM01 && canGetYMA01) {
      setResult({
        eligible: false,
        message: "Unfortunately, you are not eligible to proceed at this time. While you have sufficient units for both the YMA01 and YPM01 qualifications, these two qualifications cannot be cashed in during the same exam series."
      });
      return;
    }

    // Check if eligible for both YMA01 and YFM01
    if (canGetYMA01 && isEligibleForYFM01) {
      setResult({
        eligible: true,
        message: "You are eligible for both IAL Mathematics (YMA01) and IAL Further Mathematics (YFM01) qualifications!"
      });
      return;
    }

    // Check if eligible for YFM01 alone
    if (isEligibleForYFM01) {
      setResult({
        eligible: true,
        message: "You are eligible for the IAL Further Mathematics qualification (YFM01)!"
      });
      return;
    }

    // Check if eligible for YPM01 alone
    if (isEligibleForYPM01) {
      setResult({
        eligible: true,
        message: "You are eligible for the IAL Pure Mathematics qualification (YPM01)!",
        qualification: "IAL Pure Mathematics (YPM01)"
      });
      return;
    }

    // Check if eligible for XFM01 alone
    if (isEligibleForXFM01) {
      setResult({
        eligible: true,
        message: "You are eligible for the IAS Further Mathematics qualification (XFM01)!"
      });
      return;
    }

    // Check for XPM01 eligibility (P1, P2, and FP1)
    if (hasP1P2 && hasFP1 && !hasPureComplete) {
      setResult({
        eligible: true,
        message: "You are eligible for the IAS Pure Mathematics qualification (XPM01)!",
        qualification: "IAS Pure Mathematics (XPM01)"
      });
      return;
    }

    // If they have FP1 but not enough units, give specific guidance
    if (hasFP1) {
      if (hasTwoFP) {
        const appliedUnitsNeeded = 4 - totalAppliedUnits;
        setResult({
          eligible: false,
          message: `You have two Further Pure units but need ${appliedUnitsNeeded} more applied unit${appliedUnitsNeeded > 1 ? 's' : ''} to be eligible for IAL Further Mathematics (YFM01).`
        });
      } else {
        const unitsNeeded = 2 - totalUnitsForXFM01;
        setResult({
          eligible: false,
          message: `You have FP1 but need ${unitsNeeded} more unit${unitsNeeded > 1 ? 's' : ''} (either Further Pure or Applied) to be eligible for IAS Further Mathematics (XFM01).`
        });
      }
      return;
    }

    // Check Pure Mathematics requirements if not eligible for Further Mathematics
    if (!hasPureComplete) {
      let message = "Missing one or more required Pure Mathematics units (P1-P4)";
      
      // Add recommendations for Further Mathematics if they're close
      if (hasFP1) {
        message += ". However, you could aim for IAS Further Mathematics (XFM01) by adding " + 
                  (totalAppliedUnits === 0 ? "two more units" : 
                   totalAppliedUnits === 1 ? "one more unit" : "");
      }
      
      setResult({
        eligible: false,
        message: message
      });
      return;
    }

    // Check if eligible for IAS Mathematics alone
    const isEligibleForIAS = hasP1P2 && appliedUnits.length >= 1;

    if (!hasPureComplete && !hasFP1) {
      // Neither IAL Math nor IAS Further Math requirements met
      let message = "Missing required Pure Mathematics units (P1-P4) for IAL Mathematics and FP1 for IAS Further Mathematics";
      
      if (isEligibleForIAS) {
        message = "You are eligible for IAS Mathematics (XMA01) only. To qualify for dual qualifications, you need all Pure units (P1-P4) and FP1 plus additional units.";
      }
      
      setResult({
        eligible: false,
        message: message
      });
      return;
    }

    if (!hasFP1) {
      setResult({
        eligible: false,
        message: "FP1 is required for IAS Further Mathematics. You qualify for IAL Mathematics (YMA01) but not for the Further Mathematics component."
      });
      return;
    }

    // Need at least 2 more units beyond FP1
    const additionalUnitsNeeded = 2;
    const additionalUnitsAvailable = totalAppliedUnits;

    if (additionalUnitsAvailable < additionalUnitsNeeded) {
      setResult({
        eligible: false,
        message: `You need ${additionalUnitsNeeded} additional units beyond FP1 for IAS Further Mathematics. You currently have ${additionalUnitsAvailable}. You qualify for IAL Mathematics (YMA01) but need more units for Further Mathematics.`
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
      <h3 className="text-lg font-semibold text-[#4A1D7A] mb-3">Qualification Mode</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-md ${
            qualificationMode === 'standard'
              ? 'bg-[#4A1D7A] text-white'
              : 'bg-[#D1C4E9] text-[#111827] hover:bg-[#9B7FCB] hover:text-white'
          }`}
          onClick={() => setQualificationMode('standard')}
        >
          Standard Mathematics Eligibility
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            qualificationMode === 'dual'
              ? 'bg-[#4A1D7A] text-white'
              : 'bg-[#D1C4E9] text-[#111827] hover:bg-[#9B7FCB] hover:text-white'
          }`}
          onClick={() => setQualificationMode('dual')}
        >
          Dual Qualification Mode
        </button>
      </div>
      
      {qualificationMode === 'standard' ? (
        <div className="bg-[#E6F7FF] p-4 rounded-lg border-l-4 border-[#0369A1]">
          <p className="text-sm text-[#111827]">
            <strong>Standard Mode:</strong> Check eligibility for Mathematics (YMA01), Further Mathematics (YFM01), or IAS Further Mathematics qualifications. This mode now includes support for qualification combinations and transfer of credit options.
          </p>
        </div>
      ) : (
        <div className="bg-[#E6F7FF] p-4 rounded-lg border-l-4 border-[#0369A1]">
          <p className="text-sm text-[#111827]">
            <strong>Dual Qualification Mode:</strong> Check if you are eligible to obtain both Mathematics (YMA01) and Further Mathematics (YFM01) qualifications with the selected units. This mode helps properly allocate units between the two qualifications.
          </p>
        </div>
      )}
    </div>
  );

  const renderInfoBanner = () => (
    <div className="bg-[#ECFDF5] p-4 rounded-lg mb-6 border border-[#059669]">
      <h3 className="font-semibold text-[#111827]">Important Information About Unit Aggregation</h3>
      <p className="text-sm mt-1 text-[#111827]">
        When combining different qualifications (e.g., IAL Mathematics with IAS Further Mathematics), you must ensure proper unit aggregation. Units previously cashed in may need to be uncashed before being used in a new qualification.
      </p>
      <p className="text-sm mt-2 text-[#111827]">
        Please also make sure the candidate's UCI number and personal details are the same across all series to ensure proper unit aggregation.
      </p>
      <a 
        href="https://qualifications.pearson.com/content/dam/pdf/International%20Advanced%20Level/Mathematics/2018/Teaching-and-Learning-Materials/aggregation-rules-and-guidance.pdf" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-[#0369A1] hover:underline text-sm font-medium mt-2 inline-block"
      >
        View detailed aggregation guidance
      </a>
    </div>
  );

  const renderQualificationSelector = () => (
    <div className="mb-6">
      <button
        onClick={() => setShowQualOptions(!showQualOptions)}
        className="w-full flex items-center justify-between bg-[#9B7FCB] hover:bg-[#4A1D7A] text-white p-3 rounded-md cursor-pointer transition-colors"
      >
        <h3 className="font-medium">Additional Qualification Options</h3>
        <svg 
          className={`w-5 h-5 transition-transform ${showQualOptions ? 'transform rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {showQualOptions && (
        <div className="mt-3 border border-[#9B7FCB] rounded-md p-4 bg-white">
          <p className="mb-3 text-sm">Select the combination of qualifications you are aiming for:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div 
              className={`p-4 rounded-md cursor-pointer border ${
                selectedQualification === 'ial+ias' 
                  ? 'bg-[#ECFDF5] border-[#059669]' 
                  : 'bg-white border-gray-300 hover:bg-[#F3F4F6]'
              }`}
              onClick={() => setSelectedQualification('ial+ias')}
            >
              <h4 className="font-semibold">IAL Mathematics + IAS Further Mathematics</h4>
              <p className="text-sm text-gray-700">Full A Level Mathematics with AS Level Further Mathematics</p>
            </div>
            
            <div 
              className={`p-4 rounded-md cursor-pointer border ${
                selectedQualification === 'transfer' 
                  ? 'bg-[#ECFDF5] border-[#059669]' 
                  : 'bg-white border-gray-300 hover:bg-[#F3F4F6]'
              }`}
              onClick={() => setSelectedQualification('transfer')}
            >
              <h4 className="font-semibold">Transfer of Credit</h4>
              <p className="text-sm text-gray-700">Using qualifications from other exam boards</p>
            </div>
          </div>
          
          {selectedQualification === 'ial+ias' && (
            <div className="bg-[#FEF9C3] p-4 rounded-lg mt-4 border-l-4 border-[#CA8A04]">
              <h4 className="font-semibold text-[#111827]">Important Reminder for IAL + IAS Combinations</h4>
              <p className="text-sm mt-1 text-[#111827]">
                If you have previously cashed in IAS Mathematics or Further Mathematics, you must uncash these qualifications
                when cashing in the IAL options to allow reaggregation of units.
              </p>
              <p className="text-sm mt-2 text-[#111827]">
                Your examination officer can help with the uncashing process, which must be completed before the IAL qualification
                can be awarded.
              </p>
            </div>
          )}
          
          {selectedQualification === 'transfer' && (
            <div className="bg-[#E6F7FF] p-4 rounded-lg mt-4 border border-[#0369A1]">
              <h4 className="font-semibold text-[#111827]">Transfer of Credit Information</h4>
              <p className="text-sm mt-1 text-[#111827]">
                If you are cashing in Edexcel IAL Mathematics with units from another exam board, you'll need to follow the Transfer
                of Credit process.
              </p>
              <a 
                href="https://qualifications.pearson.com/en/support/support-topics/exams/special-requirements/transfer-of-credit.html" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm mt-2 text-[#0369A1] hover:underline inline-block"
              >
                Visit the Transfer of Credit page →
              </a>
              
              <h4 className="font-semibold mt-4 text-[#111827]">Transfer of Credit Key Points:</h4>
              <ul className="list-disc pl-5 text-sm mt-1 text-[#111827]">
                <li>You must apply for Transfer of Credit before the qualification can be awarded</li>
                <li>Applications must be made via your examination officer</li>
                <li>Evidence of the previously achieved qualification must be provided</li>
                <li>Check deadline dates carefully - applications must be received before results day</li>
              </ul>
            </div>
          )}
          
          {selectedQualification === 'ial+ias' && (
            <div className="mt-4">
              <h4 className="font-semibold text-[#111827]">IAL Mathematics + IAS Further Mathematics Requirements:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <h5 className="font-medium text-[#111827]">For IAL Mathematics:</h5>
                  <ul className="list-disc pl-5 text-sm text-[#111827]">
                    <li>P1, P2, P3, and P4</li>
                    <li>One valid pair from the applied units</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-[#111827]">For IAS Further Mathematics:</h5>
                  <ul className="list-disc pl-5 text-sm text-[#111827]">
                    <li>FP1 is required</li>
                    <li>Two more units (cannot include P1-P4)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderSection = (sectionKey, title, unitList) => (
    <div className="mb-6">
      <div 
        className="flex items-center justify-between bg-[#4A1D7A] p-3 rounded-t-md cursor-pointer"
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
        <div className="bg-white p-4 border border-[#9B7FCB] rounded-b-md shadow-inner grid grid-cols-2 md:grid-cols-3 gap-3">
          {unitList.map(unit => (
            <div 
              key={unit.code}
              className={`p-2 rounded-md cursor-pointer transition-colors ${
                selectedUnits.includes(unit.code)
                  ? 'bg-[#4A1D7A] text-white' 
                  : 'bg-[#D1C4E9] text-[#111827] hover:bg-[#9B7FCB] hover:text-white'
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
    <div className="bg-[#ECFDF5] p-4 rounded-lg mt-6 border border-[#059669]">
      <h3 className="font-semibold text-[#111827]">Additional Resources:</h3>
      <div className="mt-2">
        <a 
          href="https://qualifications.pearson.com/content/dam/pdf/International%20Advanced%20Level/Mathematics/2018/Teaching-and-Learning-Materials/aggregation-rules-and-guidance.pdf" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-[#0369A1] hover:underline mb-2"
        >
          <span className="mr-2">📄</span>
          IAL Mathematics Aggregation Rules and Guidance
        </a>
        <a 
          href="https://qualifications.pearson.com/en/qualifications/edexcel-international-advanced-levels/mathematics.html" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-[#0369A1] hover:underline mb-2"
        >
          <span className="mr-2">🔗</span>
          Edexcel IAL Mathematics Qualification Page
        </a>
        <a 
          href="https://qualifications.pearson.com/en/support/support-topics/exams/special-requirements/transfer-of-credit.html" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-[#0369A1] hover:underline"
        >
          <span className="mr-2">🔄</span>
          Transfer of Credit Information
        </a>
      </div>
    </div>
  );
  
  const renderStartOverButton = () => (
    <div className="mt-8 mb-4">
      <button 
        onClick={onStartOver}
        className="w-full bg-[#008F88] hover:bg-[#00B2A9] text-white font-medium py-3 px-4 rounded transition-colors duration-300 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
        Start Over
      </button>
      <p className="text-sm text-gray-700 text-center mt-2">
        Click <strong>Start Over</strong> to reset your unit selection and check different combinations.
      </p>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md relative">
      <h2 className="text-xl font-bold text-[#4A1D7A] mb-4">Mathematics Eligibility Calculator</h2>
      
      {/* Floating Selected Units Panel */}
      {selectedUnits.length > 0 && (
        <SelectedUnitsPanel selectedUnits={selectedUnits} />
      )}
      
      {renderInfoBanner()}
      {renderModeSelector()}
      {renderQualificationSelector()}
      
      {renderSection("pure", "Pure Mathematics", units.pure)}
      {renderSection("further", "Further Pure Mathematics", units.further)}
      {renderSection("applied", "Applied Mathematics", units.applied)}

      <div className="mt-6">
        <button 
          className="w-full py-3 bg-[#00B2A9] hover:bg-[#008F88] text-white font-bold rounded-md shadow-lg transition-colors border-2 border-[#4A1D7A]"
          onClick={checkIALEligibility}
        >
          Check Eligibility
        </button>
      </div>

      {renderAdditionalResources()}
      {renderStartOverButton()}
    </div>
  );
}

export default Calculator; 