//src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';

// Detectar subdominio
const subdomain = window.location.hostname.split('.')[0];

// Cargar la app correspondiente
let AppEntry;
switch (subdomain) {
  case 'admin':
    AppEntry = require('./apps/admin/index.jsx').default;
    break;
  case 'auth':
    AppEntry = require('./apps/auth/index.jsx').default;
    break;
  case 'www':
  case 'mlpadigital':
  case '':
    AppEntry = require('./apps/public/index.jsx').default;
    break;
  default:
    AppEntry = () => <div>Subdominio no reconocido: {subdomain}</div>;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppEntry />
  </React.StrictMode>
);