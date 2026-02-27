import { motion, AnimatePresence } from "framer-motion";
import { useCookieConsent } from "../context/CookieConsentContext";
import { 
  Cookie, 
  X, 
  Shield, 
  ChevronRight, 
  Settings2,
  CheckCircle2,
  Info
} from "lucide-react";
import { useState } from "react";

export default function CookieBanner() {
  const { consent, acceptCookies, rejectCookies } = useCookieConsent();
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  });
  const [hoveredButton, setHoveredButton] = useState(null);

  if (consent !== null) return null;

  const handleAcceptAll = () => {
    acceptCookies();
    // Trigger smooth success feedback
    showToast("Preferences saved successfully");
  };

  const handleSavePreferences = () => {
    acceptCookies(preferences);
    showToast("Custom preferences saved");
  };

  const showToast = (message) => {
    // You can integrate with your toast system here
    console.log(message);
  };

  const cookieTypes = [
    {
      id: "necessary",
      title: "Necessary",
      description: "Essential for the website to function properly",
      required: true,
      icon: Shield
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "Helps us improve our website by collecting usage data",
      required: false,
      icon: Info
    },
    {
      id: "marketing",
      title: "Marketing",
      description: "Used to deliver personalized advertisements",
      required: false,
      icon: Cookie
    }
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.95 }}
        animate={{ 
          y: 0, 
          opacity: 1, 
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 25,
            mass: 0.8
          }
        }}
        exit={{ 
          y: 50, 
          opacity: 0, 
          scale: 0.95,
          transition: { duration: 0.3, ease: "easeInOut" }
        }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-title"
      >
        <div className="relative overflow-hidden rounded-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
          {/* Gradient accent line */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          />

          {/* Close button */}
          <motion.button
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={rejectCookies}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close cookie banner"
          >
            <X size={18} />
          </motion.button>

          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <motion.div 
                className="p-3 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30"
                animate={{ 
                  rotate: [0, -10, 10, 0],
                  transition: { repeat: Infinity, repeatDelay: 3, duration: 0.5 }
                }}
              >
                <Cookie className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <div className="flex-1">
                <h4 
                  id="cookie-title" 
                  className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                >
                  Your Privacy Matters
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  We value your privacy and want to be transparent about our data practices
                </p>
              </div>
            </div>

            {/* Main content */}
            <AnimatePresence mode="wait">
              {!showDetails ? (
                <motion.div
                  key="simple"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    We use cookies to enhance your browsing experience, serve personalized content, 
                    and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                  </p>

                  {/* Trust badges */}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                      <Shield size={12} />
                      GDPR Compliant
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                      <CheckCircle2 size={12} />
                      Data Encrypted
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onHoverStart={() => setHoveredButton('accept')}
                      onHoverEnd={() => setHoveredButton(null)}
                      onClick={handleAcceptAll}
                      className="relative flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-gray-900 font-semibold shadow-lg shadow-gray-900/20 dark:shadow-white/20 overflow-hidden group"
                    >
                      <motion.span 
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      <span className="relative flex items-center justify-center gap-2">
                        Accept All
                        <motion.span
                          animate={{ x: hoveredButton === 'accept' ? 4 : 0 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <ChevronRight size={18} />
                        </motion.span>
                      </span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowDetails(true)}
                      className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Settings2 size={18} />
                      Customize
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={rejectCookies}
                      className="px-6 py-3 rounded-xl text-gray-500 dark:text-gray-400 font-medium hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      Reject
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="detailed"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {/* Detailed preferences */}
                  <div className="space-y-3">
                    {cookieTypes.map((type, index) => (
                      <motion.div
                        key={type.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                            <type.icon size={18} className="text-gray-600 dark:text-gray-300" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-900 dark:text-white text-sm">
                              {type.title}
                              {type.required && (
                                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                                  Required
                                </span>
                              )}
                            </h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {type.description}
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences[type.id]}
                            disabled={type.required}
                            onChange={(e) => setPreferences(prev => ({
                              ...prev,
                              [type.id]: e.target.checked
                            }))}
                            className="sr-only peer"
                          />
                          <div className={`
                            w-11 h-6 rounded-full peer 
                            ${type.required ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-600 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800'}
                            peer-checked:after:translate-x-full peer-checked:after:border-white 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-white after:border-gray-300 after:border after:rounded-full 
                            after:h-5 after:w-5 after:transition-all
                            ${!type.required && 'peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500'}
                          `} />
                        </label>
                      </motion.div>
                    ))}
                  </div>

                  {/* Detailed actions */}
                  <div className="flex gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowDetails(false)}
                      className="px-4 py-2.5 rounded-xl text-gray-500 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSavePreferences}
                      className="flex-1 px-6 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold shadow-lg hover:shadow-xl transition-shadow"
                    >
                      Save Preferences
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer links */}
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
              <a href="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors underline-offset-2 hover:underline">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors underline-offset-2 hover:underline">
                Terms of Service
              </a>
              <a href="/cookies" className="hover:text-gray-900 dark:hover:text-white transition-colors underline-offset-2 hover:underline">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
