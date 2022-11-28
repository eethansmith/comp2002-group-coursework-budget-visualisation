import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import RingChart from './components/ringchart.js';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RingChart data={[12, 13 ,4, 6]} height="200" width="200" />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
