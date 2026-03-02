// src/pages/Sitemap.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Sitemap = () => {
  const sitemapLinks = [
    {
      title: "Main Navigation",
      links: [
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
        { name: "Services", path: "/services" },
        { name: "Portfolio", path: "/portfolio" },
        { name: "Pricing", path: "/pricing" },
        { name: "Contact", path: "/contact" },
      ],
    },
    {
      title: "Educational Tools",
      links: [
        { name: "Mathematics Quiz (Grade 10–11)", path: "/quiz/math" },
        { name: "Start Quiz", path: "/quiz/start" },
        { name: "Quiz Results", path: "/quiz/results" },
      ],
    },
    {
      title: "Account & Support",
      links: [
        { name: "Login", path: "/login" },
        { name: "Register", path: "/register" },
        { name: "Verify Email", path: "/verify-email" },
        { name: "Dashboard / Profile", path: "/dashboard" },
        { name: "FAQ", path: "/faq" },
        { name: "Sitemap", path: "/sitemap" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", path: "/privacy-policy" },
        { name: "Terms of Service", path: "/terms" },
        { name: "Cookie Policy", path: "/cookies" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sitemap</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Quick access to every important page on SwiftMeta.  
            Last updated: March 2026
          </p>
        </div>

        {/* Sitemap Grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {sitemapLinks.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="bg-indigo-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">
                  {section.title}
                </h2>
              </div>

              <ul className="divide-y divide-gray-100">
                {section.links.map((item, i) => (
                  <li key={i}>
                    <Link
                      to={item.path}
                      className="block px-6 py-4 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150 flex items-center justify-between group"
                    >
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-400 group-hover:text-indigo-500 transition-colors">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>
            Missing a page? Let us know at{" "}
            <a
              href="mailto:support@swiftmeta.co.za"
              className="text-indigo-600 hover:underline"
            >
              support@swiftmeta.co.za
            </a>
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} SwiftMeta • Pretoria, South Africa
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
