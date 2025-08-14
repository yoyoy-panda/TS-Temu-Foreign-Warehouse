import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import './App.css'; // Keep existing CSS if any

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        {/* You can add other routes here if needed in the future */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
