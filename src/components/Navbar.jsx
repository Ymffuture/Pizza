import React, { useState, useMemo } from "react";
import {
  Home,
  Search,
  Bell,
  Users,
  FolderKanban,
  Factory,
  ServerCog,
  LogIn,
  Send, 
} from "lucide-react";

import { FaWhatsapp, FaGithub, FaLinkedin, FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
// import GeminiAssistant from "../layouts/GeminiAssistant";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, Ticket, LayoutDashboard, Phone} from "lucide-react";
import { Dropdown, Menu } from "antd";
import Dashboard from './dashboard/Dashboard';



const menu = {
  items: [
    {
      key: "home",
      label: <Link to="/">Home</Link>,
    },
    {
      key: "apply",
      label: <Link to="/apply">Apply</Link>,
    },
    {
      key: "dashboard",
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: "blog",
      label: <Link to="/dashboard/blog">Blog</Link>,
    },
    {
      key: "tickets",
      label: <Link to="/ticket">Tickets</Link>,
    },
    {
      key: "server",
      label: <Link to="/server-api">Server / API</Link>,
    },
    {
      key: "weather",
      label: <Link to="/weather">Weather</Link>,
    },
    {
      type: "divider",
    },
    {
      key: "contact",
      label: <Link to="/contact">Contact</Link>,
    },
    {
      key: "signup",
      label: <Link to="/signup">Sign up / Login</Link>,
    },
    {
      type: "divider",
    },
    {
      key: "cloudinary",
      label: (
        <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer">
          Cloudinary
        </a>
      ),
    },
    {
      key: "mongodb",
      label: (
        <a href="https://mongodb.com" target="_blank" rel="noopener noreferrer">
          MongoDB
        </a>
      ),
    },
    {
      key: "github",
      label: (
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      ),
    },
    {
      key: "vercel",
      label: (
        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
          Vercel
        </a>
      ),
    },
    {
      key: "supabase",
      label: (
        <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">
          Supabase
        </a>
      ),
    },
  ],
};

// ----------------------
// SEARCH DATA SOURCE
// ----------------------
const searchData = [
  { title: "Home", url: "/" },
  { title: "Dashboard", url: "/dashboard" },
  { title: "Sign in", url: "/signup" },
  { title: "Blog", url: "/dashboard/blog" },
  { title: "Cloudinary", url: "https://cloudinary.com" },
  { title: "MongoDB", url: "https://mongodb.com" },
  { title: "Gemini AI", url: "https://gemini.google.com" },
  { title: "Render", url: "https://render.com" },
  { title: "Node.js", url: "https://nodejs.org" },
  { title: "GitHub", url: "https://github.com" },
  { title: "Vercel", url: "https://vercel.com" },
  { title: "Supabase", url: "https://supabase.com" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const phoneNumber = "27847776308";
  const message = "Hello! I’m interested in building a website with you.";

  // WhatsApp handler
  const handleWhatsAppRedirect = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  // ----------------------
  // LIVE DESKTOP SEARCH
  // ----------------------
  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchData.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  // ----------------------
  // WEATHER DRAWER PLACEHOLDER
  // ----------------------
  const handleWeather = () => {
    alert("TODO: Connect this to your Footer.jsx weather drawer");
  };

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <header className="fixed top-0 w-full z-50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-sm">
       <div className="max-w-7xl mx-auto flex items-center justify-between px-3 py-2">


          {/* LOGO */}
   

    
     <div
  onClick={() => navigate("/")}
  className="cursor-pointer select-none flex items-center max-w-[160px] md:max-w-none gap-2"


      aria-label="swiftMeta home"
    >
       <img
  src="/new.jpeg"
  alt="SwiftMeta"
  className="w-32 h-auto"
/>
      <svg
        width="170"
        height="48"
        viewBox="0 0 460 100"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-[1.03]"
      >
        <defs>
          {/* Gradient for swift */}
          <linearGradient id="swiftGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          {/* Soft glow */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* swift */}
        <text
          x="0"
          y="70"
          fill="url(#swiftGradient)"
          fontSize="64"
          fontWeight="700"
          letterSpacing="0.2"
          style={{
            fontFamily:
              "Inter, system-ui, -apple-system, BlinkMacSystemFont",
          }}
          filter="url(#softGlow)"
        >
          Swift
        </text>

        {/* Meta (same word, visual contrast) */}
        <text
          x="158"
          y="70"
          fill="currentColor"
          fontSize="64"
          fontWeight="600"
          letterSpacing="0.2"
          style={{
            fontFamily:
              "Space Grotesk, system-ui, -apple-system, BlinkMacSystemFont",
          }}
          className="text-gray-600 dark:text-gray-200"
        >
          Meta
        </text>
      </svg>
    </div>
  
  

          {/* DESKTOP LIVE SEARCH */}
          <div className="hidden md:flex flex-col relative w-full max-w-xl mx-6">
            <div className="flex items-center bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search Navigation links"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="ml-7 w-full bg-transparent p-2 outline-none text-sm dark:text-white"
              />
            </div>

            {/* SEARCH RESULTS DROPDOWN */}
            {results.length > 0 && (
              <div className="absolute top-14 left-0 w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl py-2">
                {results.map((item, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      if (item.url.startsWith("http")) {
                        window.open(item.url, "_blank");
                      } else {
                        navigate(item.url);
                      }
                      setQuery("");
                    }}
                  >
                    {item.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4">

            {/* DESKTOP ICON NAVIGATION */}
            <nav className="hidden md:flex items-center gap-5">

  {/* HOME ICON */}


  {/* THREE DOTS MENU */}
  <Dropdown menu={menu} trigger={["click"]}>
    <MoreHorizontal
      size={28}
      className="cursor-pointer hover:text-blue-500 dark:text-white"
    />
  </Dropdown>

 <Home
    onClick={() => navigate("/")}
    size={22}
    className="cursor-pointer hover:text-blue-500 dark:text-white"
  />
</nav>

            {/* WhatsApp CTA */}
            <button
              onClick={handleWhatsAppRedirect}
              className="hidden md:flex items-center text-green-500 hover:text-green-600 px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 cursor-pointer"
            >
              <FaWhatsapp size={18} />
            </button>

            {/* Theme Toggle */}
            <div className="hidden md:block cursor-pointer">
              <ThemeToggle />
            </div>
            {/*<GeminiAssistant />*/} 
            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 rounded-full border-amber-50 flex justify-end"
              onClick={() => setMenuOpen(true)}
            >
              <svg
                className="h-7 w-7 dark:text-white cursor-pointer flex "
                fill="none"
                stroke="currentColor"
                strokeWidth="1.1"
                viewBox="0 0 24 24"
              >
                <path d="M4 6h14M4 12h10M4 18h12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* -------------------------------------------------------- */}
      {/* MOBILE MENU DRAWER */}
      {/* -------------------------------------------------------- */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* DRAWER */}
            <motion.div
              className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 rounded-t-3xl shadow-xl p-6 z-50"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 130 }}
            >
              {/* HEADER */}
              <div className="flex items-center justify-between mb-4">
                {/* <GeminiAssistant /> */}
                <h2 className="text-xl text-blue-500 dark:text-gray-400">...</h2>
                <button
                  className="p-2 dark:text-gray-400"
                  onClick={() => setMenuOpen(false)}
                >
                  ✖
                </button>
              </div>

              {/* MOBILE SEARCH (non-live) */}
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-3 mb-5">
                <Search size={18} />
                <input
                  placeholder="Search (opens result)"
                  className="bg-transparent w-full outline-none dark:text-white"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const found = results[0];
                      if (found) {
                        if (found.url.startsWith("http")) {
                          window.open(found.url, "_blank");
                        } else {
                          navigate(found.url);
                        }
                      }
                      setMenuOpen(false);
                    }
                  }}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              {/* LINKS */}
              <nav className="flex flex-col gap-3 mb-6">
  {/* APPLY – PRIMARY CTA */}
  <Link
    to="/apply"
    onClick={() => setMenuOpen(false)}
    className="
      relative flex items-center gap-3 p-3 rounded-xl
      bg-gradient-to-r from-blue-600 to-indigo-600
      text-white font-semibold
      shadow-lg shadow-blue-600/30
      hover:scale-[1.02] hover:shadow-indigo-600/40
      transition-all
    "
  >
    <span className="absolute inset-0 rounded-xl ring-2 ring-blue-400/50 animate-pulse" />
    <Send size={18} />
    <span>Apply Now</span>
  </Link>

  {/* OTHER LINKS */}
  {[
    { name: "Home", href: "/", icon: <Home size={18} /> },
    { name: "Tickets", href: "/ticket", icon: <Ticket size={18} /> },
    { name: "Contact", href: "/contact", icon: <Phone size={18} /> },
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Server/API", href: "/server-api", icon: <ServerCog size={18} /> },
  ].map((item) => (
    <Link
      key={item.name}
      to={item.href}
      onClick={() => setMenuOpen(false)}
      className="
        flex items-center gap-3 p-3 rounded-xl
        bg-gray-100 dark:bg-gray-800
        text-gray-800 dark:text-white
        hover:bg-gray-200 dark:hover:bg-gray-700
        transition-colors
      "
    >
      {item.icon}
      <span>{item.name}</span>
    </Link>
  ))}
</nav>


              {/* THEME */}
              <div className="flex items-center gap-3 mb-5 dark:text-gray-400">
                <ThemeToggle /> Theme
              </div>

              {/* SOCIAL ICONS */}
  

<div className="flex items-center justify-center gap-5">
  {/* X / Twitter */}
  <a
    href="https://x.com/@futureFBG96"
    target="_blank"
    rel="noopener noreferrer"
    className="transition transform hover:scale-110"
    aria-label="X / Twitter"
  >
    <FaXTwitter size={20} className="dark:text-white" />
  </a>

  {/* Instagram */}

  {/* LinkedIn */}

  {/* GitHub */}
  <a
    href="https://github.com/Ymffuture"
    target="_blank"
    rel="noopener noreferrer"
    className="transition transform hover:scale-110"
    aria-label="GitHub"
  >
    <FaGithub size={20} className="dark:text-gray-200" />
  </a>

  {/* Discord */}
  <a
    href="https://discord.gg/54ZcWjguQ"
    target="_blank"
    rel="noopener noreferrer"
    className="transition transform hover:scale-110"
    aria-label="Discord"
  >
    <FaDiscord size={20} className="dark:text-indigo-400" />
  </a>

  {/* WhatsApp */}
  <button
    onClick={handleWhatsAppRedirect}
    className="transition transform hover:scale-110"
    aria-label="WhatsApp"
  >
    <FaWhatsapp size={20} className="dark:text-green-600" />
  </button>
</div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
