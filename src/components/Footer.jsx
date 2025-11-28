import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";
import gsap from "gsap";
import toast from "react-hot-toast";
import { SunIcon, CloudIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { Umbrella, Loader2, AlertTriangle } from "lucide-react"; // ✅ added imports

// SVG Loader
const LoadingSVG = () => (
  <div className="flex justify-center py-6">
    <Loader2 size={30} className="animate-spin text-gray-500 dark:text-gray-400" />
  </div>
);

// SVG Error
const ErrorSVG = () => (
  <div className="flex flex-col items-center py-6">
    <AlertTriangle size={36} className="text-red-500 dark:text-red-400" />
    <p className="text-red-500 dark:text-red-400 mt-2 text-sm">
      Weather unavailable
    </p>
  </div>
);

const Footer = () => {
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem("footerWeather");
    const cachedDate = localStorage.getItem("footerWeatherDate");
    const today = new Date().toDateString();

    const el = document.querySelector("#weatherBox");
    if (el) {
      gsap.fromTo(el, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1, ease: "power3.out" });
    }

    if (cached && cachedDate === today) {
      setWeather(JSON.parse(cached));
      setLoadingWeather(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=378c0d8b5246ceb52c1c6c6899b3446e&units=metric`
        );
        const f = await forecastRes.json();

        const now = Math.floor(Date.now() / 1000);
        const endOfToday = new Date().setHours(23, 59, 59) / 1000;

        const upcomingToday = f.hourly?.filter(h => h.dt >= now && h.dt <= endOfToday);

        let rainLevel = null;
        const found = upcomingToday?.find(h => h.rain?.["1h"] >= 5);

        if (found) {
          const mm = found.rain?.["1h"];
          if (mm > 10) rainLevel = "extreme";
          else if (mm >= 7 && mm <= 10) rainLevel = "heavy";
          else if (mm >= 5) rainLevel = "moderate";
        }

        const weatherInfo = {
          temp: Math.round(f.current?.main?.temp ?? f.current?.temp ?? 0),
          icon: f.current?.weather?.[0]?.icon ?? "01d",
          city: f.timezone ? f.timezone.split("/")[1].replace("_", " ") : "Unknown",
          desc: f.current?.weather?.[0]?.description ?? "clear",
          rain: rainLevel,
        };

        setWeather(weatherInfo);
        setLoadingWeather(false);
        localStorage.setItem("footerWeather", JSON.stringify(weatherInfo));
        localStorage.setItem("footerWeatherDate", today);

        if (rainLevel) {
          toast.success(`Rain Alert: ${rainLevel.toUpperCase()} 🌧️`, {
            style: { background: "#202124", color: "#fff" },
          });
        }
      } catch (err) {
        console.error(err);
        setLoadingWeather(false);
        toast.error("Weather fetch failed", {
          style: { background: "#202124", color: "#fff" },
        });
      }
    }, () => {
      setLoadingWeather(false);
      toast.error("Location access denied", {
        style: { background: "#202124", color: "#fff" },
      });
    });
  }, []);

  return (
    <footer className="bg-white dark:bg-[#0A0A0D] text-gray-900 dark:text-gray-300 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-20 grid md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl mb-4 font-bold">
            <span className="text-blue-500">Swift</span>
            <span className="text-gray-900 dark:text-white">Meta</span>
          </h2>

          <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed">
            Building modern, responsive web experiences powered by clean design and solid engineering.
          </p>

          <div className="flex gap-4 mt-6 text-gray-700 dark:text-gray-400 text-lg justify-start">
            <a className="hover:text-blue-500 transition"><FaFacebookF /></a>
            <a className="hover:text-pink-500 transition"><FaInstagram /></a>
            <a className="hover:text-blue-400 transition"><FaXTwitter /></a>
            <a className="hover:text-blue-600 transition"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* COMPANY LINKS */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-blue-500 transition">About Us</Link></li>
            <li><Link to="/small-projects" className="hover:text-blue-500 transition">Small Projects</Link></li>
            <li><Link to="/large-projects" className="hover:text-blue-500 transition">Large Projects</Link></li>

            {/* ✅ Rain forecast badge */}
            {weather?.rain && (
              <li className="pt-3">
                <div className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-[#202124] text-white">
                  <Umbrella size={14} />
                  {weather.rain === "extreme" && "Extreme rain expected today"}
                  {weather.rain === "heavy" && "Heavy rain expected today"}
                  {weather.rain === "moderate" && "Moderate rain possible today"}
                </div>
              </li>
            )}
          </ul>
        </div>

        {/* SUPPORT LINKS */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/faq" className="hover:text-blue-500 transition">FAQs</Link></li>
            <li><Link to="/help" className="hover:text-blue-500 transition">Help Center</Link></li>
            <li><Link to="/policy" className="hover:text-blue-500 transition">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-blue-500 transition">Terms of Service</Link></li>
          </ul>
        </div>

        {/* WEATHER WIDGET */}
        <div id="weatherBox" className="text-center flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-4">Today's Weather</h3>

          {loadingWeather ? (
            <LoadingSVG />
          ) : !weather ? (
            <ErrorSVG />
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-2">
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                className="w-16 h-16"
                alt="Weather icon"
              />

              <div className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                <SunIcon className="w-6 h-6 opacity-70" />
                <span>{weather.temp}°C</span>
              </div>

              <div className="flex items-center gap-1 capitalize text-gray-600 dark:text-gray-400 text-sm">
                <CloudIcon className="w-5 h-5 opacity-60" />
                <span>{weather.desc}</span>
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <MapPinIcon className="w-4 h-4 opacity-70" />
                <span>{weather.city}</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-200 dark:border-gray-700 text-center py-6 text-xs text-gray-500">
        © {new Date().getFullYear()} SwiftMeta | All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
