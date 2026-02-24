import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBook,
  FiCheckCircle,
  FiCopy,
  FiPrinter,
  FiArrowLeft,
  FiChevronDown,
  FiClock,
  FiCalendar,
  FiInfo,
  FiCheck,
  FiX,
  FiShare2,
  FiDownload
} from "react-icons/fi";
import { FaWhatsapp, FaFacebook, FaTwitter } from "react-icons/fa";
import { Tooltip, Badge, message, Divider } from "antd";

const BASE_PRICES = {
  mathematics: 350,
  mathLit: 320,
  physics: 350,
  lifeScience: 300,
};

const SUBJECT_INFO = {
  mathematics: {
    label: "Mathematics",
    description: "Advanced algebra, calculus, trigonometry & exam preparation.",
    color: "from-blue-500 to-cyan-400",
    icon: "📐",
  },
  mathLit: {
    label: "Mathematical Literacy",
    description: "Practical maths for real-world financial and daily use.",
    color: "from-green-500 to-emerald-400",
    icon: "🧮",
  },
  physics: {
    label: "Physics",
    description: "Mechanics, electricity, waves & problem-solving mastery.",
    color: "from-purple-500 to-violet-400",
    icon: "⚛️",
  },
  lifeScience: {
    label: "Life Sciences",
    description: "Biology, genetics, ecology & scientific reasoning.",
    color: "from-rose-500 to-pink-400",
    icon: "🧬",
  },
};

const APPLY_LINK = "/apply";
const LOGO_URL = "https://swiftmeta.vercel.app/new.jpeg";

/* 30% PRICE INCREASE AFTER JUNE 30 */
const getAdjustedPrice = (base) => {
  const now = new Date();
  const juneEnd = new Date(now.getFullYear(), 5, 30);
  if (now > juneEnd) return base * 1.3;
  return base;
};

const calculatePrice = (selected) => {
  const subtotal = selected.reduce(
    (sum, subject) => sum + getAdjustedPrice(BASE_PRICES[subject]),
    0
  );
  const discount = selected.length > 1 ? subtotal * 0.02 : 0;
  const total = subtotal - discount;
  return { subtotal, discount, total };
};

export default function SubjectsPricingPage() {
  const [selected, setSelected] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [copiedSection, setCopiedSection] = useState(null);

  const toggleSubject = (key) => {
    setSelected((prev) =>
      prev.includes(key)
        ? prev.filter((s) => s !== key)
        : [...prev, key]
    );
  };

  const { subtotal, discount, total } = useMemo(
    () => calculatePrice(selected),
    [selected]
  );

  const handleCopy = async (text, section) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      message.success("Copied to clipboard!");
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      message.error("Failed to copy");
    }
  };

  const generateQuoteText = () => {
    const subjectsList = selected.map((s) => 
      `• ${SUBJECT_INFO[s].label}: R ${getAdjustedPrice(BASE_PRICES[s]).toFixed(2)}`
    ).join('\n');
    
    return `SWIFTMETA TUITION QUOTE
━━━━━━━━━━━━━━━━━━━━━

📚 SELECTED SUBJECTS:
${subjectsList}

💰 PRICING BREAKDOWN:
Subtotal: R ${subtotal.toFixed(2)}
${selected.length > 1 ? `Multi-subject Discount (2%): -R ${discount.toFixed(2)}` : ''}
TOTAL: R ${total.toFixed(2)}

⏰ TIME COMMITMENT:
• 90 minutes per session
• 2-3 sessions per week
• Flexible scheduling available

📅 VALIDITY:
Quote valid until ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}

🔗 APPLY: ${typeof window !== 'undefined' ? window.location.origin : ''}${APPLY_LINK}

Contact us to secure your spot!`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = (platform) => {
    const text = `SwiftMeta Tuition Quote\nTotal: R ${total.toFixed(2)}\nSubjects: ${selected.length}\nApply now!`;
    const url = typeof window !== 'undefined' ? window.location.origin + APPLY_LINK : '';
    
    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
    }
  };

  const isDeadlineNear = () => {
    const now = new Date();
    const juneEnd = new Date(now.getFullYear(), 5, 30);
    const daysUntil = Math.ceil((juneEnd - now) / (1000 * 60 * 60 * 24));
    return daysUntil > 0 && daysUntil <= 30;
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] pt-20 pb-12 print:bg-white print:text-black print:pt-0 font-sans">
      
      <style>{`
        @media print {
          body { margin: 0; -webkit-print-color-adjust: exact; }
          .no-print { display: none !important; }
          .print-container { width: 100%; max-width: 100%; padding: 40px; }
          .print-shadow { box-shadow: none !important; border: 1px solid #e5e7eb !important; }
        }
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 print-container">
        
        {/* Header with Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 no-print"
        >
          <div className="flex items-center gap-4">
            <img 
              src={LOGO_URL} 
              alt="SwiftMeta" 
              className="w-12 h-12 rounded-xl object-cover shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Tuition <span className="gradient-text">Pricing</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Select your subjects and get an instant quote
              </p>
            </div>
          </div>

          <a
            href={APPLY_LINK}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all font-medium"
          >
            <FiArrowLeft size={18} />
            Back to Application
          </a>
        </motion.div>

        {/* Urgency Banner */}
        {isDeadlineNear() && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 no-print"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">⏰</span>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                  Price Increase Coming Soon
                </h3>
                <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                  Prices will increase by <strong>30%</strong> after June 30th. 
                  Lock in current rates by applying now.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Subject Selection */}
          <div className="lg:col-span-2 space-y-6 no-print">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FiBook className="text-blue-500" />
                Select Subjects
              </h2>
              <Badge count={selected.length} style={{ backgroundColor: '#3b82f6' }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(BASE_PRICES).map((key) => {
                const adjusted = getAdjustedPrice(BASE_PRICES[key]);
                const isSelected = selected.includes(key);
                const info = SUBJECT_INFO[key];

                return (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleSubject(key)}
                    className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden group ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/10"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    {/* Selection Indicator */}
                    <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300 dark:border-gray-600"
                    }`}>
                      {isSelected && <FiCheck className="text-white text-sm" />}
                    </div>

                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center text-2xl shadow-lg`}>
                        {info.icon}
                      </div>
                      
                      <div className="flex-1 pr-8">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {info.label}
                        </h3>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(openDropdown === key ? null : key);
                          }}
                          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 mt-1 transition-colors"
                        >
                          View details 
                          <motion.span
                            animate={{ rotate: openDropdown === key ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FiChevronDown size={14} />
                          </motion.span>
                        </button>

                        <AnimatePresence>
                          {openDropdown === key && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed"
                            >
                              {info.description}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="mt-4 flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            R {adjusted.toFixed(0)}
                          </span>
                          <span className="text-sm text-gray-500">/month</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Time Commitment Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  <FiClock className="text-indigo-500 text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                    Time Commitment
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span><strong>90 minutes</strong> per session</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span><strong>2-3 days</strong> per week</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <div className="w-2 h-2 rounded-full bg-pink-500" />
                      <span>Flexible scheduling</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Quote Summary */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {selected.length > 0 ? (
                <motion.div
                  key="quote"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="sticky top-24 space-y-4"
                >
                  {/* Quote Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden print-shadow">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 p-6 text-white">
                      <div className="flex items-center gap-3 mb-4">
                        <img src={LOGO_URL} alt="SwiftMeta" className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <h3 className="font-bold text-lg">Tuition Quote</h3>
                          <p className="text-gray-400 text-xs">Valid for 7 days</p>
                        </div>
                      </div>
                      <div className="text-3xl font-bold">
                        R {total.toFixed(2)}
                        <span className="text-base font-normal text-gray-400 ml-1">/month</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6 space-y-4">
                      {selected.map((subject) => (
                        <div key={subject} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{SUBJECT_INFO[subject].icon}</span>
                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                              {SUBJECT_INFO[subject].label}
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            R {getAdjustedPrice(BASE_PRICES[subject]).toFixed(2)}
                          </span>
                        </div>
                      ))}

                      <Divider className="my-4" />

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>Subtotal</span>
                          <span>R {subtotal.toFixed(2)}</span>
                        </div>
                        {selected.length > 1 && (
                          <div className="flex justify-between text-green-600 dark:text-green-400">
                            <span>Bundle Discount (2%)</span>
                            <span>-R {discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                          <span>Total</span>
                          <span>R {total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Time Summary in Quote */}
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <FiClock size={14} />
                          <span>90 min × {selected.length * 2}-{selected.length * 3} sessions/week</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <FiCalendar size={14} />
                          <span>Flexible timing available</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 no-print">
                    <Tooltip title="Copy quote details">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCopy(generateQuoteText(), 'quote')}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                          copiedSection === 'quote'
                            ? "bg-green-500 text-white"
                            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {copiedSection === 'quote' ? <FiCheck /> : <FiCopy />}
                        {copiedSection === 'quote' ? "Copied!" : "Copy"}
                      </motion.button>
                    </Tooltip>

                    <Tooltip title="Print quote">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePrint}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
                      >
                        <FiPrinter />
                        Print
                      </motion.button>
                    </Tooltip>
                  </div>

                  {/* Share Options */}
                  <div className="flex justify-center gap-4 no-print">
                    <Tooltip title="Share on WhatsApp">
                      <button
                        onClick={() => handleShare('whatsapp')}
                        className="p-3 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30"
                      >
                        <FaWhatsapp size={20} />
                      </button>
                    </Tooltip>
                    <Tooltip title="Share on Facebook">
                      <button
                        onClick={() => handleShare('facebook')}
                        className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
                      >
                        <FaFacebook size={20} />
                      </button>
                    </Tooltip>
                    <Tooltip title="Share on Twitter">
                      <button
                        onClick={() => handleShare('twitter')}
                        className="p-3 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/30"
                      >
                        <FaTwitter size={20} />
                      </button>
                    </Tooltip>
                  </div>

                  {/* CTA */}
                  <motion.a
                    href={APPLY_LINK}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="block w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-center shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all no-print"
                  >
                    Proceed to Application →
                  </motion.a>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="sticky top-24 p-8 rounded-3xl bg-gray-100 dark:bg-gray-800/50 border-2 border-dashed border-gray-300 dark:border-gray-700 text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <FiBook className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-gray-900 dark:text-white font-semibold mb-2">
                    No subjects selected
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Click on subjects to see your personalized quote
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Important Info Section - Printable */}
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 print-shadow"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Important Information
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Please review before applying
                </p>
              </div>
              <div className="flex gap-2 no-print">
                <Tooltip title="Copy important info">
                  <button
                    onClick={() => handleCopy(`TIME COMMITMENT:
• 90 minutes per session
• 2-3 sessions per week maximum
• Flexible scheduling available

PRICING:
• Prices increase 30% after June 30
• 2% discount for multiple subjects
• Monthly billing`, 'info')}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FiCopy size={20} />
                  </button>
                </Tooltip>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FiClock className="text-blue-500" />
                  Session Details
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                    <span><strong>90 minutes</strong> per session - optimized for focus and retention</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                    <span><strong>2 to 3 days</strong> per week maximum - allows time for practice</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                    <span>Flexible scheduling - choose times that work for you</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FiInfo className="text-purple-500" />
                  Pricing Notes
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                    <span>Save <strong>2%</strong> when enrolling in multiple subjects</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1">⚠</span>
                    <span>Prices increase by <strong>30%</strong> after June 30th - apply early!</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                    <span>Monthly billing with secure payment options</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>SwiftMeta Tuition Services • Quote generated on {new Date().toLocaleDateString()}</p>
              <p className="mt-1">Questions? Contact us at support@swiftmeta.com</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
