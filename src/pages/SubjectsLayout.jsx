import { Outlet, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FiFileText, FiClock } from "react-icons/fi";

export default function ApplicantLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 transition-colors duration-300">
      {/* Applicant Navigation */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm p-4"
      >
        <nav className="max-w-5xl mx-auto flex gap-6">
          <NavItem
            to="/apply"
            icon={<FiFileText />}
            label="Apply"
          />
          <NavItem
            to="/lessons"
            icon={<FiClock />}
            label="Last lessons"
          />

          
          <NavItem
            to="/lessons/subject-to-register"
            icon={""}
            label="our Subjects" 
          />
        </nav>
      </motion.header>

      {/* Page content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="p-6 max-w-5xl mx-auto"
      >
        <Outlet />
      </motion.main>
    </div>
  );
}

/* ---------------------------------------------------
   NAV ITEM (Animated + Active State)
--------------------------------------------------- */
function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors
        ${
          isActive
            ? "text-black dark:text-white"
            : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className="text-lg">{icon}</span>
          <span>{label}</span>

          {/* Active underline (Apple-style subtle indicator) */}
          {isActive && (
            <motion.span
              layoutId="nav-indicator"
              className="absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-black dark:bg-white"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
}
