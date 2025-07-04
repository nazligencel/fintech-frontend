import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* App bileşenini AuthProvider ile sarmala */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
