import { Outlet, Link, useLocation } from "react-router-dom";
import { Dropdown, Button, Badge } from "antd";
import { 
  FilePlus, 
  User, 
  LogIn, 
  UserPlus, 
  MoreHorizontal,
  Home,
  ChevronRight,
  Sparkles,
  BookOpen,
  PenTool
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../../layouts/lib/supabaseClient";
import Home from "../../../components/BlogHome";

// Smart Navigation Item Component
const NavItem = ({ to, icon: Icon, label, isActive, badge }) => (
  <Link to={to} className="relative group">
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
        ${isActive 
          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm" 
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
        }
      `}
    >
      <Icon size={18} className={isActive ? "animate-pulse" : ""} />
      <span>{label}</span>
      {badge && (
        <Badge count={badge} className="ml-1" style={{ backgroundColor: '#3b82f6' }} />
      )}
      {isActive && (
        <motion.div 
          layoutId="activeNav"
          className="absolute inset-0 rounded-xl border-2 border-blue-500/20 pointer-events-none"
        />
      )}
    </motion.div>
  </Link>
);

// Mobile Menu Item
const MobileMenuItem = ({ to, icon: Icon, label, onClick, variant = "default" }) => {
  const isDanger = variant === "danger";
  
  return (
    <Link to={to} onClick={onClick}>
      <motion.button
        whileTap={{ scale: 0.98 }}
        className={`
          flex items-center gap-3 w-full px-4 py-3.5 text-sm font-medium transition-colors
          ${isDanger 
            ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" 
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          }
        `}
      >
        <div className={`
          w-8 h-8 rounded-lg flex items-center justify-center
          ${isDanger ? "bg-red-100 dark:bg-red-900/30" : "bg-gray-100 dark:bg-gray-800"}
        `}>
          <Icon size={18} className={isDanger ? "text-red-500" : "text-gray-500 dark:text-gray-400"} />
        </div>
        {label}
        <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.button>
    </Link>
  );
};

export default function BlogLayout() {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null));
    
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/signup";
  };

  const isActive = (path) => location.pathname.includes(path);

  // Mobile dropdown menu
  const mobileMenu = (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden w-64"
    >
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
      </div>
      
      <div className="py-2">
        <MobileMenuItem 
          to="/dashboard/blog/login" 
          icon={LogIn} 
          label="Sign In"
          onClick={() => setMobileMenuOpen(false)}
        />
        <MobileMenuItem 
          to="/dashboard/blog/register" 
          icon={UserPlus} 
          label="Create Account"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className="my-2 border-t border-gray-100 dark:border-gray-800" />
        <MobileMenuItem 
          to="/dashboard/blog/new" 
          icon={FilePlus} 
          label="New Post"
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {user && (
          <>
            <div className="my-2 border-t border-gray-100 dark:border-gray-800" />
            <MobileMenuItem 
              to="/dashboard/blog/profile" 
              icon={User} 
              label="My Profile"
              onClick={() => setMobileMenuOpen(false)}
            />
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-3.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width={18} height={18} stroke="currentColor" fill="none" strokeWidth={2}>
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              Sign Out
            </button>
          </>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      
      {/* Floating Navigation Bar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled 
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-gray-200 dark:border-gray-800" 
            : "bg-transparent"
          }
        `}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div 
                whileHover={{ rotate: 5 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20"
              >
                <BookOpen className="w-5 h-5 text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  SwiftMeta
                </h1>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 -mt-1">Blog Platform</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <NavItem 
                to="/dashboard/blog" 
                icon={Home} 
                label="Home" 
                isActive={location.pathname === "/dashboard/blog"} 
              />
              <NavItem 
                to="/dashboard/blog/new" 
                icon={PenTool} 
                label="Write" 
                isActive={isActive("new")}
              />
              
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />
              
              {!user ? (
                <>
                  <NavItem 
                    to="/dashboard/blog/login" 
                    icon={LogIn} 
                    label="Sign In" 
                    isActive={isActive("login")}
                  />
                  <Link to="/dashboard/blog/register">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="ml-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      <Sparkles size={16} />
                      Get Started
                    </motion.button>
                  </Link>
                </>
              ) : (
                <Dropdown 
                  overlay={
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 p-2 w-48">
                      <Link to="/dashboard/blog/profile">
                        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <User size={16} />
                          Profile
                        </button>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" width={16} height={16} stroke="currentColor" fill="none" strokeWidth={2}>
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  }
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                      {user.email?.[0].toUpperCase() || "U"}
                    </div>
                    <span className="hidden lg:inline">{user.email?.split("@")[0]}</span>
                  </motion.button>
                </Dropdown>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Dropdown 
                overlay={mobileMenu} 
                trigger={["click"]}
                open={mobileMenuOpen}
                onOpenChange={setMobileMenuOpen}
                placement="bottomRight"
              >
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  <MoreHorizontal size={24} />
                </motion.button>
              </Dropdown>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
              <Sparkles size={16} />
              <span>Welcome to our knowledge hub</span>
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight"
          >
            Explore Ideas,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Share Stories
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Discover insights on web development, system architecture, and modern programming. 
            Join our community of developers and creators.
          </motion.p>

          {/* Quick Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500 dark:text-gray-400"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Live Platform</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
            <span>100+ Articles</span>
            <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
            <span>Weekly Updates</span>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-200 dark:border-gray-800 overflow-hidden"
        >
          {/* Sub-navigation or Breadcrumbs could go here */}
          <div className="p-6 sm:p-8">
            <Outlet />
          </div>
        </motion.div>
        
        {/* Home Component */}
        <div className="mt-8">
          <Home />
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} SwiftMeta Blog. Built with care.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">Home</Link>
            <Link to="/dashboard/blog/new" className="hover:text-gray-900 dark:hover:text-white transition-colors">Write</Link>
            <a href="mailto:swiftmetaagency@gmail.com" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
