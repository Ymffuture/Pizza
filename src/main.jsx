import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CookieConsentProvider } from "./context/CookieConsentContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CookieConsentProvider>
      <App />
    </CookieConsentProvider>
  </StrictMode>,
)
