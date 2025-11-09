import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../shared/context/AuthProvider';
import AuthPage from './pages/AuthPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);