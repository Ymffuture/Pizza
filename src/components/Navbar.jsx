import React, { useState } from "react";
import {
  Home,
  Users,
  Search,
  MessageSquare,
  Bell,
  Linkedin, 
  ShoppingCart, 
} from "lucide-react";
import { FaWhatsapp, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaXTwitter} from "react-icons/fa6"
import ThemeToggle from "./ThemeToggle";
import GeminiAssistant from "../layouts/GeminiAssistant";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
          <div className="flex items-center text-2xl text-blue-500">
            Swift<span className="text-gray-600 dark:text-gray-300">Meta™</span>
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
<AnimatePresence>
  {menuOpen && (
    <>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-40 bg-black"
        onClick={() => setMenuOpen(false)}
      />

      {/* Drawer */}
      <motion.div
        key="drawer"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{
          type: "spring",
          stiffness: 140,
          damping: 18,
        }}
        className="fixed bottom-0 left-0 w-full z-50 bg-white dark:bg-gray-900 rounded-t-3xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between mb-6">
          <GeminiAssistant />
          <div className="text-lg font-bold text-blue-600">SwiftMeta AI</div>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setMenuOpen(false)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-6 text-gray-600 dark:text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.3}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        </div>

        {/* Mobile nav links - WITH ICONS & STAGGER ANIMATION */}
        <motion.nav
          initial="hidden"
          animate="show"
          exit="hidden"
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.12 },
            },
          }}
          className="flex flex-col gap-3 mb-6"
        >
          {[
            { name: "Home", href: "/", icon: <Home size={18} /> },
            { name: "Small Projects", href: "/small-projects", icon: <Users size={18} /> },
            { name: "Large Projects", href: "/large-projects", icon: <ShoppingCart size={18} /> },
            { name: "Server/API", href: "/server-api", icon: <MessageSquare size={18} /> },
          ].map((link) => (
            <motion.div
              key={link.name}
              variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
            >
              <Link
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 py-3 px-4 rounded-lg bg-gray-100 dark:bg-gray-800/70 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {link.icon}
                <span className="font-medium">{link.name}</span>
              </Link>
            </motion.div>
          ))}
        </motion.nav>

        {/* Theme & WhatsApp */}
        <div className="flex items-center gap-3 mb-6">
          <ThemeToggle />
          Theme
        </div>

        {/* Social */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          className="flex items-center gap-6 justify-center"
        >
          <FaXTwitter size={20} className="cursor-pointer hover:text-blue-500 dark:text-white" />
          <Instagram size={20} className="cursor-pointer hover:text-pink-500 dark:text-pink-300" />
          <Linkedin size={20} className="cursor-pointer hover:text-blue-600 dark:text-blue-300" />
          <FaWhatsapp
            size={20}
            onClick={handleWhatsAppRedirect}
            className="cursor-pointer hover:text-green-500 dark:text-green-400"
          />
        </motion.div>
      </motion.div>
    </>
  )}
</AnimatePresence>

      
    </>
  );
};

export default Navbar;
