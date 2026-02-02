import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBook, FiCheckCircle, FiCopy, FiPrinter, FiArrowLeft } from "react-icons/fi";

const SUBJECT_PRICES = {
  mathematics: 320,
  mathLit: 280,
  physics: 320,
  lifeScience: 250,
};

const SUBJECT_LABELS = {
  mathematics: "Mathematics",
  mathLit: "Mathematical Literacy",
  physics: "Physics",
  lifeScience: "Life Sciences",
};

const LOGO_URL = "/apple-touch-icon.png"; // <-- replace with your real logo path
const APPLY_LINK = "/apply";  // <-- change to your real route

const calculatePrice = (selected) => {
  const subtotal = selected.reduce(
    (sum, subject) => sum + SUBJECT_PRICES[subject],
    0
  );

  const discount = selected.length > 1 ? subtotal * 0.03 : 0;
  const total = subtotal - discount;

  return { subtotal, discount, total };
};

export default function SubjectsPricingPage() {
  const [selected, setSelected] = useState([]);

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

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = async () => {
    const lines = [
      "📚 School Subjects Quote",
      "",
      "Subjects Selected:",
      ...selected.map(
        (s) => `- ${SUBJECT_LABELS[s]}: R${SUBJECT_PRICES[s]}`
      ),
      "",
      `Subtotal: R${subtotal.toFixed(2)}`,
      `Discount: -R${discount.toFixed(2)}`,
      `Total: R${total.toFixed(2)}`,
      "",
      `Apply here: ${window.location.origin}${APPLY_LINK}`,
    ];

    await navigator.clipboard.writeText(lines.join("\n"));
    alert("Copied to clipboard!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 dark:text-gray-900/10 space-y-6 text-gray-900 dark:text-gray-100">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">School Subjects Pricing</h1>

        <a
          href={APPLY_LINK}
          className="flex items-center gap-2 text-blue-500 hover:underline print:hidden"
        >
          <FiArrowLeft /> Back to Apply
        </a>
      </div>

      {/* SUBJECT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(SUBJECT_PRICES).map((key) => (
          <motion.div
            key={key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleSubject(key)}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              selected.includes(key)
                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-400"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiBook />
                <span className="font-medium">
                  {SUBJECT_LABELS[key]}
                </span>
              </div>
              {selected.includes(key) && (
                <FiCheckCircle className="text-blue-600" />
              )}
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              R {SUBJECT_PRICES[key]}
            </p>
          </motion.div>
        ))}
      </div>

      {/* PRICE SUMMARY (ON SCREEN) */}
      <motion.div
        layout
        className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2 print:hidden"
      >
        <motion.p layout>
          Subtotal: <strong>R {subtotal.toFixed(2)}</strong>
        </motion.p>

        <AnimatePresence>
          {selected.length > 1 && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-green-600"
            >
              Discount (3%): - R {discount.toFixed(2)}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.p layout className="text-lg font-semibold">
          Total: R {total.toFixed(2)}
        </motion.p>
      </motion.div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 print:hidden">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700"
        >
          <FiCopy /> Copy Details
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white"
        >
          <FiPrinter /> Print Quote
        </button>
      </div>

      {/* PRINTABLE RECEIPT (HIDDEN ON SCREEN, VISIBLE IN PRINT) */}
      <div className="hidden print:block print:p-6 print:text-black">
        <div className="flex items-center gap-4 border-b pb-4 mb-4">
          <img src={LOGO_URL} alt="logo" className="h-10" />
          <h2 className="text-xl font-semibold">Subject Quote</h2>
        </div>

        <p className="mb-2">Subjects Selected:</p>
        <ul className="mb-4 list-disc pl-5">
          {selected.map((s) => (
            <li key={s}>
              {SUBJECT_LABELS[s]} — R {SUBJECT_PRICES[s]}
            </li>
          ))}
        </ul>

        <p>Subtotal: R {subtotal.toFixed(2)}</p>
        <p>Discount: - R {discount.toFixed(2)}</p>
        <p className="font-semibold">Total: R {total.toFixed(2)}</p>

        <p className="mt-4">
          Apply here: {window.location.origin}
          {APPLY_LINK}
        </p>
      </div>
    </div>
  );
}
