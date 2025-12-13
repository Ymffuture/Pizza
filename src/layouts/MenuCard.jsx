import React, { useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FaCoffee } from "react-icons/fa";

const BUY_ME_A_COFFEE_URL = "https://www.buymeacoffee.com/ymffuture";

const MenuCard = ({ name, price, tag, image, description }) => {
  const [infoOpen, setInfoOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);

  const openPayment = () => {
    window.open(BUY_ME_A_COFFEE_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* CARD */}
      <div className="group bg-white dark:bg-white shadow-md hover:shadow-xl rounded-2xl overflow-hidden transition-all cursor-pointer">
        {/* Image */}
        <div className="relative">
          <img
            src={image}
            alt={name}
            className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {tag && (
            <span className="absolute top-3 left-3 bg-red-400 text-white px-3 py-1 rounded-full text-xs font-medium">
              {tag}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition">
            {name}
          </h3>

          <p className="text-gray-700 font-bold text-md sm:text-lg">
            {price}
          </p>

          {/* Actions */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setInfoOpen(true)}
              className="text-blue-600 text-[24px] p-2 hover:scale-110 transition"
              aria-label="More information"
            >
              <IoInformationCircleOutline />
            </button>

            <button
              onClick={() => setPayOpen(true)}
              className="flex items-center gap-2 text-sm font-medium border px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <FaCoffee />
              Buy
            </button>
          </div>
        </div>
      </div>

      {/* INFO MODAL */}
      {infoOpen && (
        <Modal onClose={() => setInfoOpen(false)} title={`About ${name}`}>
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover rounded-xl mb-4"
          />
          <p className="text-gray-700 leading-relaxed">
            {description ||
              "Detailed information about this product will appear here."}
          </p>
        </Modal>
      )}

      {/* PAYMENT MODAL */}
      {payOpen && (
        <Modal onClose={() => setPayOpen(false)} title="Support with a Coffee">
          <div className="text-center space-y-4">
            <FaCoffee className="mx-auto text-4xl text-amber-600" />

            <p className="text-gray-700">
              You're purchasing <strong>{name}</strong> for{" "}
              <strong>{price}</strong>.
            </p>

            <p className="text-sm text-gray-500">
              Payments are securely handled by Stripes.
            </p>

            <button
              onClick={openPayment}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold transition"
            >
              Continue your payment
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

/* ----------------------------------
   Reusable Modal Component
---------------------------------- */

const Modal = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fadeIn">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {title}
        </h2>

        {children}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
