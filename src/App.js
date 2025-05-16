import React, { useState, useEffect } from 'react';
import ReactGA from 'react-ga4';
import Calculator from './components/Calculator';
import ResultPanel from './components/ResultPanel';
import './App.css';

function App() {
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [result, setResult] = useState(null);
  const [expandStates, setExpandStates] = useState({
    pure: false,
    further: false,
    applied: false
  });

  // Track page view when component mounts
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  const resetApp = () => {
    // Track reset event
    ReactGA.event({
      category: 'User',
      action: 'Reset Calculator',
    });
    
    setSelectedUnits([]);
    setResult(null);
    setExpandStates({
      pure: false,
      further: false,
      applied: false
    });
  };

  // Function to handle unit selection with tracking
  const handleUnitSelection = (units) => {
    ReactGA.event({
      category: 'Calculator',
      action: 'Select Units',
      label: JSON.stringify(units)
    });
    setSelectedUnits(units);
  };

  return (
    <div className="App">
      <header className="bg-[#4A1D7A] text-white py-4 mb-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <img 
              src="/img/PEARSON_LOGO_WHITE_RGB.svg" 
              alt="Pearson Logo" 
              className="h-8" 
            />
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 pb-8">
        <ResultPanel result={result} />
        
        <Calculator 
          selectedUnits={selectedUnits} 
          setSelectedUnits={handleUnitSelection}
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