import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CookieConsentProvider } from "./context/CookieConsentContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      
    
    <CookieConsentProvider>
      <App />
    </CookieConsentProvider>
      </QueryClientProvider>
  </StrictMode>,
)
