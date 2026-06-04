import React from 'react';
import { createRoot } from 'react-dom/client';
import { AcademicModule } from './AcademicModule';
import './index.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Required root element with id "root" not found');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <AcademicModule />
  </React.StrictMode>
);
