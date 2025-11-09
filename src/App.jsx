// src/App.jsx
import React from 'react';
import { AuthProvider } from './shared/context/AuthProvider';
// import { ToastProvider } from './shared/context/ToastProvider'; // opcional
// import { ThemeProvider } from './shared/context/ThemeProvider'; // opcional

const App = ({ children }) => {
  return (
    <AuthProvider>
      {/* <ToastProvider> */}
      {/* <ThemeProvider> */}
      {children}
      {/* </ThemeProvider> */}
      {/* </ToastProvider> */}
    </AuthProvider>
  );
};

export default App;