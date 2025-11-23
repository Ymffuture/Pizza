import { NavLink } from "react-router-dom";

export default function SidebarItem({ label, to, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        flex items-center gap-3 px-4 py-3 rounded-xl
        transition-all
        ${isActive 
          ? "bg-black text-white dark:bg-white dark:text-black" 
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-800/40"}
        `
      }
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  );
}
