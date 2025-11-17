import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "./apps/shared/components/ErrorBoundary.jsx";
import App from "./App.jsx";

const hostname = window.location.hostname;
let subdomain = hostname.split(".")[0];

// Simular subdominio en desarrollo local
if (hostname === "localhost") {
  const devSubdomain = import.meta.env.VITE_DEV_SUBDOMAIN || "public";
  subdomain = devSubdomain;
}

const loadApp = async () => {
  let AppEntry;

  try {
    switch (subdomain) {
      case "admin":
        AppEntry = (await import("./apps/admin/index.jsx")).default;
        break;
      case "auth":
        AppEntry = (await import("./apps/auth/index.jsx")).default;
        break;
      case "app":
        AppEntry = (await import("./apps/app/index.jsx")).default;
        break;
      case "public":
      case "www":
        AppEntry = (await import("./apps/public/index.jsx")).default;
        break;
      default:
        AppEntry = () => <div>Subdominio no reconocido: {subdomain}</div>;
    }

    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <BrowserRouter>
          <ErrorBoundary>
            <AppEntry />
            <App />
          </ErrorBoundary>
        </BrowserRouter>
      </React.StrictMode>
    );
  } catch (err) {
    console.error("❌ Error al cargar la app:", err);
    ReactDOM.createRoot(document.getElementById("root")).render(
      <div className="p-6 text-red-500">
        <h2>⚠️ Error al cargar la aplicación</h2>
        <pre>{err.message}</pre>
      </div>
    );
  }
};

loadApp();