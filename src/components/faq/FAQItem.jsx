import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { useState } from "react";

export default function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
        aria-expanded={open}
      >
        <span className="font-medium">{question}</span>
        <FiChevronDown
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="px-4 pb-4 text-gray-600 dark:text-gray-300"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
