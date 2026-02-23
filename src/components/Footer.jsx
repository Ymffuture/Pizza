import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import gsap from "gsap";
import { api } from "../api";
import toast from "react-hot-toast";
import { WiThermometer, WiCloudy } from "react-icons/wi";
import { FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
  const el = document.querySelector("#weatherBox");
  if (el) {
    gsap.from(el, { opacity: 0, scale: 0.9, duration: 0.8 });
  }

  const cached = localStorage.getItem("footerWeather");
  const cachedDate = localStorage.getItem("footerWeatherDate");
  const today = new Date().toDateString();

  if (cached && cachedDate === today) {
    setWeather(JSON.parse(cached));
    setLoadingWeather(false);
    return;
  }

  navigator.geolocation.getCurrentPosition(
  async (pos) => {
    const { latitude, longitude } = pos.coords;

    try {
      const res = await api.get("/", {  // <-- baseURL must be /api/weather
        params: { lat: latitude, lon: longitude },
      });

      const data = res.data;

      const weatherInfo = {
        temp: data.temp,       // backend already rounds
        feelsLike: data.feelsLike,
        city: data.city,
        country: data.country,
        desc: data.desc,
        icon: data.icon,
      };

      setWeather(weatherInfo);
      setLoadingWeather(false);
      localStorage.setItem("footerWeather", JSON.stringify(weatherInfo));
      localStorage.setItem("footerWeatherDate", new Date().toDateString());
    } catch (err) {
      console.error("Weather fetch error:", err);
      setLoadingWeather(false);
    }
  },
  (err) => {
    console.error("Geolocation error:", err);
    setLoadingWeather(false);
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
    <footer className="bg-white dark:bg-[#0B0F14] text-gray-900 dark:text-gray-300 relative">
      <StarBackground />
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-20 grid md:grid-cols-4 gap-10">
        
        {/* Brand Section */}
        <div>
          <img
            src="/newname.jpeg"
            alt="SwiftMeta Logo"
            className="w-32 mb-4"
          />

          <p className="text-gray-600 dark:text-gray-400">
            Building modern, responsive websites that elevate your brand and
            engage your audience.
          </p>

          {/* 🔥 Donate CTA (Best Placement) */}
          <div className="mt-6">
         
<Link 
  to="/pay-donation"
  className={`
    inline-flex items-center justify-center 
    px-5 py-2.5 
    text-sm font-medium tracking-wide
    text-white bg-gradient-to-r from-rose-500 to-pink-600 
    hover:from-rose-600 hover:to-pink-700 
    focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2
    rounded-full shadow-md hover:shadow-lg 
    transition-all duration-200
  `}
>
  <span>Donate Now</span>
  {/* Optional: heart / giving icon */}
  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
</Link>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 mt-6 text-gray-600 dark:text-gray-400">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://github.com/Ymffuture" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </a>
            <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
              <FaXTwitter />
            </a>
          </div>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/dashboard/blog">Blog</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/weather">Weather</Link></li>
            <li><Link to="/news">News</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/faq">FAQs</Link></li>
            <li><Link to="/help">Help Center</Link></li>
            <li><Link to="/policy">Privacy</Link></li>
            <li><Link to="/terms">Terms</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-200 dark:border-gray-700 text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} SwiftMeta (Pty) Ltd — All rights reserved.
        <br />
        <span className="text-gray-600">
  {loadingWeather
    ? "Detecting location..."
    : weather
    ? `${weather.country} · ${weather.city}`
    : "Location unavailable"}
</span>
      </div>
    </footer>
  );
};

export default Footer;
