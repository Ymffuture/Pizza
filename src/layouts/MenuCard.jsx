import React from "react";

const MenuCard = ({ name, price, tag, image }) => {
  return (
    <div className="group bg-gray-100 dark:bg-[#1F1D2B] p-6 rounded-2xl hover:bg-orange-500 dark:hover:bg-orange-500 transition-all duration-300">
      <div className="relative mb-4">
        <img src={image} alt={name} className="mx-auto" />
        {tag && (
          <span className="absolute -top-3.5 -left-4 bg-orange-500 text-white group-hover:bg-black text-xs px-2 py-1 rounded-md">
            {tag}
          </span>
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors duration-300">
        {name}
      </h3>
      <p className="text-lg font-bold text-orange-500 group-hover:text-white transition-colors duration-300">
        {price}
      </p>
    </div>
  );
};

export default MenuCard;
