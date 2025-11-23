import { NavLink } from "react-router-dom";

export default function SidebarItem({ label, to, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all
        text-gray-700 dark:text-gray-300
        hover:bg-gray-200 dark:hover:bg-gray-800
        ${isActive ? "bg-gray-300 dark:bg-gray-700 font-semibold" : ""}
      `
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
