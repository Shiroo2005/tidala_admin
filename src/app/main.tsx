import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@shared/styles/index.css";
import App from "./App.tsx";
import { queryClient } from "@/config/react-query/queryClient.ts";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
);
