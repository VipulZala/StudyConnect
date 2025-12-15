// src/main.jsx (or index.js) — add this as the first lines
if (typeof global === 'undefined') {
  // make Node-style global available in the browser
  window.global = window;
}


import React from 'react';
import './index.css';
import { render } from 'react-dom';
import { App } from './App';
render(<App />, document.getElementById('root'));