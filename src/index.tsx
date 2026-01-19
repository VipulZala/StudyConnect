// src/main.jsx (or index.js) — add this as the first lines
if (typeof global === 'undefined') {
  // make Node-style global available in the browser
  window.global = window;
}


import React from 'react';
import './index.css';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);