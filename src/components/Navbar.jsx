import React, { useState } from "react";
import { FaShoppingCart, FaWhatsapp, FaPizzaSlice, FaBars, FaTimes } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const phoneNumber = "27634414863";
  const message = "Hello! I’d like to order from Lailas Pizza & Pies.";

  const handleWhatsAppRedirect = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      {/* Top Navbar */}
      <header className="bg-white dark:bg-[#1C1A27] text-black dark:text-white py-4 px-5 lg:px-14 flex items-center justify-between transition-colors duration-300">
        {/* Logo */}
        <div className="flex items-center gap-1.5 text-2xl font-bold text-orange-500">
          <FaPizzaSlice />
          <span>Lailas Pizza & Pies</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 font-medium">
          <a href="/" className="hover:text-orange-400 transition">Home</a>
          <a href="/" className="hover:text-orange-400 transition">Restaurants</a>
          <a href="/" className="hover:text-orange-400 transition">Foods</a>
          <a href="/" className="hover:text-orange-400 transition">Offers</a>
          <a href="/" className="hover:text-orange-400 transition">Service</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button className="hidden md:flex text-orange-400 text-xl">
            <FaShoppingCart />
          </button>
          <button
            onClick={handleWhatsAppRedirect}
            className="hidden md:flex bg-green-500 hover:bg-green-600 transition text-white items-center gap-2 py-2 px-4 rounded-full text-sm font-medium"
          >
            <FaWhatsapp className="text-lg" /> WhatsApp Us
          </button>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-2xl text-orange-500"
            onClick={() => setMenuOpen(true)}
          >
            <FaBars />
          </button>
        </div>
      </header>

      {/* Mobile Bottom Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMenuOpen(false)}>
          <div
            className="fixed bottom-0 left-0 w-full bg-white dark:bg-[#1C1A27] rounded-t-3xl p-6 z-50 transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-orange-500">Menu</h2>
              <button onClick={() => setMenuOpen(false)} className="text-2xl text-gray-500">
                <FaTimes />
              </button>
            </div>

            <nav className="flex flex-col space-y-4 text-lg font-medium">
              <a href="/" onClick={() => setMenuOpen(false)}>Home</a>
              <a href="/" onClick={() => setMenuOpen(false)}>Restaurants</a>
              <a href="/" onClick={() => setMenuOpen(false)}>Foods</a>
              <a href="/" onClick={() => setMenuOpen(false)}>Offers</a>
              <a href="/" onClick={() => setMenuOpen(false)}>Service</a>
            </nav>

            {/* WhatsApp Button on Mobile */}
            <button
              onClick={handleWhatsAppRedirect}
              className="mt-6 w-full bg-green-500 hover:bg-green-600 transition text-white flex items-center justify-center gap-2 py-3 rounded-full text-lg font-medium"
            >
              <FaWhatsapp /> WhatsApp Us
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

