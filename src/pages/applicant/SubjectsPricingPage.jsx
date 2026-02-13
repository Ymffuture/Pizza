import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBook,
  FiCheckCircle,
  FiCopy,
  FiPrinter,
  FiArrowLeft,
  FiSearch,
  FiChevronDown,
} from "react-icons/fi";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";

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
  },
  mathLit: {
    label: "Mathematical Literacy",
    description: "Practical maths for real-world financial and daily use.",
  },
  physics: {
    label: "Physics",
    description: "Mechanics, electricity, waves & problem-solving mastery.",
  },
  lifeScience: {
    label: "Life Sciences",
    description: "Biology, genetics, ecology & scientific reasoning.",
  },
};

const LOGO_URL = "/apple-touch-icon.png";
const APPLY_LINK = "/apply";

/* -------------------------
   30% PRICE INCREASE LOGIC
-------------------------- */
const getAdjustedPrice = (base) => {
  const now = new Date();
  const juneEnd = new Date(now.getFullYear(), 5, 30); // June 30

  if (now > juneEnd) {
    return base * 1.3; // 30% increase
  }

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

  const shareText = `📚 SwiftMeta Quote
Subjects: ${selected.map((s) => SUBJECT_INFO[s].label).join(", ")}
Total: R ${total.toFixed(2)}
Apply here: ${window.location.origin}${APPLY_LINK}`;

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`);
  };

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}${APPLY_LINK}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-black pt-20">
      <div className="max-w-4xl mx-auto p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Subjects & Pricing
          </h1>

          <a
            href={APPLY_LINK}
            className="flex items-center gap-2 text-blue-500 hover:underline"
          >
            <FiArrowLeft /> Apply
          </a>
        </div>

        {/* PRICE NOTICE */}
        <div className="text-sm text-red-500 font-medium">
          ⚠ Prices increase by 30% after June 30.
        </div>

        {/* SUBJECT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Object.keys(BASE_PRICES).map((key) => {
            const adjusted = getAdjustedPrice(BASE_PRICES[key]);
            const isSelected = selected.includes(key);

            return (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02 }}
                className={`relative p-5 rounded-2xl border backdrop-blur-xl cursor-pointer transition-all duration-300
                ${
                  isSelected
                    ? "border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                    : "border-gray-200 dark:border-gray-700"
                }`}
                onClick={() => toggleSubject(key)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FiBook />
                    <span className="font-medium">
                      {SUBJECT_INFO[key].label}
                    </span>
                  </div>
                  {isSelected && (
                    <FiCheckCircle className="text-blue-600" />
                  )}
                </div>

                {/* Apple Style Dropdown */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdown(openDropdown === key ? null : key);
                  }}
                  className="flex items-center gap-1 text-sm text-gray-500 mt-2"
                >
                  Details <FiChevronDown />
                </button>

                <AnimatePresence>
                  {openDropdown === key && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden text-sm text-gray-600 dark:text-gray-400 mt-2"
                    >
                      {SUBJECT_INFO[key].description}
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="mt-3 font-semibold">
                  R {adjusted.toFixed(2)}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* SUMMARY */}
        <motion.div
          layout
          className="p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl backdrop-blur-xl shadow-xl"
        >
          <p>Subtotal: <strong>R {subtotal.toFixed(2)}</strong></p>
          {selected.length > 1 && (
            <p className="text-green-600">
              Discount (2%): - R {discount.toFixed(2)}
            </p>
          )}
          <p className="text-xl font-semibold mt-2">
            Total: R {total.toFixed(2)}
          </p>
        </motion.div>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigator.clipboard.writeText(shareText)}
            className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700"
          >
            <FiCopy /> Copy
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="px-4 py-2 rounded-xl bg-green-500 text-white flex items-center gap-2"
          >
            <FaWhatsapp /> WhatsApp
          </button>

          <button
            onClick={handleShareFacebook}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white flex items-center gap-2"
          >
            <FaFacebook /> Facebook
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-black text-white"
          >
            <FiPrinter /> Print
          </button>
        </div>
      </div>
    </div>
  );
}
