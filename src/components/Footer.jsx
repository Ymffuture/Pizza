import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";
import gsap from "gsap";
import toast from "react-hot-toast";
import { SunIcon, CloudIcon, MapPinIcon } from "@heroicons/react/24/outline";

// SVG Loader
const LoadingSVG = () => (
  <svg width="36" height="36" viewBox="0 0 50 50" className="animate-spin">
    <circle
      cx="25"
      cy="25"
      r="20"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
      className="text-blue-500 dark:text-blue-300"
    />
  </svg>
);

// SVG Error
const ErrorSVG = () => (
  <svg width="40" height="40" viewBox="0 0 24 24">
    <path
      fill="red"
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 
      10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
    />
  </svg>
);

const Footer = () => {
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

useEffect(() => {
  const cached = localStorage.getItem("footerWeather");
  const cachedDate = localStorage.getItem("footerWeatherDate");
  const today = new Date().toDateString();

  const el = document.querySelector("#weatherBox");
  gsap.from(el, { opacity: 0, scale: 0.8, duration: 1, ease: "power3.out" });

  if (cached && cachedDate === today) {
    setWeather(JSON.parse(cached));
    setLoadingWeather(false);
    return;
  }

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;

    try {
      // 1. fetch hourly forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=YOUR_API_KEY&units=metric`
      );
      const f = await forecastRes.json();

      // 2. detect heavy rain within today's hours
      const now = Math.floor(Date.now() / 1000);
      const endOfToday = new Date().setHours(23, 59, 59) / 1000;

      const heavy = f.hourly?.find(
        (h) =>
          h.dt >= now &&
          h.dt <= endOfToday &&
          h.rain?.["1h"] >= 7 // heavy rain threshold (mm)
      );

      const info = {
        temp: Math.round(f.current.temp),
        icon: f.current.weather[0].icon,
        city: f.timezone.split("/")[1], // fallback if name missing
        desc: f.current.weather[0].description,
        warning: heavy ? "heavy rain" : null,
      };

      setWeather(info);
      setLoadingWeather(false);
      localStorage.setItem("footerWeather", JSON.stringify(info));
      localStorage.setItem("footerWeatherDate", today);

      if (heavy) {
        toast.success("Expect heavy rain today ☔", { 
          style: { background: "#202124", color: "#fff" } 
        });
      }
    } catch (err) {
      console.error(err);
      setLoadingWeather(false);
      toast.error("Weather fetch failed", {
        style: { background: "#202124", color: "#fff" },
      });
    }
  });
}, []);


  return (
    <footer className="bg-white dark:bg-[#0A0A0D] text-gray-900 dark:text-gray-300 transition-colors duration-300 relative">
      

      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-20 grid md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h2 className="text-2xl mb-4">
            <span className="text-blue-500">Swift</span>
            <span className="text-gray-900 dark:text-white">Meta</span>
          </h2>

          <p className="text-gray-700 dark:text-gray-400">
            Building modern, responsive websites that elevate your brand and
            engage your audience. Design meets technology for a seamless
            digital presence.
          </p>

          <div className="flex gap-4 mt-6 text-gray-700 dark:text-gray-400">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
            >
              <FaXTwitter />
            </a>
            <a
              href="https://www.linkedin.com/in/kgomotsonkosi-l"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/about" className="hover:text-blue-500 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/Small-projects" className="hover:text-blue-500 transition">
                Small Projects
              </Link>
            </li>
            <li>
              <Link to="/large-projects" className="hover:text-blue-500 transition">
                Large Projects
              </Link>
            </li>
            <li>
              Weather update :
              {weather.warning === "heavy rain" && (
  <div className="mt-2 px-3 py-1 text-sm rounded-full bg-[#202124] text-white">
    
<Umbrella size={18} className="inline mr-1" /> 
 Heavy rain expected today
  </div>
)}

            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/faq" className="hover:text-blue-500 transition">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="/help" className="hover:text-blue-500 transition">
                Help Center
              </Link>
            </li>
            <li>
              <Link to="/policy" className="hover:text-blue-500 transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-blue-500 transition">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* WEATHER WIDGET */}
        <div
          id="weatherBox"
          className="text-center flex flex-col items-center justify-center"
        >
          <h3 className="text-lg font-semibold mb-4">Today's Weather</h3>

          {loadingWeather ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 dark:text-gray-400 text-sm"
            >
              <LoadingSVG />
            </motion.div>
          ) : !weather ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <ErrorSVG />
              <p className="text-red-500 dark:text-red-400 mt-2">
                Weather unavailable
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                className="w-16 h-16"
                alt="Weather icon"
              />
              <div className="flex flex-col items-center gap-2">
  {/* Temperature */}
  <div className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
    {/*  <SunIcon className="w-6 h-6 text-yellow-400" />*/} 
    <span>{weather.temp}°C</span>
  </div>

  {/* Description */}
  <div className="flex items-center gap-2 capitalize text-gray-600 dark:text-gray-400">
    <CloudIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
    <span>{weather.desc}</span>
  </div>

  {/* City */}
  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
    <MapPinIcon className="w-5 h-5 text-red-500" />
    <span>{weather.city}</span>
  </div>
</div>

            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-200 dark:border-gray-700 text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} SwiftMeta | All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
