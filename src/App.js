import React, { useState } from 'react';
import Calculator from './components/Calculator';
import ResultPanel from './components/ResultPanel';
import './App.css';

// Base64 encoded Pearson logo (white version)
const pearsonLogoBase64 = "data:image/png;base64,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";

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
                src={pearsonLogoBase64} 
                alt="Pearson Logo" 
                className="h-8" 
              />
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 pb-8">
        <ResultPanel result={result} />
        
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