import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {  createBrowserRouter, RouterProvider } from 'react-router-dom';
import  Play from './pages/Play.js'
//import HowToPlay from './pages/HowToPlay.js';
//import Pixelated from './components/pixelated/pixelated.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/play',
    element: <Play />
  }
]);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <footer>
      <p>Game by Johnie J. Karr <br />
      Dedicated to my wife, Amy</p>
    </footer>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
