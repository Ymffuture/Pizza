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
} from "lucide-react";

import { FaWhatsapp, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import GeminiAssistant from "../layouts/GeminiAssistant";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import { Dropdown, Menu } from "antd";

const menu = (
  <Menu
    items={[
      {
        key: "1",
        label: (
          <span onClick={() => navigate("/small-projects")}>
            Small Projects
          </span>
        ),
      },
      {
        key: "2",
        label: (
          <span onClick={() => navigate("/large-projects")}>
            Small Projects
          </span>
        ),
      },
      {
        key: "3",
        label: (
          <span onClick={() => navigate("/signup")}>
            Log in
          </span>
        ),
      },
    ]}
  />
);
// ----------------------
// SEARCH DATA SOURCE
// ----------------------
const searchData = [
  { title: "Home", url: "/" },
  { title: "Dashboard", url: "/dashboard" },
  { title: "Sign in", url: "/signup" },
  { title: "Server/API", url: "/server-api" },
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
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

          {/* LOGO */}
          <div
            className="text-2xl cursor-pointer"
            onClick={() => navigate("/")}
          >
            <span className="text-blue-500 dark:text-blue-600">Swift</span>
            <span className="text-gray-700 dark:text-gray-300">Meta</span>
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
                className="ml-3 w-full bg-transparent outline-none text-sm dark:text-white"
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
  <Home
    onClick={() => navigate("/")}
    size={22}
    className="cursor-pointer hover:text-blue-500 dark:text-white"
  />

  {/* THREE DOTS MENU */}
  <Dropdown overlay={menu} trigger={["click"]}>
    <MoreHorizontal
      size={28}
      className="cursor-pointer hover:text-blue-500 dark:text-white"
    />
  </Dropdown>

</nav>

            {/* WhatsApp CTA */}
            <button
              onClick={handleWhatsAppRedirect}
              className="hidden md:flex items-center text-green-500 hover:text-green-600"
            >
              <FaWhatsapp size={28}/>
            </button>

            {/* Theme Toggle */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 rounded-full"
              onClick={() => setMenuOpen(true)}
            >
              <svg
                className="h-5 w-5 dark:text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                viewBox="0 0 24 24"
              >
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
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
                <GeminiAssistant />
                <h2 className="text-xl text-blue-500 dark:text-gray-400">SwiftMeta AI</h2>
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
                {[
  { name: "Home", href: "/", icon: <Home size={18} /> },
  { name: "Small Projects", href: "/small-projects", icon: <FolderKanban size={18} /> },
  { name: "Large Projects", href: "/large-projects", icon: <Factory size={18} /> },
  { name: "Server/API", href: "/server-api", icon: <ServerCog size={18} /> },
  { name: "Log in", href: "/signup", icon: <LogIn size={18} /> },
].map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* THEME */}
              <div className="flex items-center gap-3 mb-5 dark:text-gray-400">
                <ThemeToggle /> Theme
              </div>

              {/* SOCIAL ICONS */}
              <div className="flex items-center justify-center gap-8">
                <FaXTwitter size={24} className="cursor-pointer dark:text-white" />
                <FaInstagram size={24} className="cursor-pointer dark:text-red-600" />
                <FaLinkedin size={24} className="cursor-pointer dark:text-blue-600" />
                <FaWhatsapp
                  size={24}
                  className="cursor-pointer dark:text-green-600"
                  onClick={handleWhatsAppRedirect}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
