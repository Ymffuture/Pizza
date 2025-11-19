import React, { useState } from "react";
import {
  Home,
  Users,
  Search,
  MessageSquare,
  Bell,
  ShoppingCart,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";

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
    { name: "Services", href: "/#services" },
    { name: "Portfolio", href: "/#portfolio" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
          {/* LEFT: Logo */}
          <div className="flex items-center gap-3">
            
<div className="flex items-center gap-2 text-2xl font-bold text-blue-600"> <span>Swift<span className="text-gray-600" >Meta</span></span> </div>
          </div>

          {/* CENTER: Search (desktop) */}
          <div className="hidden md:flex flex-1 justify-center px-6">
            <div className="w-full max-w-xl">
              <label className="relative block">
                <span className="sr-only">Search</span>
                <div className="flex items-center bg-white rounded-full px-3 py-2 shadow-sm">
                  <Search className="text-gray-400" size={16} />
                  <input
                    type="search"
                    placeholder="Search SwiftMeta"
                    className="ml-3 w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                    aria-label="Search"
                  />
                </div>
              </label>
            </div>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-3">
            {/* nav icons (desktop) */}
            <nav className="hidden md:flex items-center gap-4">
              <button aria-label="Home" className="p-2 rounded-full hover:bg-white/10 transition">
                <Home size={18} />
              </button>
              <button aria-label="Network" className="p-2 rounded-full hover:bg-white/10 transition">
                <Users size={18} />
              </button>
              <button aria-label="Messages" className="p-2 rounded-full hover:bg-white/10 transition">
                <MessageSquare size={18} />
              </button>
              <button aria-label="Notifications" className="p-2 rounded-full hover:bg-white/10 transition">
                <Bell size={18} />
              </button>
              <button aria-label="Cart" className="p-2 rounded-full hover:bg-white/10 transition">
                <ShoppingCart size={18} />
              </button>
            </nav>

            {/* Social icons (desktop) */}
            <div className="hidden md:flex items-center gap-3">
              <a href="https://twitter.com/" target="_blank" rel="noreferrer" className="p-2 rounded-full hover:bg-white/10 transition">
                <Twitter size={16} />
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="p-2 rounded-full hover:bg-white/10 transition">
                <Instagram size={16} />
              </a>
              <a href="https://www.linkedin.com/in/kgomotsonkosi-l" target="_blank" rel="noreferrer" className="p-2 rounded-full hover:bg-white/10 transition">
                <Linkedin size={16} />
              </a>
            </div>

            {/* Theme toggle */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* WhatsApp CTA (desktop) */}
            <button
              onClick={handleWhatsAppRedirect}
              className="hidden md:flex items-center gap-2 bg-white text-[#1877f2] rounded-full px-3 py-1.5 text-sm font-medium hover:opacity-95 transition"
              aria-label="Get a Quote via WhatsApp"
            >
              <FaWhatsapp />
              <span>Get a Quote</span>
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-white/10 transition"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.6} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU / BOTTOM DRAWER */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="fixed bottom-0 left-0 w-full dark:backdrop-blur-xl dark:bg-white/50 rounded-t-3xl p-6 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#1877f2] text-white rounded-full p-2">
                  <Home size={16} />
                </div>
                <div className="text-blue-300">Swift<span className="text-gray bold shadow-lg">Meta</span></div>
              </div>
              <button onClick={() => setMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-3 mb-4 backdrop-blur-xl bg-gray/50">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} onClick={() => setMenuOpen(false)} className="py-3 px-4 rounded-lg hover:bg-gray-100 transition text-gray">
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <button onClick={handleWhatsAppRedirect} className="flex-1 bg-[#25D366] text-white py-2 rounded-full flex items-center justify-center gap-2">
                <FaWhatsapp /> WhatsApp
              </button>
              <button className="p-3 rounded-full" aria-label="Toggle theme">
                <ThemeToggle />
              </button>
            </div>

            <div className="flex items-center gap-4 justify-center">
              <a href="https://twitter.com/" target="_blank" rel="noreferrer" className="p-2 rounded-full hover:bg-gray-100">
                <Twitter size={18} />
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="p-2 rounded-full hover:bg-gray-100">
                <Instagram size={18} />
              </a>
              <a href="https://www.linkedin.com/in/kgomotsonkosi-l" target="_blank" rel="noreferrer" className="p-2 rounded-full hover:bg-gray-100">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
