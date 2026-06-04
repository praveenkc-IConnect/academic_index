import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // <-- Removed the curly braces
import './index.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Required root element with id "root" not found');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
