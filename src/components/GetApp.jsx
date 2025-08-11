import React from "react";
import img from "../assets/img/order.png";

const GetApp = () => {
  return (
    <section className=" dark:bg-black py-10 transition-colors duration-300">
      <div className=" bg-orange-100 dark:bg-[#1F1D2B] py-16 px-6 lg:px-20 rounded-3xl mx-4 lg:mx-16">
        <div className="grid md:grid-cols-2 items-center gap-10">
          {/* Left Text */}
          <div>
            <h4 className="text-orange-500 font-semibold uppercase mb-2">
              Our Application
            </h4>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple Way To Order Your Food
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Discover food wherever and whenever and get your food delivered
              quickly.
            </p>
            <button className="bg-orange-500 text-white font-medium px-6 py-3 rounded-full shadow hover:bg-orange-600 transition">
              Get the app
            </button>
          </div>

          {/* Right Image */}
          <div className="flex justify-center">
            <img
              src={img}
              alt="App Preview"
              className="w-[280px] md:w-[320px] drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetApp;
