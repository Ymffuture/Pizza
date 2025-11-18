import React from "react";

const MenuCard = ({ name, price, tag, image }) => {
  return (
    <div className="group bg-white dark:bg-[#24232F] shadow-md dark:shadow-none hover:shadow-xl rounded-2xl overflow-hidden transition-shadow duration-300 cursor-pointer">
      {/* Image */}
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {tag && (
          <span className="absolute top-3 left-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            {tag}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-blue-500 transition-colors duration-300">
          {name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 font-bold text-md sm:text-lg group-hover:text-gray-200 transition-colors duration-300">
          {price}
        </p>

        {/* Optional action buttons (like Facebook) */}
        <div className="flex justify-between items-center mt-4">
          <button className="text-blue-500 hover:underline text-sm font-medium">
            Email Us
          </button>
          <button className="text-gray-500 dark:text-gray-400 hover:text-blue-500 text-sm font-medium">
            Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
