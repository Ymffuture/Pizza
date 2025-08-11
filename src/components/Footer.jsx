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
          <h2 className="text-2xl font-bold text-orange-500 mb-4">
            Future Dev
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Building modern web solutions with React, Node.js, and MERN stack.
            Passionate about coding, mathematics, and science.
          </p>
          <div className="flex gap-4 mt-4 text-orange-500">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF className="hover:text-orange-600 cursor-pointer" />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="hover:text-orange-600 cursor-pointer" />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="hover:text-orange-600 cursor-pointer" />
            </a>
            <a
              href="https://www.linkedin.com/in/kgomotsonkosi-l"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn className="hover:text-orange-600 cursor-pointer" />
            </a>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <a href="/" className="hover:text-orange-400 transition">
                About Me
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-orange-400 transition">
                Projects
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-orange-400 transition">
                Blog
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-orange-400 transition">
                Services
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
                FAQs
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-orange-400 transition">
                Tutorials
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
              Email:{" "}
              <a
                href="mailto:futurekgomotso@gmail.com"
                className="underline"
              >
                futurekgomotso@gmail.com
              </a>
            </li>
            <li className="hover:text-orange-400 transition">
              Phone:{" "}
              <a href="tel:+27634414863" className="underline">
                +27 63 441 4863
              </a>
            </li>
            <li className="hover:text-orange-400 transition">
              Website:{" "}
              <a
                href="https://yourwebsite.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                yourwebsite.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom line */}
      <div className="text-center text-sm text-gray-500 border-t mt-4 pt-4">
        © {new Date().getFullYear()} Developed by Future (Kgomotso Nkosi) | All
        rights reserved
      </div>
    </footer>
  );
};

export default Footer;

