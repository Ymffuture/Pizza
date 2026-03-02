// src/pages/Sitemap.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Network, 
  Compass, 
  GraduationCap, 
  UserCircle, 
  Scale, 
  ArrowRight,
  Search,
  ExternalLink,
  MapPin
} from 'lucide-react';

const Sitemap = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredSection, setHoveredSection] = useState(null);
  const location = useLocation();

  const sitemapData = [
    {
      id: 'main',
      title: "Main Navigation",
      icon: Compass,
      description: "Core pages and primary user journeys",
      color: "from-blue-500 to-cyan-400",
      links: [
        { name: "Home", path: "/", description: "Landing page" },
        { name: "About Us", path: "/about", description: "Company story" },
        { name: "Services", path: "/services", description: "What we offer" },
        { name: "Portfolio", path: "/portfolio", description: "Our work" },
        { name: "Pricing", path: "/pricing", description: "Plans & rates" },
        { name: "Contact", path: "/contact", description: "Get in touch" },
      ],
    },
    {
      id: 'edu',
      title: "Educational Tools",
      icon: GraduationCap,
      description: "Interactive learning modules",
      color: "from-emerald-500 to-teal-400",
      links: [
        { name: "Mathematics Quiz", path: "/quiz/math", description: "Grade 10–11" },
        { name: "Start Quiz", path: "/quiz/start", description: "Begin assessment" },
        { name: "Quiz Results", path: "/quiz/results", description: "View scores" },
      ],
    },
    {
      id: 'account',
      title: "Account & Support",
      icon: UserCircle,
      description: "User management and help center",
      color: "from-violet-500 to-purple-400",
      links: [
        { name: "Login", path: "/login", description: "Sign in" },
        { name: "Register", path: "/register", description: "Create account" },
        { name: "Verify Email", path: "/verify-email", description: "Confirm address" },
        { name: "Dashboard", path: "/dashboard", description: "User profile" },
        { name: "FAQ", path: "/faq", description: "Common questions" },
        { name: "Sitemap", path: "/sitemap", description: "This page" },
      ],
    },
    {
      id: 'legal',
      title: "Legal",
      icon: Scale,
      description: "Policies and compliance",
      color: "from-amber-500 to-orange-400",
      links: [
        { name: "Privacy Policy", path: "/privacy-policy", description: "Data protection" },
        { name: "Terms of Service", path: "/terms", description: "Usage terms" },
        { name: "Cookie Policy", path: "/cookies", description: "Cookie usage" },
      ],
    },
  ];

  // Filter logic
  const filteredData = sitemapData.map(section => ({
    ...section,
    links: section.links.filter(link => 
      link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.links.length > 0);

  const totalLinks = sitemapData.reduce((acc, section) => acc + section.links.length, 0);
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="mb-12 space-y-6 pt-16">
          <div className="flex items-center gap-3 text-indigo-400 mb-2">
            <Network className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wider uppercase">Architecture</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-4">
                Sitemap
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                Structured navigation index. <span className="text-slate-300">{totalLinks} pages</span> organized across {sitemapData.length} categories. Last indexed: March 2026.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                placeholder="Filter pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {sitemapData.map((section) => (
            <div 
              key={section.id}
              className="bg-slate-900/30 border border-slate-800/50 rounded-lg p-4 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <section.icon className="w-4 h-4" />
                <span>{section.title}</span>
              </div>
              <div className="text-2xl font-semibold text-slate-200">
                {section.links.length} <span className="text-sm text-slate-500 font-normal">pages</span>
              </div>
            </div>
          ))}
        </div>

        {/* Grid Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredData.map((section) => {
            const Icon = section.icon;
            const isHovered = hoveredSection === section.id;
            
            return (
              <div
                key={section.id}
                className="group relative bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300"
                onMouseEnter={() => setHoveredSection(section.id)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                {/* Gradient Header */}
                <div className={`h-1 bg-gradient-to-r ${section.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${section.color} bg-opacity-10`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-slate-100 group-hover:text-white transition-colors">
                          {section.title}
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">{section.description}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-slate-600 bg-slate-900 px-2 py-1 rounded">
                      {section.links.length}
                    </span>
                  </div>

                  {/* Links List */}
                  <ul className="space-y-1">
                    {section.links.map((link, idx) => {
                      const isActive = currentPath === link.path;
                      
                      return (
                        <li key={idx}>
                          <Link
                            to={link.path}
                            className={`flex items-center justify-between p-3 rounded-lg group/link transition-all duration-200 ${
                              isActive 
                                ? 'bg-indigo-500/10 border border-indigo-500/20' 
                                : 'hover:bg-slate-800/50 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                isActive ? 'bg-indigo-400' : 'bg-slate-600 group-hover/link:bg-slate-400'
                              }`} />
                              <div>
                                <span className={`block text-sm font-medium ${
                                  isActive ? 'text-indigo-300' : 'text-slate-300 group-hover/link:text-slate-100'
                                }`}>
                                  {link.name}
                                </span>
                                <span className="text-xs text-slate-600 group-hover/link:text-slate-500">
                                  {link.description}
                                </span>
                              </div>
                            </div>
                            
                            <ArrowRight className={`w-4 h-4 transition-all duration-200 ${
                              isActive 
                                ? 'text-indigo-400 translate-x-0 opacity-100' 
                                : 'text-slate-600 -translate-x-2 opacity-0 group-hover/link:translate-x-0 group-hover/link:opacity-100'
                            }`} />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${section.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-900 flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-400">No pages found matching "{searchQuery}"</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Johannesburg, South Africa</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a 
              href="mailto:support@swiftmeta.co.za" 
              className="flex items-center gap-2 hover:text-slate-300 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              famacloud.ai@gmail.com 
            </a>
            <span>© {new Date().getFullYear()} SwiftMeta</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
