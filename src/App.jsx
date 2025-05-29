// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout.jsx'; 

function App() {
  return (
    <Router>
      <MainLayout /> {/* Tüm navigasyon ve route mantığı artık MainLayout içinde */}
    </Router>
  );
}

export default App;