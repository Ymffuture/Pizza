import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-orange-100 dark:bg-[#1F1D2B] text-black dark:text-white pt-16 pb-10 px-6 lg:px-20 transition-colors duration-300">
      <div className="grid md:grid-cols-4 gap-10">
        {/* Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold text-orange-500 mb-4">BiteHub</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Your BiteHub app for delicious and fast food delivery. Taste the joy
            at your doorstep.
          </p>
          <div className="flex gap-4 mt-4 text-orange-500">
            <FaFacebookF className="hover:text-orange-600 cursor-pointer" />
            <FaInstagram className="hover:text-orange-600 cursor-pointer" />
            <FaTwitter className="hover:text-orange-600 cursor-pointer" />
            <FaLinkedinIn className="hover:text-orange-600 cursor-pointer" />
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <a href="/" className="hover:text-orange-400 transition">
                About Us
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-orange-400 transition">
                Careers
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-orange-400 transition">
                Blog
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-orange-400 transition">
                Press
              </a>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <a href="/" className="hover:text-orange-400 transition">
                Help Center
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-orange-400 transition">
                Safety Center
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-orange-400 transition">
                FAQs
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-orange-400 transition">
                Contact Support
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="hover:text-orange-400 transition">
              Email: support@BiteHub.com
            </li>
            <li className="hover:text-orange-400 transition">
              Phone: +91 98765 43210
            </li>
            <li className="hover:text-orange-400 transition">
              Location: San Francisco, USA
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom line */}
      <div className="text-center text-sm text-gray-500 border-t mt-4 pt-4">
        @copyright developed by champion programmers | All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
