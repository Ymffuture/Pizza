import { createContext, useContext, useEffect, useState } from "react";

const CookieConsentContext = createContext(null);

export const CookieConsentProvider = ({ children }) => {
  const [consent, setConsent] = useState(null); 
  // null | "accepted" | "rejected"

  useEffect(() => {
    const saved = localStorage.getItem("cookie_consent");
    if (saved) setConsent(saved);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setConsent("accepted");
  };

  const rejectCookies = () => {
    localStorage.setItem("cookie_consent", "rejected");
    setConsent("rejected");
  };

  return (
    <CookieConsentContext.Provider
      value={{ consent, acceptCookies, rejectCookies }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent must be used inside CookieConsentProvider");
  }
  return ctx;
};
