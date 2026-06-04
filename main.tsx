import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App'; // <-- Added curly braces here
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
