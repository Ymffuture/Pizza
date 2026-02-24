import React, { useState, useMemo, useCallback } from "react";
import {
  Home,
  Search,
  Bell,
  Users,
  FolderKanban,
  Factory,
  ServerCog,
  LogIn,
  Send,
  Sparkles,
  Zap,
  TrendingUp,
  Command,
  X,
  ChevronRight,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { 
  FaWhatsapp, 
  FaGithub, 
  FaLinkedin, 
  FaDiscord,
  FaTwitter 
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MoreHorizontal, 
  Ticket, 
  LayoutDashboard, 
  Phone,
  Menu,
  User,
  Settings,
  LogOut,
  BookOpen,
  Cloud,
  Database,
  Code2
} from "lucide-react";
import { 
  Dropdown, 
  Tooltip, 
  Badge, 
  Input, 
  Empty, 
  Tag,
  Divider,
  Button,
  Avatar
} from "antd";
import ThemeToggle from "./ThemeToggle";

// ----------------------
// ENHANCED SEARCH DATA
// ----------------------
const searchData = [
  { 
    title: "Home", 
    url: "/", 
    icon: <Home size={16} />,
    category: "Main",
    description: "Return to homepage",
    hot: true 
  },
  { 
    title: "Apply Now", 
    url: "/apply", 
    icon: <Send size={16} />,
    category: "Actions",
    description: "Start your application",
    hot: true,
    color: "blue"
  },
  { 
    title: "Dashboard", 
    url: "/dashboard", 
    icon: <LayoutDashboard size={16} />,
    category: "Portal",
    description: "Manage your account",
    hot: false 
  },
  { 
    title: "Blog", 
    url: "/dashboard/blog", 
    icon: <BookOpen size={16} />,
    category: "Content",
    description: "Latest articles & news",
    hot: false 
  },
  { 
    title: "Tickets", 
    url: "/ticket", 
    icon: <Ticket size={16} />,
    category: "Support",
    description: "Get help & support",
    hot: false 
  },
  { 
    title: "Server / API", 
    url: "/server-api", 
    icon: <ServerCog size={16} />,
    category: "Developers",
    description: "API documentation",
    hot: false 
  },
  { 
    title: "Contact", 
    url: "/contact", 
    icon: <MessageCircle size={16} />,
    category: "Support",
    description: "Get in touch",
    hot: false 
  },
  { 
    title: "Weather", 
    url: "/weather", 
    icon: <Cloud size={16} />,
    category: "Tools",
    description: "Local weather info",
    hot: false 
  },
  { 
    title: "Cloudinary", 
    url: "https://cloudinary.com", 
    icon: <Cloud size={16} />,
    category: "External",
    description: "Media management",
    external: true 
  },
  { 
    title: "MongoDB", 
    url: "https://mongodb.com", 
    icon: <Database size={16} />,
    category: "External",
    description: "Database service",
    external: true 
  },
  { 
    title: "GitHub", 
    url: "https://github.com", 
    icon: <Code2 size={16} />,
    category: "External",
    description: "Code repository",
    external: true 
  },
  { 
    title: "Vercel", 
    url: "https://vercel.com", 
    icon: <Zap size={16} />,
    category: "External",
    description: "Deployment platform",
    external: true 
  },
  { 
    title: "Supabase", 
    url: "https://supabase.com", 
    icon: <Database size={16} />,
    category: "External",
    description: "Backend as a service",
    external: true 
  },
];

// ----------------------
// NAVIGATION CONFIG
// ----------------------
const mainNavItems = [
  { key: "home", icon: Home, label: "Home", path: "/", tooltip: "Return to homepage" },
  { key: "dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", tooltip: "Your personal dashboard" },
  { key: "blog", icon: BookOpen, label: "Blog", path: "/dashboard/blog", tooltip: "Read our latest articles" },
  { key: "contact", icon: MessageCircle, label: "Contact", path: "/contact", tooltip: "Get in touch with us" },
];

const resourceMenuItems = [
  {
    key: "apply",
    icon: <Send size={16} className="text-blue-500" />,
    label: <Link to="/apply" className="font-medium">Apply Now</Link>,
    description: "Start your journey with us",
  },
  {
    key: "tickets",
    icon: <Ticket size={16} className="text-orange-500" />,
    label: <Link to="/ticket">Support Tickets</Link>,
    description: "Get help when you need it",
  },
  {
    key: "server",
    icon: <ServerCog size={16} className="text-purple-500" />,
    label: <Link to="/server-api">Server / API</Link>,
    description: "Developer documentation",
  },
  {
    key: "weather",
    icon: <Cloud size={16} className="text-cyan-500" />,
    label: <Link to="/weather">Weather</Link>,
    description: "Check local weather",
  },
  { type: "divider" },
  {
    key: "external",
    label: <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">External Resources</span>,
    disabled: true,
  },
  {
    key: "cloudinary",
    icon: <ExternalLink size={14} />,
    label: (
      <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
        Cloudinary <ExternalLink size={12} className="opacity-50" />
      </a>
    ),
  },
  {
    key: "mongodb",
    icon: <ExternalLink size={14} />,
    label: (
      <a href="https://mongodb.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
        MongoDB <ExternalLink size={12} className="opacity-50" />
      </a>
    ),
  },
  {
    key: "github",
    icon: <ExternalLink size={14} />,
    label: (
      <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
        GitHub <ExternalLink size={12} className="opacity-50" />
      </a>
    ),
  },
  {
    key: "vercel",
    icon: <ExternalLink size={14} />,
    label: (
      <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
        Vercel <ExternalLink size={12} className="opacity-50" />
      </a>
    ),
  },
  {
    key: "supabase",
    icon: <ExternalLink size={14} />,
    label: (
      <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
        Supabase <ExternalLink size={12} className="opacity-50" />
      </a>
    ),
  },
];

// ----------------------
// SOCIAL LINKS
// ----------------------
const socialLinks = [
  { icon: FaXTwitter, href: "https://x.com/@futureFBG96", label: "Twitter / X", color: "hover:text-black dark:hover:text-white" },
  { icon: FaGithub, href: "https://github.com/Ymffuture", label: "GitHub", color: "hover:text-gray-900 dark:hover:text-white" },
  { icon: FaDiscord, href: "https://discord.gg/54ZcWjguQ", label: "Discord", color: "hover:text-indigo-500" },
  { icon: FaWhatsapp, href: "#", label: "WhatsApp", color: "hover:text-green-500", onClick: true },
  { icon: FaLinkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-600" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const phoneNumber = "27653935339";
  const message = "Hello! I'm interested in building a website with you.";

  // WhatsApp handler
  const handleWhatsAppRedirect = useCallback(() => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }, []);

  // ----------------------
  // SMART SEARCH WITH GROUPING
  // ----------------------
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    
    const filtered = searchData.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase())
    );

    // Group by category
    const grouped = filtered.reduce((acc, item) => {
      const cat = item.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});

    return grouped;
  }, [query]);

  const hasResults = Object.keys(searchResults).length > 0;

  // Handle search item click
  const handleSearchClick = useCallback((item) => {
    if (item.external || item.url.startsWith("http")) {
      window.open(item.url, "_blank");
    } else {
      navigate(item.url);
    }
    setQuery("");
    setIsSearchFocused(false);
  }, [navigate]);

  // Keyboard shortcut for search
  const handleSearchKeyDown = useCallback((e) => {
    if (e.key === "Enter" && hasResults) {
      const firstCategory = Object.values(searchResults)[0];
      if (firstCategory?.[0]) {
        handleSearchClick(firstCategory[0]);
      }
    }
    if (e.key === "Escape") {
      setIsSearchFocused(false);
      setQuery("");
    }
  }, [hasResults, searchResults, handleSearchClick]);

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          
          {/* LOGO */}
          <Tooltip title="SwiftMeta Home" placement="bottom">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/")}
              className="cursor-pointer select-none flex items-center gap-3"
            >
              <Avatar 
                src="/new.jpeg" 
                size={40} 
                className="border-2 border-blue-500/20"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SwiftMeta
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">AI-Powered Solutions</p>
              </div>
            </motion.div>
          </Tooltip>

          {/* DESKTOP SMART SEARCH */}
          <div className="hidden md:flex flex-col relative flex-1 max-w-xl mx-8">
            <Tooltip title="Press ⌘K to search" placement="bottom">
              <div className={`
                flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-2.5 rounded-xl 
                border-2 transition-all duration-300
                ${isSearchFocused 
                  ? "border-blue-500 shadow-lg shadow-blue-500/20 bg-white dark:bg-gray-800" 
                  : "border-transparent hover:bg-white dark:hover:bg-gray-700"
                }
              `}>
                <Search size={18} className="text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search anything... (⌘K)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  onKeyDown={handleSearchKeyDown}
                  className="flex-1 bg-transparent outline-none text-sm dark:text-white placeholder-gray-400"
                />
                {query && (
                  <button 
                    onClick={() => setQuery("")}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                  >
                    <X size={14} className="text-gray-400" />
                  </button>
                )}
                <kbd className="hidden lg:inline-block ml-2 px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded text-gray-500 dark:text-gray-400">
                  ⌘K
                </kbd>
              </div>
            </Tooltip>

            {/* ENHANCED SEARCH DROPDOWN */}
            <AnimatePresence>
              {isSearchFocused && query.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[400px] overflow-y-auto"
                >
                  {!hasResults ? (
                    <Empty 
                      image={Empty.PRESENTED_IMAGE_SIMPLE} 
                      description="No results found"
                      className="py-8"
                    />
                  ) : (
                    <div className="py-2">
                      {Object.entries(searchResults).map(([category, items]) => (
                        <div key={category}>
                          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            {category}
                          </div>
                          {items.map((item, idx) => (
                            <motion.div
                              key={idx}
                              whileHover={{ x: 4 }}
                              onClick={() => handleSearchClick(item)}
                              className="px-4 py-3 mx-2 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 group"
                            >
                              <div className={`
                                p-2 rounded-lg 
                                ${item.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}
                              `}>
                                {item.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {item.title}
                                  </span>
                                  {item.hot && (
                                    <Tag color="red" className="text-xs">HOT</Tag>
                                  )}
                                  {item.external && (
                                    <ExternalLink size={12} className="text-gray-400" />
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {item.description}
                                </p>
                              </div>
                              <ChevronRight size={16} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                          ))}
                          <Divider className="my-2" />
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2">
            
            {/* MAIN NAV ICONS */}
            <nav className="hidden md:flex items-center gap-1">
              {mainNavItems.map((item) => (
                <Tooltip key={item.key} title={item.tooltip} placement="bottom">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(item.path)}
                    className={`
                      p-2.5 rounded-xl transition-all relative
                      ${location.pathname === item.path 
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30" 
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-500"
                      }
                    `}
                  >
                    <item.icon size={20} />
                    {location.pathname === item.path && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"
                      />
                    )}
                  </motion.button>
                </Tooltip>
              ))}

              {/* RESOURCES DROPDOWN */}
              <Tooltip title="More resources" placement="bottom">
                <Dropdown 
                  menu={{ items: resourceMenuItems }} 
                  placement="bottomRight"
                  arrow
                  trigger={["click"]}
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-500 transition-all"
                  >
                    <MoreHorizontal size={20} />
                  </motion.button>
                </Dropdown>
              </Tooltip>
            </nav>

            <Divider type="vertical" className="hidden md:block h-6 bg-gray-300 dark:bg-gray-600" />

            {/* QUICK ACTIONS */}
            <Tooltip title="Contact via WhatsApp" placement="bottom">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWhatsAppRedirect}
                className="hidden md:flex p-2.5 rounded-xl text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
              >
                <Badge dot color="green">
                  <FaWhatsapp size={20} />
                </Badge>
              </motion.button>
            </Tooltip>

            <Tooltip title="Toggle theme" placement="bottom">
              <div className="hidden md:block p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                <ThemeToggle />
              </div>
            </Tooltip>

            {/* USER MENU (placeholder) */}
            <Tooltip title="Account" placement="bottom">
              <Dropdown
                menu={{
                  items: [
                    { key: "profile", icon: <User size={16} />, label: "Profile" },
                    { key: "settings", icon: <Settings size={16} />, label: "Settings" },
                    { type: "divider" },
                    { key: "logout", icon: <LogOut size={16} />, label: "Sign out", danger: true },
                  ],
                }}
                placement="bottomRight"
                arrow
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="hidden md:flex w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center cursor-pointer text-white font-semibold text-sm"
                >
                  SM
                </motion.div>
              </Dropdown>
            </Tooltip>

            {/* MOBILE MENU BUTTON */}
            <Tooltip title="Menu" placement="bottom">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setMenuOpen(true)}
                className="md:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <Menu size={24} />
              </motion.button>
            </Tooltip>
          </div>
        </div>
      </motion.header>

      {/* -------------------------------------------------------- */}
      {/* MOBILE MENU DRAWER - RICH UI */}
      {/* -------------------------------------------------------- */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* DRAWER */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl z-50 max-h-[85vh] overflow-hidden flex flex-col"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* DRAG HANDLE */}
              <div className="w-full flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
              </div>

              {/* HEADER */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <Avatar src="/new.jpeg" size={40} />
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white">SwiftMeta</h2>
                    <p className="text-xs text-gray-500">Menu</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* SEARCH */}
              <div className="px-6 py-4">
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl">
                  <Search size={18} className="text-gray-400 mr-3" />
                  <input
                    placeholder="Search..."
                    className="flex-1 bg-transparent outline-none dark:text-white"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* SCROLLABLE CONTENT */}
              <div className="flex-1 overflow-y-auto px-6 pb-6">
                
                {/* QUICK ACTIONS GRID */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {[
                    { icon: Home, label: "Home", path: "/", color: "bg-blue-500" },
                    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", color: "bg-purple-500" },
                    { icon: Send, label: "Apply", path: "/apply", color: "bg-green-500" },
                    { icon: Ticket, label: "Tickets", path: "/ticket", color: "bg-orange-500" },
                  ].map((item) => (
                    <motion.button
                      key={item.label}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        navigate(item.path);
                        setMenuOpen(false);
                      }}
                      className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 active:scale-95 transition-all"
                    >
                      <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                        <item.icon size={24} />
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* MAIN LINKS */}
                <div className="space-y-2 mb-6">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Navigation</h3>
                  {[
                    { name: "Blog", path: "/dashboard/blog", icon: BookOpen, desc: "Latest articles" },
                    { name: "Contact", path: "/contact", icon: MessageCircle, desc: "Get in touch" },
                    { name: "Server/API", path: "/server-api", icon: ServerCog, desc: "Developer docs" },
                    { name: "Weather", path: "/weather", icon: Cloud, desc: "Local forecast" },
                  ].map((item) => (
                    <motion.div
                      key={item.name}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        navigate(item.path);
                        setMenuOpen(false);
                      }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400">
                        <item.icon size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </motion.div>
                  ))}
                </div>

                {/* EXTERNAL LINKS */}
                <div className="space-y-2 mb-6">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Resources</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: "Cloudinary", url: "https://cloudinary.com", color: "text-blue-500" },
                      { name: "MongoDB", url: "https://mongodb.com", color: "text-green-500" },
                      { name: "GitHub", url: "https://github.com", color: "text-gray-900 dark:text-white" },
                      { name: "Vercel", url: "https://vercel.com", color: "text-black dark:text-white" },
                    ].map((item) => (
                      <a
                        key={item.name}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                      >
                        <span className={item.color}>{item.name}</span>
                        <ExternalLink size={12} className="text-gray-400" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* DONATE CTA */}
                <motion.a
                  href="/pay-donation"
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold shadow-lg shadow-rose-500/25 mb-6"
                >
                  <span>Support Us</span>
                  <span>❤️</span>
                </motion.a>

                {/* SOCIAL LINKS */}
                <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileTap={{ scale: 0.9 }}
                      onClick={social.onClick ? handleWhatsAppRedirect : undefined}
                      className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 ${social.color} transition-all`}
                    >
                      <social.icon size={20} />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* BOTTOM SAFE AREA */}
              <div className="h-6 bg-white dark:bg-gray-900" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
