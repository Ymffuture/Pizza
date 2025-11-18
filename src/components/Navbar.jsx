// Navbar.jsx
import React from "react";
import { 
  Home, 
  Palette, 
  Briefcase, 
  User, 
  MessageCircle, 
  X,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Whatsapp
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const phoneNumber = "27634414863";
  const message = "Hello! I’m interested in building a website with SwiftMeta.";

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Palette, label: "Services", href: "/#services" },
    { icon: Briefcase, label: "Portfolio", href: "/#portfolio" },
    { icon: User, label: "About", href: "/#about" },
    { icon: MessageCircle, label: "Contact", href: "/#contact" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/swiftmeta", color: "hover:text-blue-600" },
    { icon: Instagram, href: "https://instagram.com/swiftmeta", color: "hover:text-pink-600" },
    { icon: Twitter, href: "https://twitter.com/swiftmeta", color: "hover:text-sky-500" },
    { icon: Linkedin, href: "https://linkedin.com/company/swiftmeta", color: "hover:text-blue-700" },
  ];

  return (
    <>
      {/* Top slim bar - logo only on mobile */}
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-[#1C1A27] z-40 shadow-lg">
        <div className="flex items-center justify-center py-4">
          <h1 className="text-2xl font-bold">
            Swift<span className="text-blue-500">Meta</span>
          </h1>
        </div>
      </header>

      {/* Facebook-style Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1C1A27] border-t border-gray-200 dark:border-gray-800 z-50">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className="flex flex-col items-center gap-1 py-2 px-4 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition"
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </a>
            );
          })}
        </div>

        {/* Floating WhatsApp + Socials */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-3">
          {/* WhatsApp FAB */}
          <button
            onClick={handleWhatsApp}
            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition transform hover:scale-110"
          >
            <Whatsapp className="w-7 h-7" />
          </button>

          {/* Social Icons */}
          {socialLinks.map((social, i) => {
            const Icon = social.icon;
            return (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`bg-white dark:bg-gray-800 p-3 rounded-full shadow-xl transition transform hover:scale-110 ${social.color}`}
              >
                <Icon className="w-5 h-5" />
              </a>
            );
          })}
        </div>
      </div>

      {/* Extra bottom padding so content isn't hidden */}
      <div className="pb-24" />
    </>
  );
};

export default Navbar;
