import React, { useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";

const MenuCard = ({ name, price, tag, image, description }) => {
  const [open, setOpen] = useState(false);

  const openWhatsApp = () => {
    const message = `Hello! I'm interested in buying *${name}* for *${price}*.`;
    const url = `https://wa.me/27634414863?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      {/* CARD */}
      <div className="group bg-white dark:bg-[#fff] shadow-md dark:shadow-none hover:shadow-xl rounded-2xl overflow-hidden transition-shadow duration-300 cursor-pointer">
        {/* Image */}
        <div className="relative">
          <img
            src={image}
            alt={name}
            className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {tag && (
            <span className="absolute top-3 left-3 bg-red-200 text-white px-3 py-1 rounded-full text-xs font-medium">
              {tag}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-700 mb-1 group-hover:text-blue-500 transition-colors duration-300">
            {name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 font-bold text-md sm:text-lg transition-colors duration-300">
            {price}
          </p>

          {/* Buttons */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setOpen(true)}
              className="text-blue-600 hover:underline text-[24px] font-medium p-2"
            >
              <IoInformationCircleOutline />
            </button>

            <button
              onClick={openWhatsApp}
              className="text-gray-700 dark:text-gray-600 hover:text-blue-600 text-sm font-medium border p-2 rounded-lg"
            >
              Buy
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-black rounded-2xl shadow-xl max-w-md w-full p-6 animate-fadeIn">
            {/* Title */}
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              {name}
            </h2>

            {/* Image */}
            <img
              src={image}
              alt={name}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />

            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
              {description || "Detailed information about this product will appear here."}
            </p>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Close
              </button>

              <button
                onClick={openWhatsApp}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuCard;
