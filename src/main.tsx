import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import FileUploader from './client/Pages/FileUploader';
import DownloadPage from './client/Pages/DownloadPage';
import App from './App';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
 
      <Routes>
        <Route path="/" element = {<App/>}/>
        <Route path="/" element={<FileUploader />} />
        <Route path="/download/:filename" element={<DownloadPage />} />
      </Routes>
      
    </BrowserRouter>

  </React.StrictMode>
);