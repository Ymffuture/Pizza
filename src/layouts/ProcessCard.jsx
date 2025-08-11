import React from "react";

const ProcessCard = ({ img, title, desc }) => {
  return (
    <div className="bg-gray-50 dark:bg-[#1F1D2B] p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="w-full h-36 flex items-center justify-center overflow-hidden mb-4">
        <img src={img} alt={title} className="w-44 h-44 object-contain" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{desc}</p>
    </div>
  );
};

export default ProcessCard;
