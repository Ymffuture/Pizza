import React, { useState } from "react";
import { Sun, Moon, Phone, Github, Linkedin, Instagram, Twitter } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const phoneNumber = "27634414863";
  const message = "Hello! I’m interested in building a website with you.";

  const handleWhatsAppRedirect = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/#services" },
    { name: "Portfolio", href: "/#portfolio" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" },
  ];

  const socialLinks = [
    { icon: <Github />, href: "https://github.com/" },
    { icon: <Linkedin />, href: "https://linkedin.com/in/kgomotsonkosi-l" },
    { icon: <Instagram />, href: "https://instagram.com/" },
    { icon: <Twitter />, href: "https://twitter.com/" },
  ];

  return (
    <>
      {/* TOP NAVBAR */}
      <header className="bg-white dark:bg-[#1C1A27] text-black dark:text-white py-4 px-5 lg:px-14 flex items-center justify-between transition-colors duration-300 shadow-md">
        {/* LOGO */}
        <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
          <span>Swift<span className="text-gray-600">Meta</span></span>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex space-x-8 font-medium">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="hover:text-blue-400 transition">
              {link.name}
            </a>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button
            onClick={handleWhatsAppRedirect}
            className="hidden md:flex bg-green-500 hover:bg-green-600 transition text-white items-center gap-2 py-2 px-4 rounded-full text-sm font-medium"
          >
            <Phone className="w-5 h-5" /> Get a Quote
          </button>

          {/* MOBILE HAMBURGER */}
          <button
            className="md:hidden text-2xl text-blue-600"
            onClick={() => setMenuOpen(true)}
          >
            <Sun className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="fixed bottom-0 left-0 w-full bg-white dark:bg-[#1C1A27] rounded-t-3xl p-6 z-50 transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-blue-600">Menu</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-2xl text-gray-500"
              >
                <Moon className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col space-y-4 text-lg font-medium">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.name}
                </a>
              ))}
            </nav>

            <button
              onClick={handleWhatsAppRedirect}
              className="mt-6 w-full bg-green-500 hover:bg-green-600 transition text-white flex items-center justify-center gap-2 py-3 rounded-full text-lg font-medium"
            >
              <Phone className="w-5 h-5" /> Get a Quote
            </button>

            {/* SOCIAL MEDIA */}
            <div className="mt-6 flex justify-center gap-6 text-gray-600 dark:text-gray-300">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 transition"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
