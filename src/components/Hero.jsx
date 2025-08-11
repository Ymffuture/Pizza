import React from "react";
import { FaLeaf } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { GiFoodTruck } from "react-icons/gi";
import { BsCartCheckFill } from "react-icons/bs";
import img from "../assets/img/Hero.jpg";

const Hero = () => {
  return (
    <section className="bg-white dark:bg-black text-black dark:text-white min-h-screen flex flex-col-reverse lg:flex-row items-center justify-center md:justify-between px-5 lg:px-14 gap-8 pt-5 md:pt-0 transition-colors duration-300">
      {/* Left Content */}
      <div className="lg:w-1/2 w-full text-center lg:text-left">
        <div className="inline-flex items-center mb-4 text-orange-400 font-medium justify-center lg:justify-start">
          <FaLeaf className="mr-2" /> People trust us
        </div>

        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Most <span className="text-orange-500">Fastest</span> Food
          <br /> <span className="text-orange-500">Delivery</span> Service
        </h1>

        <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0">
          Discover nearby restaurants or get your favorite foods delivered fast. Happy foodie life!
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-6 max-w-xl mx-auto lg:mx-0">
          {/* Google Map iframe */}
          <div className="w-full sm:w-[320px] h-[200px] rounded-xl overflow-hidden shadow-lg border border-gray-300 dark:border-gray-700">
            <iframe
              title="Johannesburg Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.998137989097!2d28.0312113150718!3d-26.20410298345654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e956247a3a8a231%3A0x23efcde7e76f80d3!2sJohannesburg%2C%20South%20Africa!5e0!3m2!1sen!2sza!4v1689764567890!5m2!1sen!2sza"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <button className="bg-orange-500 hover:bg-orange-600 transition text-white font-semibold rounded-full px-6 py-3 w-full sm:w-auto">
            Find Foods
          </button>
        </div>
      </div>

      {/* Right Content */}
      <div className="lg:w-1/2 w-full relative flex justify-center mb-10 lg:mb-0">
        <div className="relative">
          <img
            src={img}
            alt="Delivery Guy"
            className="rounded-full w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] object-cover"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-8 right-0 md:right-10 bg-white text-black text-sm px-3 py-1 rounded-full flex items-center shadow-lg">
          <GiFoodTruck className="text-orange-500 mr-2" /> Quality Food
        </div>

        <div className="absolute bottom-10 left-0 md:left-12 bg-white text-black text-sm px-3 py-1 rounded-full flex items-center shadow-lg">
          <BsCartCheckFill className="text-green-500 mr-2" /> Easy to Order
        </div>

        <div className="absolute bottom-6 right-0 md:right-10 bg-white text-black text-sm px-3 py-1 rounded-full flex items-center shadow-lg">
          <MdDeliveryDining className="text-blue-500 mr-2" /> Fastest Delivery
        </div>
      </div>
    </section>
  );
};

export default Hero;

