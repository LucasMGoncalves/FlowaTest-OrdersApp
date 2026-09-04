import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import App from "./App";

if (import.meta.env.DEV && import.meta.env.VITE_DEV_JWT) {
  localStorage.setItem(
    "access_token",
    import.meta.env.VITE_DEV_JWT
  );
}

createRoot(
  document.getElementById("root")!
).render(
  <StrictMode>
    <App />
  </StrictMode>
);