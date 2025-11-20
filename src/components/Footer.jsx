import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"
const Footer = () => {
  return (
    <footer className="bg-white dark:bg-[#0A0A0D] text-gray-900 dark:text-gray-300 transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-20 grid md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-blue-400 mb-4">SwiftMeta </h2>
          <p className="text-gray-700 dark:text-gray-400">
            Building modern, responsive websites that elevate your brand and
            engage your audience. Design meets technology for a seamless digital presence.
          </p>
          <div className="flex gap-4 mt-6 text-gray-700 dark:text-gray-400">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
            >
              <FaXTwitter />
            </a>
            <a
              href="https://www.linkedin.com/in/kgomotsonkosi-l"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:text-blue-500 transition">
                About Us
              </a>
            </li>
            <li>
              <a href="/#services" className="hover:text-blue-500 transition">
                Services
              </a>
            </li>
            <li>
              <a href="/#portfolio" className="hover:text-blue-500 transition">
                Portfolio
              </a>
            </li>
            <li>
              <a href="/#contact" className="hover:text-blue-500 transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            <li>
              <a href="/#faq" className="hover:text-blue-500 transition">
                FAQs
              </a>
            </li>
            <li>
              <a href="/#help" className="hover:text-blue-500 transition">
                Help Center
              </a>
            </li>
            <li>
              <a href="/#privacy" className="hover:text-blue-500 transition">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/#terms" className="hover:text-blue-500 transition">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
      
      </div>
      {/* Bottom line */}
      <div className="border-t border-gray-200 dark:border-gray-700 text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} SwiftMeta | All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
