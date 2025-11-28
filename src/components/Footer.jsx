import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";
import gsap from "gsap";
import toast from "react-hot-toast";
import { CloudIcon, MapPinIcon } from "@heroicons/react/24/outline";

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

  // Compute severity without re-computing unless weather changes
  const severity = useMemo(() => {
    if (!weather) return null;
    return weather.severity;
  }, [weather]);

  useEffect(() => {
    const cached = localStorage.getItem("footerWeather");
    const cachedDate = localStorage.getItem("footerWeatherDate");
    const today = new Date().toDateString();

    const el = document.querySelector("#weatherBox");
    if (el) {
      gsap.from(el, { opacity: 0, scale: 0.8, duration: 1, ease: "power3.out" });
    }

    // Use cached data for the current day
    if (cached && cachedDate === today) {
      setWeather(JSON.parse(cached));
      setLoadingWeather(false);
      showToastIfNeeded(JSON.parse(cached));
      return;
    }

    // Fetch weather based on user location
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=378c0d8b5246ceb52c1c6c6899b3446e&units=metric`
          );
          const data = await res.json();

          const derivedSeverity = computeSeverity(data);

          const weatherInfo = {
            temp: Math.round(data.main.temp),
            icon: data.weather[0].icon,
            city: data.name,
            desc: data.weather[0].description,
            main: data.weather[0].main,
            rain1h: data.rain?.["1h"] ?? 0,
            severity: derivedSeverity,
          };

          setWeather(weatherInfo);
          setLoadingWeather(false);
          localStorage.setItem("footerWeather", JSON.stringify(weatherInfo));
          localStorage.setItem("footerWeatherDate", today);
          showToastIfNeeded(weatherInfo);
        } catch (err) {
          console.error(err);
          setLoadingWeather(false);
          toast.error("Weather fetch failed", { style: darkToastStyle });
        }
      },
      () => {
        setLoadingWeather(false);
        toast.error("Location access denied", { style: darkToastStyle });
      }
    );
  }, []);

  function showToastIfNeeded(weatherInfo) {
    const shownDate = localStorage.getItem("weatherToastShown");
    const today = new Date().toDateString();
    if (shownDate === today) return;

    toast.success(
      `Weather: ${weatherInfo.temp}°C · ${weatherInfo.city} (${weatherInfo.severity})`,
      { style: darkToastStyle }
    );
    localStorage.setItem("weatherToastShown", today);
  }

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
            <a href="#" className="hover:text-blue-500 transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-pink-500 transition"><FaInstagram /></a>
            <a href="#" className="hover:text-blue-400 transition"><FaXTwitter /></a>
            <a href="#" className="hover:text-blue-600 transition"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-blue-500">About Us</Link></li>
            <li><Link to="/Small-projects" className="hover:text-blue-500">Small Projects</Link></li>
            <li><Link to="/large-projects" className="hover:text-blue-500">Large Projects</Link></li>
            <li><Link to="/weather" className="hover:text-blue-500">Weather</Link></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            <li><Link to="/faq" className="hover:text-blue-500">FAQs</Link></li>
            <li><Link to="/help" className="hover:text-blue-500">Help Center</Link></li>
            <li><Link to="/policy" className="hover:text-blue-500">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-blue-500">Terms of Service</Link></li>
          </ul>
        </div>

        {/* WEATHER WIDGET */}
        <div id="weatherBox" className="text-center flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-4">Today's Weather</h3>

          {loadingWeather ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <LoadingSVG />
            </motion.div>
          ) : !weather ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
              <ErrorSVG />
              <p className="text-red-500 mt-2">Weather unavailable</p>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-2">
              <img
                src={`https://api.openweathermap.org/img/wn/${weather.icon}@2x.png`}
                className="w-16 h-16"
                alt="weather icon"
              />

              {/* Temperature */}
              <div className="text-2xl font-bold">{weather.temp}°C</div>

              {/* Severity Badge */}
              {severity && (
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-3 py-1 text-sm rounded-full border border-gray-300 dark:border-gray-600"
                >
                  {severity}
                </motion.span>
              )}

              {/* Description */}
              <div className="flex items-center gap-1 capitalize text-gray-600 dark:text-gray-400">
                <CloudIcon className="w-5 h-5" />
                {weather.desc}
              </div>

              {/* City */}
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPinIcon className="w-5 h-5 text-red-500" />
                {weather.city}
              </div>
            </motion.div>
          )}
        </div>  

      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} SwiftMeta | All rights reserved
      </div>
    </footer>
  );
};

// Severity interpreter
function computeSeverity(apiData) {
  const main = apiData.weather[0].main;
  const desc = apiData.weather[0].description.toLowerCase();
  const rain = apiData.rain?.["1h"] ?? 0;

  if (main === "Thunderstorm") return "⛈ Thunderstorms";
  if (main === "Rain") {
    if (rain > 7 || desc.includes("heavy")) return "🌧 Heavy Rain";
    if (rain >= 2 && rain <= 7 || desc.includes("moderate")) return "🌦 Moderate Rain";
    return "☔ Light Rain";
  }
  if (main === "Clear") return "☀ Sunny";
  if (main === "Clouds") return "☁ Cloudy";
  if (main === "Drizzle") return "🌦 Drizzle";

  return "🌡 Normal";
}

const darkToastStyle = { background: "#000", color: "#fff" };

export default Footer;
