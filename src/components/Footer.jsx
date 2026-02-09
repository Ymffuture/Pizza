import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";
import gsap from "gsap";
import toast from "react-hot-toast";
import { SunIcon, CloudIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { 
  WiThermometer, 
  WiHumidity, 
  WiDaySunny, 
  WiCloudy 
} from "react-icons/wi";
import { FaMapMarkerAlt } from "react-icons/fa";

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

    // GSAP intro animation
    gsap.from(el, { opacity: 0, scale: 0.8, duration: 1, ease: "power3.out" });

    // Use cached weather if available
    if (cached && cachedDate === today) {
      const data = JSON.parse(cached);
      setWeather(data);
      setLoadingWeather(false);

      if (!localStorage.getItem("weatherToastShown")) {
        toast.success(`Today's weather: ${data.temp}°C · ${data.city}`, {
          style: { background: "#000", color: "#fff" },
        });
        localStorage.setItem("weatherToastShown", today);
      }
      return;
    }

    // Get geolocation
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=378c0d8b5246ceb52c1c6c6899b3446e&units=metric`
          );
          const data = await res.json();
          
const COUNTRY_NAMES = {
  ZA: { name: "South Africa", flag: "🇿🇦" },
  US: { name: "United States", flag: "🇺🇸" },
  GB: { name: "United Kingdom", flag: "🇬🇧" },
  CA: { name: "Canada", flag: "🇨🇦" },
  AU: { name: "Australia", flag: "🇦🇺" },
  IN: { name: "India", flag: "🇮🇳" },
  // Add more if needed
};
          
const countryData = COUNTRY_NAMES[data.sys.country] || {
  name: data.sys.country,
  flag: "",
};

  const weatherInfo = {
            
  temp: Math.round(data.main.temp),                 // °C
  feelsLike: Math.round(data.main.feels_like),      // Feels like temp
  min: Math.round(data.main.temp_min),              // Min temp
  max: Math.round(data.main.temp_max),              // Max temp

  city: data.name,
  country: countryData.name,
  countryFlag: countryData.flag,


  desc: data.weather[0].description,                // Clear sky, rain etc.
  icon: data.weather[0].icon,                       // Weather icon

  humidity: data.main.humidity,                     // %
  pressure: data.main.pressure,                     // hPa
  visibility: data.visibility / 1000,               // km

  windSpeed: data.wind.speed,                       // m/s
  windDeg: data.wind.deg,                           // Wind direction in degrees

  sunrise: data.sys.sunrise * 1000,                 // Converted to ms
  sunset: data.sys.sunset * 1000,                   // Converted to ms

  updatedAt: Date.now(),                            // Local timestamp
};


          setWeather(weatherInfo);
          setLoadingWeather(false);

          // Cache for today
          localStorage.setItem("footerWeather", JSON.stringify(weatherInfo));
          localStorage.setItem("footerWeatherDate", today);
          localStorage.setItem("weatherToastShown", today);

          toast.custom((t) => (
  <div
    className={`${
      t.visible ? "animate-custom-enter" : "animate-custom-leave"
    } max-w-md w-full bg-white dark:bg-[#111] rounded-xl pointer-events-auto flex dark:ring-white/10 dark:text-black `}
  >
    {/* LEFT SIDE */}
    <div className="flex-1 w-0 p-4">
      <div className="flex items-start gap-3">

        {/* USER AVATAR */}
        <img
          className="h-16 w-16 rounded-full object-cover"
          src={`https://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png`}
          alt="weather icon"
        />

        {/* TEXT */}
        <div
  className="
    flex-1
    rounded-xl
    p-4
    
    Dark:text-white text-black 
  "
>
  {/* Title */}
  <p className="text-sm font-semibold bg-white tracking-wide text-gray-500 dark:text-white uppercase">
    Weather Update
  </p>

  {/* Location */}
  <div className="mt-3 flex items-center gap-2 text-sm text-gray-300">
    <FaMapMarkerAlt className="text-red-500" />
    <span className="truncate">
      {weatherInfo.city}, {weatherInfo.country}
    </span>
  </div>

  {/* Stats */}
  <div className="mt-4 space-y-2 text-sm">
    <div className="flex items-center gap-2 text-gray-200">
      <WiThermometer className="text-2xl text-red-500" />
      <span>
        Temperature:
        <b className="ml-1">
          {weatherInfo.temp}°C
        </b>
      </span>
    </div>

    <div className="flex items-center gap-2 text-gray-200">
      <WiThermometer className="text-2xl text-green-500" />
      <span>
        Feels like:
        <b className="ml-1 tect-[#202124]">
          {weatherInfo.feelsLike}°C
        </b>
      </span>
    </div>

    <div className="flex items-center gap-2 text-gray-200">
      <WiCloudy className="text-2xl text-blue-400" />
      <span>
        Condition:
        <b className="ml-1 text-white capitalize">
          {weatherInfo.desc}
        </b>
      </span>
    </div>
  </div>
</div>

      </div>
    </div>

    {/* RIGHT CLOSE BUTTON */}
    <div className="flex border-l border-gray-200 dark:border-white/10">
      <button
        onClick={() => toast.dismiss(t.id)}
        className="w-full p-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 focus:outline-none"
      >
        Close
      </button>
    </div>
  </div>
), 
                       { duration: Infinity }
 
                      
                      );


        } catch (err) {
          console.error(err);
          setLoadingWeather(false);
          toast.error("Weather fetch failed", {
            style: { background: "#000", color: "#fff" },
          });
        }
      },
      () => {
        setLoadingWeather(false);
        toast.error("Location access denied", {
          style: { background: "#FF0000", color: "#fff" },
        });
      }
    );
  }, []);
  
const StarBackground = () => (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <style>{`@keyframes moveStars {from { transform: translate3d(0,0,0);} to { transform: translate3d(-600px,-300px,0);} }`}</style>
      <div style={{ position: 'absolute', width: '200%', height: '200%', backgroundImage: 'radial-gradient(rgba(9, 97, 248, 0.9) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)', backgroundSize: '490px 160px, 80px 90px', opacity: 0.3, animation: 'moveStars 150s linear infinite' }} />
      <div style={{ position: 'absolute', width: '200%', height: '200%', backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '140px 140px', opacity: 0.2, animation: 'moveStars 220s linear infinite' }} />
    </div>
  );
  return (
    <footer className="bg-white dark:bg-[#0B0F14] text-gray-900 dark:text-gray-300 transition-colors duration-300 relative">
  
<StarBackground/>

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
              href="https://github.com/Ymffuture"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition"
            >
              <FaGithub />
            </a>
            <a
              href="https://x.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
            >
              <FaXTwitter />
            </a>
            {/*
            <a
              href="https://www.linkedin.com/in/kgomotsonkosi-l"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition"
            >
              <FaLinkedinIn />
            </a>
            */} 
          </div>
        </div>

        {/* Company Links */}
        <div>
  <h3 className="text-lg font-semibold mb-4">Company</h3>

  <ul className="space-y-2 text-sm">
    <li>
      <Link
        to="/about"
        className="hover:text-blue-500 transition"
      >
        About Us
      </Link>
    </li>

    <li>
      <Link
        to="/dashboard/blog"
        className="hover:text-blue-500 transition"
      >
        Blog Articles
      </Link>
    </li>

    <li>
      <Link
        to="/contact"
        className="hover:text-blue-500 transition"
      >
        Contact Support
      </Link>
    </li>

    <li>
      <Link
        to="/weather"
        className="hover:text-blue-500 transition"
      >
        Weather Tool
      </Link>
    </li>

    {/* Admin – intentionally subtle */}
    <li>
      <Link
        to="/admin-only"
        className="text-gray-500 hover:text-blue-500 transition"
      >
        Admin Access
      </Link>
    </li>

    <li>
      <Link
        to="/news"
        className="text-gray-500 hover:text-blue-500 transition"
      >
        News
      </Link>
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

        {/* WEATHER WIDGET 
        <div
          id="weatherBox"
          className="text-center flex flex-col items-center justify-center"
        >
          <h3 className="text-lg font-semibold text-gray-600">Today's Weather</h3>

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
  
  <div className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
    
    <span>{weather.temp}°C</span>
  </div>

  
  <div className="flex items-center gap-2 capitalize text-gray-600 dark:text-gray-400">
    <CloudIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
    <span>{weather.desc}</span>
  </div>

  
  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
    <MapPinIcon className="w-5 h-5 text-red-500" />
    <span>{weather.city}</span>
  </div>
                
</div>

            </motion.div>
          )}
        </div>
        */} 
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-200 dark:border-gray-700 text-center py-6 text-sm text-gray-500">
        © 2025 - {new Date().getFullYear()} SwiftMeta (Pty) Ltd — Incorporation in Progress
 | All rights reserved. 
        <br/>
        <br/>
        <span className="text-gray-600 text-sm" >{weather?.countryFlag} {weather?.country || ""} · {weather?.city}</span>

      </div>
    </footer>
  );
};

export default Footer;
