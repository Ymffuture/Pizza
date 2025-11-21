import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  // --- WEATHER FETCHING LOGIC ---
  useEffect(() => {
    const cached = localStorage.getItem("footerWeather");
    const cachedDate = localStorage.getItem("footerWeatherDate");
    const today = new Date().toDateString();

    // use cached weather for 24 hrs
    if (cached && cachedDate === today) {
      setWeather(JSON.parse(cached));
      setLoadingWeather(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${
  "13d787b766f8f5cfc1d56aab4a8a9fc5" 
            }&units=metric`
          );

          const data = await res.json();
          const weatherInfo = {
            temp: Math.round(data.main.temp),
            icon: data.weather[0].icon,
            city: data.name,
            desc: data.weather[0].description,
          };

          setWeather(weatherInfo);
          setLoadingWeather(false);

          // save for 24h
          localStorage.setItem("footerWeather", JSON.stringify(weatherInfo));
          localStorage.setItem("footerWeatherDate", today);
        } catch (error) {
          console.error("Weather fetch failed:", error);
          setLoadingWeather(false);
        }
      },
      () => {
        setLoadingWeather(false);
      }
    );
  }, []);

  return (
    <footer className="bg-white dark:bg-[#0A0A0D] text-gray-900 dark:text-gray-300 transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-20 grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-2xl mb-4">
            <span className="text-blue-500">Swift</span>
            <span className="text-gray-900 dark:text-white">Meta</span>
          </h2>

          <p className="text-gray-700 dark:text-gray-400">
            Building modern, responsive websites that elevate your brand
            and engage your audience. Design meets technology for a seamless
            digital presence.
          </p>

          <div className="flex gap-4 mt-6 text-gray-700 dark:text-gray-400">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"
              className="hover:text-blue-500 transition">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"
              className="hover:text-pink-500 transition">
              <FaInstagram />
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer"
              className="hover:text-blue-400 transition">
              <FaXTwitter />
            </a>
            <a href="https://www.linkedin.com/in/kgomotsonkosi-l" target="_blank"
              rel="noopener noreferrer" className="hover:text-blue-600 transition">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-blue-500 transition">About Us</Link></li>
            <li><Link to="/Small-projects" className="hover:text-blue-500 transition">Small Projects</Link></li>
            <li><Link to="/large-projects" className="hover:text-blue-500 transition">Large Projects</Link></li>
            <li><Link to="/weather" className="hover:text-blue-500 transition">Weather</Link></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            <li><Link to="/faq" className="hover:text-blue-500 transition">FAQs</Link></li>
            <li><Link to="/help" className="hover:text-blue-500 transition">Help Center</Link></li>
            <li><Link to="/policy" className="hover:text-blue-500 transition">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-blue-500 transition">Terms of Service</Link></li>
          </ul>
        </div>

        {/* WEATHER WIDGET */}
        <div className="text-center flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-4">Today's Weather</h3>

          {loadingWeather ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
          ) : weather ? (
            <div className="flex flex-col items-center gap-2">
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt="Weather Icon"
                className="w-16 h-16"
              />
              <p className="text-2xl font-bold">{weather.temp}°C</p>
              <p className="capitalize text-gray-600 dark:text-gray-400">{weather.desc}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{weather.city}</p>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Weather unavailable
            </p>
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
