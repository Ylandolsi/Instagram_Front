import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRoutes from "./Routes";
import { AuthProvider } from "./contexts/authContext";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
  // </StrictMode>
);
