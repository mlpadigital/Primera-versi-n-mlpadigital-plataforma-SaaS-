//src/apps/public/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../shared/context/AuthProvider';

import HomePage from './pages/HomePage';
import PublicStorePage from './pages/PublicStorePage';
import ProductDetailPage from './pages/ProductDetailPage';
import StorePage from './pages/StorePage';
import SuccessPage from './pages/SuccessPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/store/:slug" element={<PublicStorePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
); 