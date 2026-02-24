import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaGithub, FaMapMarkerAlt, FaHeart } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { WiThermometer, WiCloudy, WiDaySunny, WiRain, WiSnow } from "react-icons/wi";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, Badge, Skeleton } from "antd";
import toast from "react-hot-toast";

// Comprehensive country mapping
const COUNTRY_NAMES = {
  AF: "Afghanistan", AL: "Albania", DZ: "Algeria", AS: "American Samoa", AD: "Andorra",
  AO: "Angola", AI: "Anguilla", AQ: "Antarctica", AG: "Antigua and Barbuda", AR: "Argentina",
  AM: "Armenia", AW: "Aruba", AU: "Australia", AT: "Austria", AZ: "Azerbaijan",
  BS: "Bahamas", BH: "Bahrain", BD: "Bangladesh", BB: "Barbados", BY: "Belarus",
  BE: "Belgium", BZ: "Belize", BJ: "Benin", BM: "Bermuda", BT: "Bhutan",
  BO: "Bolivia", BA: "Bosnia and Herzegovina", BW: "Botswana", BR: "Brazil", IO: "British Indian Ocean Territory",
  BN: "Brunei Darussalam", BG: "Bulgaria", BF: "Burkina Faso", BI: "Burundi", KH: "Cambodia",
  CM: "Cameroon", CA: "Canada", CV: "Cape Verde", KY: "Cayman Islands", CF: "Central African Republic",
  TD: "Chad", CL: "Chile", CN: "China", CO: "Colombia", KM: "Comoros",
  CG: "Congo", CD: "Congo, Democratic Republic", CK: "Cook Islands", CR: "Costa Rica", CI: "Cote d'Ivoire",
  HR: "Croatia", CU: "Cuba", CY: "Cyprus", CZ: "Czech Republic", DK: "Denmark",
  DJ: "Djibouti", DM: "Dominica", DO: "Dominican Republic", EC: "Ecuador", EG: "Egypt",
  SV: "El Salvador", GQ: "Equatorial Guinea", ER: "Eritrea", EE: "Estonia", ET: "Ethiopia",
  FK: "Falkland Islands", FO: "Faroe Islands", FJ: "Fiji", FI: "Finland", FR: "France",
  GF: "French Guiana", PF: "French Polynesia", GA: "Gabon", GM: "Gambia", GE: "Georgia",
  DE: "Germany", GH: "Ghana", GI: "Gibraltar", GR: "Greece", GL: "Greenland",
  GD: "Grenada", GP: "Guadeloupe", GU: "Guam", GT: "Guatemala", GN: "Guinea",
  GW: "Guinea-Bissau", GY: "Guyana", HT: "Haiti", HN: "Honduras", HK: "Hong Kong",
  HU: "Hungary", IS: "Iceland", IN: "India", ID: "Indonesia", IR: "Iran",
  IQ: "Iraq", IE: "Ireland", IL: "Israel", IT: "Italy", JM: "Jamaica",
  JP: "Japan", JO: "Jordan", KZ: "Kazakhstan", KE: "Kenya", KI: "Kiribati",
  KP: "Korea, Democratic People's Republic", KR: "Korea, Republic of", KW: "Kuwait", KG: "Kyrgyzstan", LA: "Lao People's Democratic Republic",
  LV: "Latvia", LB: "Lebanon", LS: "Lesotho", LR: "Liberia", LY: "Libyan Arab Jamahiriya",
  LI: "Liechtenstein", LT: "Lithuania", LU: "Luxembourg", MO: "Macao", MK: "Macedonia",
  MG: "Madagascar", MW: "Malawi", MY: "Malaysia", MV: "Maldives", ML: "Mali",
  MT: "Malta", MH: "Marshall Islands", MQ: "Martinique", MR: "Mauritania", MU: "Mauritius",
  YT: "Mayotte", MX: "Mexico", FM: "Micronesia, Federated States of", MD: "Moldova", MC: "Monaco",
  MN: "Mongolia", MS: "Montserrat", MA: "Morocco", MZ: "Mozambique", MM: "Myanmar",
  NA: "Namibia", NR: "Nauru", NP: "Nepal", NL: "Netherlands", AN: "Netherlands Antilles",
  NC: "New Caledonia", NZ: "New Zealand", NI: "Nicaragua", NE: "Niger", NG: "Nigeria",
  NU: "Niue", NF: "Norfolk Island", MP: "Northern Mariana Islands", NO: "Norway", OM: "Oman",
  PK: "Pakistan", PW: "Palau", PS: "Palestinian Territory", PA: "Panama", PG: "Papua New Guinea",
  PY: "Paraguay", PE: "Peru", PH: "Philippines", PN: "Pitcairn", PL: "Poland",
  PT: "Portugal", PR: "Puerto Rico", QA: "Qatar", RE: "Reunion", RO: "Romania",
  RU: "Russian Federation", RW: "Rwanda", SH: "Saint Helena", KN: "Saint Kitts and Nevis", LC: "Saint Lucia",
  PM: "Saint Pierre and Miquelon", VC: "Saint Vincent and the Grenadines", WS: "Samoa", SM: "San Marino", ST: "Sao Tome and Principe",
  SA: "Saudi Arabia", SN: "Senegal", CS: "Serbia and Montenegro", SC: "Seychelles", SL: "Sierra Leone",
  SG: "Singapore", SK: "Slovakia", SI: "Slovenia", SB: "Solomon Islands", SO: "Somalia",
  ZA: "South Africa", GS: "South Georgia and the South Sandwich Islands", ES: "Spain", LK: "Sri Lanka", SD: "Sudan",
  SR: "Suriname", SJ: "Svalbard and Jan Mayen", SZ: "Swaziland", SE: "Sweden", CH: "Switzerland",
  SY: "Syrian Arab Republic", TW: "Taiwan", TJ: "Tajikistan", TZ: "Tanzania", TH: "Thailand",
  TL: "Timor-Leste", TG: "Togo", TK: "Tokelau", TO: "Tonga", TT: "Trinidad and Tobago",
  TN: "Tunisia", TR: "Turkey", TM: "Turkmenistan", TC: "Turks and Caicos Islands", TV: "Tuvalu",
  UG: "Uganda", UA: "Ukraine", AE: "United Arab Emirates", GB: "United Kingdom", US: "United States",
  UM: "United States Minor Outlying Islands", UY: "Uruguay", UZ: "Uzbekistan", VU: "Vanuatu", VE: "Venezuela",
  VN: "Viet Nam", VG: "Virgin Islands, British", VI: "Virgin Islands, U.S.", WF: "Wallis and Futuna", EH: "Western Sahara",
  YE: "Yemen", ZM: "Zambia", ZW: "Zimbabwe"
};

const getWeatherIcon = (iconCode) => {
  if (!iconCode) return <WiCloudy className="text-4xl" />;
  if (iconCode.includes('01')) return <WiDaySunny className="text-4xl text-yellow-400" />;
  if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) return <WiCloudy className="text-4xl text-gray-400" />;
  if (iconCode.includes('09') || iconCode.includes('10')) return <WiRain className="text-4xl text-blue-400" />;
  if (iconCode.includes('13')) return <WiSnow className="text-4xl text-white" />;
  return <WiThermometer className="text-4xl text-red-400" />;
};

const StarBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    const createParticles = () => {
      particles = [];
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          alpha: Math.random()
        });
      }
    };
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 200, 255, ${p.alpha})`;
        ctx.fill();
        
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });
      
      // Draw connecting lines
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(100, 200, 255, ${0.1 * (1 - distance / 100)})`;
            ctx.stroke();
          }
        });
      });
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    resize();
    createParticles();
    draw();
    
    window.addEventListener('resize', resize);
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ background: 'linear-gradient(to bottom, #0a0e17, #1a1f2e)' }}
    />
  );
};

const Footer = () => {
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
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
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=378c0d8b5246ceb52c1c6c6899b3446e&units=metric`
          );
          const data = await res.json();

          const weatherInfo = {
            temp: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            city: data.name,
            country: COUNTRY_NAMES[data.sys.country] || data.sys.country,
            countryCode: data.sys.country,
            desc: data.weather[0].description,
            icon: data.weather[0].icon,
            humidity: data.main.humidity,
            wind: data.wind.speed
          };

          setWeather(weatherInfo);
          setLoadingWeather(false);
          localStorage.setItem("footerWeather", JSON.stringify(weatherInfo));
          localStorage.setItem("footerWeatherDate", today);
        } catch (err) {
          setLoadingWeather(false);
          toast.error("Unable to fetch weather data");
        }
      },
      () => {
        setLoadingWeather(false);
        toast.error("Location access denied");
      }
    );
  }, []);

  const socialLinks = [
    { icon: FaFacebookF, href: "https://www.facebook.com/", label: "Facebook", color: "hover:bg-blue-600" },
    { icon: FaGithub, href: "https://github.com/Ymffuture", label: "GitHub", color: "hover:bg-gray-800" },
    { icon: FaXTwitter, href: "https://x.com/", label: "Twitter", color: "hover:bg-black" },
  ];

  const footerLinks = {
    company: [
      { name: "About", path: "/about" },
      { name: "Blog", path: "/dashboard/blog" },
      { name: "Contact", path: "/contact" },
      { name: "Weather", path: "/weather" },
      { name: "News", path: "/news" },
    ],
    support: [
      { name: "FAQs", path: "/faq" },
      { name: "Help Center", path: "/help" },
      { name: "Privacy", path: "/policy" },
      { name: "Terms", path: "/terms" },
    ]
  };

  return (
    <footer className="relative text-white overflow-hidden">
      <StarBackground />
      
      {/* AI Grid Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%234f46e5\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20 pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto py-20 px-6 lg:px-8">
        
        {/* Weather Widget - AI Style */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 p-6 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 max-w-md mx-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <WiThermometer className="text-2xl" />
              <span className="text-sm font-medium tracking-wider uppercase">Live Weather</span>
            </div>
            <div className="text-xs text-gray-400 font-mono">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
          
          {loadingWeather ? (
            <div className="flex items-center gap-4">
              <Skeleton.Avatar active size={64} shape="square" />
              <div className="flex-1">
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            </div>
          ) : weather ? (
            <div className="flex items-center gap-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10"
              >
                {getWeatherIcon(weather.icon)}
              </motion.div>
              
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {weather.temp}°
                  </span>
                  <span className="text-gray-400 text-sm">C</span>
                </div>
                
                <Tooltip title={`${weather.city}, ${weather.country}`}>
                  <div className="flex items-center gap-2 mt-1 text-gray-300 cursor-help">
                    <FaMapMarkerAlt className="text-cyan-400" />
                    <span className="font-medium truncate max-w-[200px]">
                      {weather.city}
                    </span>
                  </div>
                </Tooltip>
                
                <div className="mt-2 text-xs text-gray-400 capitalize flex items-center gap-2">
                  <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
                    {weather.desc}
                  </span>
                  <span>Feels like {weather.feelsLike}°</span>
                </div>
                
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    💧 {weather.humidity}%
                  </span>
                  <span className="flex items-center gap-1">
                    💨 {weather.wind} m/s
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-4">
              Weather data unavailable
            </div>
          )}
        </motion.div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000" />
              <img
                src="/newname.jpeg"
                alt="SwiftMeta"
                className="relative w-32 mb-6 rounded-lg"
              />
            </div>
            
            <p className="text-gray-400 leading-relaxed mb-6 text-sm">
              Building intelligent, responsive digital experiences that elevate brands through AI-powered solutions.
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/pay-donation"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all duration-300 group"
              >
                <FaHeart className="group-hover:animate-pulse" />
                <span>Support Our Mission</span>
              </Link>
            </motion.div>

            {/* Social Links */}
            <div className="flex gap-3 mt-8">
              {socialLinks.map((social, idx) => (
                <Tooltip key={idx} title={social.label}>
                  <motion.a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 rounded-xl bg-white/5 border border-white/10 ${social.color} transition-all duration-300 text-gray-400 hover:text-white hover:border-transparent`}
                  >
                    <social.icon size={18} />
                  </motion.a>
                </Tooltip>
              ))}
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, idx) => (
                <motion.li 
                  key={idx}
                  whileHover={{ x: 4 }}
                  className="group"
                >
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-cyan-400 transition-colors" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full" />
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, idx) => (
                <motion.li 
                  key={idx}
                  whileHover={{ x: 4 }}
                  className="group"
                >
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center gap-2 text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-purple-400 transition-colors" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Location/Status Column */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" />
                System Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-sm text-gray-400">API Status</span>
                  <Badge status="success" text={<span className="text-xs text-green-400">Operational</span>} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-sm text-gray-400">Weather Service</span>
                  <Badge status={loadingWeather ? "processing" : "success"} text={
                    <span className="text-xs text-gray-400">
                      {loadingWeather ? "Syncing..." : "Active"}
                    </span>
                  } />
                </div>
              </div>
            </div>

            {weather && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Current Location</div>
                <div className="text-sm font-medium text-white flex items-center gap-2">
                  <FaMapMarkerAlt className="text-cyan-400" />
                  {weather.country}
                </div>
                <div className="text-xs text-gray-400 mt-1">{weather.city}</div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <span>© {new Date().getFullYear()} SwiftMeta (Pty) Ltd</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">All rights reserved</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            {weather && (
              <Tooltip title={`Coordinates: Detected`}>
                <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  {weather.country}
                </span>
              </Tooltip>
            )}
            <span className="font-mono text-xs opacity-50">v2.0.4</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
