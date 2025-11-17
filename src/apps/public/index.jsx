import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "../shared/context/AuthProvider";

import HomePage from "./pages/HomePage";
import PublicStorePage from "./pages/PublicStorePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import StorePage from "./pages/StorePage";
import SuccessPage from "./pages/SuccessPage";

const PublicApp = () => (
  <AuthProvider>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/store" element={<StorePage />} />
      <Route path="/store/:slug" element={<PublicStorePage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
    </Routes>
  </AuthProvider>
);

export default PublicApp;