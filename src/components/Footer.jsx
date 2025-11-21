import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-[#0A0A0D] text-gray-900 dark:text-gray-300 transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-20 grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-2xl mb-4"><span className="text-blue-500">Swift</span><span className="text-gray-900">Meta</span></h2>
          <p className="text-gray-700 dark:text-gray-400">
            Building modern, responsive websites that elevate your brand and
            engage your audience. Design meets technology for a seamless
            digital presence.
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
              <Link
                to="/about "
                className="hover:text-blue-500 transition"
              >
                About Us
              </Link>
            </li>

            <li>
              <Link
                to="/Small-projects"
                className="hover:text-blue-500 transition"
              >
                Small Projects
              </Link>
            </li>

            <li>
              <Link
                to="/large-projects"
                className="hover:text-blue-500 transition"
              >
                Large Projects
              </Link>
            </li>

            <li>
              <Link
                to="/weather"
                className="hover:text-blue-500 transition"
              >
                Weather
              </Link>
            </li>

          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2">

            <li>
              <Link
                to="/faq"
                className="hover:text-blue-500 transition"
              >
                FAQs
              </Link>
            </li>

            <li>
              <Link
                to="/help"
                className="hover:text-blue-500 transition"
              >
                Help Center
              </Link>
            </li>

            {/* Your internal pages */}
            <li>
              <Link
                to="/policy"
                className="hover:text-blue-500 transition"
              >
                Privacy Policy
              </Link>
            </li>

            <li>
              <Link
                to="/terms"
                className="hover:text-blue-500 transition"
              >
                Terms of Service
              </Link>
            </li>

          </ul>
        </div>
      </div>

      {/* Bottom line */}
      <div className="border-t border-gray-200 dark:border-gray-700 text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} SwiftMeta | All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
