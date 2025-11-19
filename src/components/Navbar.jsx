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
import { Twitter, Instagram, Linkedin } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import GeminiAssistant from "../layouts/GeminiAssistant";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const phoneNumber = "27634414863";
  const message = "Hello! I’m interested in building a website with you.";

  const handleWhatsAppRedirect = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Small Projects", href: "/small-projects" },
    { name: "Large Projects", href: "/large-projects" },
    { name: "Server/API", href: "/server-api" },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
            Swift
            <span className="text-gray-600 dark:text-gray-300">Meta</span>
          </div>

          {/* Search (desktop) */}
          <div className="hidden md:flex flex-1 justify-center px-6">
            <div className="w-full max-w-xl">
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-full px-3 py-2 shadow-sm">
                <Search className="text-gray-400" size={16} />
                <input
                  type="search"
                  placeholder="Search SwiftMeta"
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
              <MessageSquare
                className="cursor-pointer hover:text-blue-600"
                size={18}
              />
              <Bell className="cursor-pointer hover:text-blue-600" size={18} />
              <ShoppingCart
                className="cursor-pointer hover:text-blue-600"
                size={18}
              />
            </nav>

            {/* Social (desktop) */}
            <div className="hidden md:flex items-center gap-3">
              <Twitter className="cursor-pointer hover:text-blue-500" size={16} />
              <Instagram className="cursor-pointer hover:text-pink-500" size={16} />
              <Linkedin className="cursor-pointer hover:text-blue-700" size={16} />
            </div>

            {/* WhatsApp CTA */}
            <button
              onClick={handleWhatsAppRedirect}
              className="hidden md:flex items-center gap-2 bg-green-500 text-white rounded-full px-3 py-1.5 text-sm font-medium hover:opacity-95 transition"
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
              className="md:hidden p-2 rounded-full hover:bg-gray-200 transition"
              onClick={() => setMenuOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 dark:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={4}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 rounded-t-3xl p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close header */}
            <div className="flex items-center justify-between mb-4">
              <GeminiAssistant />
              <div className="text-lg font-bold text-blue-600">SwiftMeta AI</div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile nav links */}
            <nav className="flex flex-col gap-3 mb-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-200 text-center"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* WhatsApp & Theme */}
            <div className="flex items-center gap-3 mb-4">
              <ThemeToggle />
            </div>

            {/* Social */}
            <div className="flex items-center gap-4 justify-center">
              <Twitter className="cursor-pointer hover:text-blue-500 dark:text-white" size={18} />
              <Instagram className="cursor-pointer hover:text-pink-500 dark:text-white" size={18} />
              <Linkedin className="cursor-pointer hover:text-blue-500 dark:text-white" size={18} />
              <FaWhatsapp className="cursor-pointer hover:text-blue-500 dark:text-white" size={18} onClick={handleWhatsAppRedirect} />
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Chat */}
      
    </>
  );
};

export default Navbar;
