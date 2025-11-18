import React, { useState } from "react";
import {
  Home,
  Briefcase,
  Image,
  User,
  MessageCircle,
  X,
  Menu,
  Sun,
  Moon,
  Whatsapp,
  Instagram,
  Linkedin,
  Twitter,
  Globe,
} from "lucide-react";
import { useTheme } from "next-themes";

const BottomNav = () => {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const phoneNumber = "27634414863";
  const message = "Hello! I’m interested in building a website with SwiftMeta.";

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Briefcase, label: "Services", href: "/#services" },
    { icon: Image, label: "Portfolio", href: "/#portfolio" },
    { icon: User, label: "About", href: "/#about" },
    { icon: MessageCircle, label: "Contact", href: "/#contact" },
  ];

  const socialLinks = [
    { icon: Whatsapp, href: `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, color: "text-green-500" },
    { icon: Instagram, href: "https://instagram.com/swiftmeta", color: "text-pink-500" },
    { icon: Linkedin, href: "https://linkedin.com/company/swiftmeta", color: "text-blue-700" },
    { icon: Twitter, href: "https://twitter.com/swiftmeta", color: "text-sky-500" },
    { icon: Globe, href: "https://swiftmeta.vercel.app", color: "text-blue-500" },
  ];

  return (
    <>
      {/* Fixed Bottom Bar (Facebook-style) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-1 p-3 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition"
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg z-40 transition-transform hover:scale-110"
      >
        <Menu className="w-7 h-7" />
      </button>

      {/* Bottom Sheet Menu */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl p-6 pb-8 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle + Close */}
            <div className="flex justify-between items-center mb-6">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto" />
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-gray-500"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* Logo */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">
                Swift<span className="text-blue-500">Meta</span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">Your website in seconds</p>
            </div>

            {/* Theme Toggle */}
            <div className="flex justify-center mb-8">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full"
              >
                {theme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center gap-6 mb-8">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-3xl ${social.color} hover:scale-110 transition`}
                >
                  <social.icon className="w-8 h-8" />
                </a>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-4 rounded-full font-semibold text-lg transition"
            >
              Get a Quote on WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default BottomNav;
