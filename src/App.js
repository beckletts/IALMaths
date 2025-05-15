import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Calculator from './components/Calculator';
import './App.css';

function App() {
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [result, setResult] = useState(null);
  const [expandStates, setExpandStates] = useState({
    pure: true,
    further: true,
    applied: true
  });

  const resetApp = () => {
    setSelectedUnits([]);
    setResult(null);
    setExpandStates({
      pure: true,
      further: true,
      applied: true
    });
  };

  return (
    <div className="App">
      <header className="bg-[#5F259F] text-white py-4 mb-4">
        <h1 className="text-2xl font-bold text-center">IAL Maths Calculator</h1>
      </header>
      
      <div className="container mx-auto px-4">
        <Dashboard 
          selectedUnits={selectedUnits} 
          result={result} 
          onStartOver={resetApp}
        />
        
        <Calculator 
          selectedUnits={selectedUnits} 
          setSelectedUnits={setSelectedUnits} 
          result={result}
          setResult={setResult}
          expandStates={expandStates}
          setExpandStates={setExpandStates}
        />
      </div>
    </div>
  );
}

export default App; 