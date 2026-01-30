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
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 max-w-lg w-[95%] bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl shadow-xl p-6 flex flex-col gap-4"
        role="dialog"
        aria-live="polite"
      >
        <h4 className="text-lg font-semibold">🍪 Cookies & Privacy</h4>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          We use cookies to enhance your experience, analyze traffic, and provide
          personalized content. You can choose to accept or reject non-essential cookies.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={rejectCookies}
            className="px-5 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Reject
          </button>

          <button
            onClick={acceptCookies}
            className="px-5 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition font-semibold"
          >
            Accept
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
