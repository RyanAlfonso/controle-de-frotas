import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import './index.css'; // If we add a global CSS file in src

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
