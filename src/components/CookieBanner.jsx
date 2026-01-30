import { motion, AnimatePresence } from "framer-motion";
import { useCookieConsent } from "../context/CookieConsentContext";

export default function CookieBanner() {
  const { consent, acceptCookies, rejectCookies } = useCookieConsent();

  if (consent !== null) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 z-50 rounded-xl bg-black text-white p-5 shadow-xl md:left-auto md:right-4 md:max-w-md"
        role="dialog"
        aria-live="polite"
      >
        <h4 className="text-lg font-semibold mb-2">🍪 Cookie settings</h4>

        <p className="text-sm text-gray-300 mb-4">
          We use cookies to improve your experience, analyze traffic, and
          personalize content. You can accept or reject non-essential cookies.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={rejectCookies}
            className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600"
          >
            Reject
          </button>

          <button
            onClick={acceptCookies}
            className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-500"
          >
            Accept
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
