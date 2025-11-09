import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../shared/context/AuthProvider';
import DashboardPage from './pages/DashboardPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);