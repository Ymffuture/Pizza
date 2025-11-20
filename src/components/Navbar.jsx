// src/components/Navbar.jsx
import React, { useState } from "react";
import {
  Home,
  Users,
  Search,
  MessageSquare,
  Bell,
  ShoppingCart,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { FaXTwitter, FaInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";
import GeminiAssistant from "../layouts/GeminiAssistant";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const phoneNumber = "27847776308";
  const message = "Hello! I’m interested in building a website with you.";

  const handleWhatsAppRedirect = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <>
      {/* Desktop Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center text-2xl text-blue-500 font-semibold">
            Swift<span className="text-gray-600 dark:text-gray-300 ml-1">Meta™</span>
          </div>

          {/* Search (desktop) */}
          <div className="hidden md:flex flex-1 justify-center px-6">
            <div className="w-full max-w-xl">
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-full px-3 py-2 shadow-sm">
                <Search className="text-gray-400" size={16} />
                <input
                  type="search"
                  placeholder="Search SwiftMeta"
                  aria-label="Search SwiftMeta"
                  className="ml-3 w-full bg-transparent text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Desktop nav icons */}
            <nav className="hidden md:flex items-center gap-4">
              <Home className="cursor-pointer hover:text-blue-600" size={18} />
              <Users className="cursor-pointer hover:text-blue-600" size={18} />
              <MessageSquare className="cursor-pointer hover:text-blue-600" size={18} />
              <Bell className="cursor-pointer hover:text-blue-600" size={18} />
              <ShoppingCart className="cursor-pointer hover:text-blue-600" size={18} />
            </nav>

            {/* Social (desktop) */}
            <div className="hidden md:flex items-center gap-3">
              <FaXTwitter className="cursor-pointer hover:text-blue-500" size={16} />
              <FaInstagram className="cursor-pointer hover:text-pink-500" size={16} />
              <FaLinkedin className="cursor-pointer hover:text-blue-700" size={16} />
            </div>

            {/* WhatsApp CTA */}
            <button
              onClick={handleWhatsAppRedirect}
              className="hidden md:flex items-center gap-2 bg-green-500 text-white rounded-full px-3 py-1.5 text-sm font-medium hover:opacity-95 transition"
              aria-label="Get a quote on WhatsApp"
            >
              <FaWhatsapp />
              Get a Quote
            </button>

            {/* Theme toggle */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 dark:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer (manual links, no mapping) */}
      {menuOpen && (
        <div className="fixed inset-0 z-40" aria-hidden={!menuOpen}>
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMenuOpen(false)}
          />

          {/* sheet */}
          <div
            className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 rounded-t-3xl p-6 shadow-lg z-50"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <GeminiAssistant />
                <div className="text-lg font-bold text-blue-600">SwiftMeta AI</div>
              </div>

              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-gray-600 dark:text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile nav links (MANUAL) */}
            <nav className="flex flex-col gap-3 mb-6">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-200"
              >
                <Home size={18} /> Home
              </Link>

              <Link
                to="/small-projects"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-200"
              >
                <Users size={18} /> Small Projects
              </Link>

              <Link
                to="/large-projects"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-200"
              >
                <Search size={18} /> Large Projects
              </Link>

              <Link
                to="/server-api"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-200"
              >
                <MessageSquare size={18} /> Server / API
              </Link>
            </nav>

            {/* Theme */}
            <div className="flex items-center gap-3 mb-6">
              <ThemeToggle />
              <span className="text-sm text-gray-500 dark:text-gray-400">Theme</span>
            </div>

            {/* Social */}
            <div className="flex items-center gap-5 justify-center">
              <FaXTwitter size={20} className="cursor-pointer hover:text-blue-500 dark:text-white" />
              <FaInstagram size={20} className="cursor-pointer hover:text-pink-500 dark:text-pink-200" />
              <FaLinkedin size={20} className="cursor-pointer hover:text-blue-500 dark:text-blue-200" />
              <FaWhatsapp size={20} className="cursor-pointer hover:text-green-500 dark:text-green-400" onClick={handleWhatsAppRedirect} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
