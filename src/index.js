import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { VideoProvider } from './context/VideoContext';
import { ThumbnailProvider } from './context/ThumbnailContext';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <VideoProvider>
        <ThumbnailProvider>
          <App />
        </ThumbnailProvider>
      </VideoProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
