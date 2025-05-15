import React, { useState } from 'react';
import Calculator from './components/Calculator';
import './App.css';

function App() {
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [result, setResult] = useState(null);
  const [expandStates, setExpandStates] = useState({
    pure: false,
    further: false,
    applied: false
  });

  const resetApp = () => {
    setSelectedUnits([]);
    setResult(null);
    setExpandStates({
      pure: false,
      further: false,
      applied: false
    });
  };

  return (
    <div className="App">
      <header className="bg-[#5F259F] text-white py-4 mb-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">IAL Maths Calculator</h1>
            <div className="flex items-center">
              <img 
                src="/pearson-logo.png" 
                alt="Pearson Logo" 
                className="h-8" 
              />
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 pb-8">
        {result && (
          <div className={`mb-6 p-4 rounded-lg ${result.eligible ? 'bg-[#B2E0E5]' : 'bg-[#FFF9C4]'}`}>
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
        
        <Calculator 
          selectedUnits={selectedUnits} 
          setSelectedUnits={setSelectedUnits} 
          result={result}
          setResult={setResult}
          expandStates={expandStates}
          setExpandStates={setExpandStates}
          onStartOver={resetApp}
        />
      </div>
      
      <footer className="bg-[#333] text-white py-3 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} IAL Mathematics Calculator | Powered by Pearson Edexcel</p>
        </div>
      </footer>
    </div>
  );
}

export default App; 