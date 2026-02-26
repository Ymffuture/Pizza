import { Outlet, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FiFileText, FiClock, FiLayers } from "react-icons/fi";

export default function ApplicantLayout() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] pt-24 transition-colors duration-500">
      {/* Glassmorphism Navigation */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
        <div className="max-w-5xl mx-auto">
          <nav className="bg-white/70 dark:bg-[#1a1a1a]/70 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-2xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)] px-2 py-2 flex items-center gap-1">
            <NavItem to="/apply" icon={<FiFileText size={18} />} label="Apply" />
            <NavItem to="/apply/status" icon={<FiClock size={18} />} label="Last Lessons" />
            <NavItem to="/lessons/subject-to-register" icon={<FiLayers size={18} />} label="Our Subjects" />
          </nav>
        </div>
      </motion.header>

      {/* Main Content with staggered reveal */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="p-6 max-w-5xl mx-auto"
      >
        <Outlet />
      </motion.main>
    </div>
  );
}

/* ---------------------------------------------------
   NAV ITEM — Kimi-style Pill Navigation
--------------------------------------------------- */
function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ease-out
        ${isActive 
          ? "text-[#1a1a1a] dark:text-white bg-black/[0.06] dark:bg-white/[0.08] shadow-sm" 
          : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`transition-transform duration-300 ${isActive ? "scale-110" : "scale-100"}`}>
            {icon}
          </span>
          <span className="tracking-tight">{label}</span>
          
          {/* Active dot indicator */}
          {isActive && (
            <motion.span
              layoutId="active-nav"
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current opacity-60"
              transition={{ type: "spring", stiffness: 600, damping: 30 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
}
