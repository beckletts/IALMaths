import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactGA from 'react-ga4';
import './App.css';
import App from './App';

// Initialize Google Analytics
ReactGA.initialize('G-3EZWTF5RL1');

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 