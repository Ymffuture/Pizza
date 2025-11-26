import { useEffect, useState } from "react";
import { supabase } from "../../layouts/lib/supabaseClient";
import SidebarItem from "./SidebarItem";
import {
  Globe,
  BadgeDollarSign,
  FolderOpen,
  LogOut,
  Home,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // MOBILE NAV ITEMS
  const navItems = [
    { label: "Home", to: "/dashboard", icon: <Home size={20} /> },
    { label: "Build", to: "/dashboard/build", icon: <Globe size={20} /> },
    { label: "Blog", to: "/dashboard/blog", icon: <BadgeDollarSign size={20} /> },
    { label: "Projects", to: "/dashboard/projects", icon: <FolderOpen size={20} /> },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className="
          w-72 hidden md:flex flex-col justify-between
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          p-6 shadow-sm
        "
      >
        <div>
          {user && (
            <div className="flex items-center gap-3 mb-8">
              <img
                src={user.user_metadata?.avatar_url || "/default-avatar.png"}
                alt="Profile"
                className="w-14 h-14 rounded-full object-cover border border-gray-300 dark:border-gray-700"
              />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {user.user_metadata?.full_name || "User"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <SidebarItem label="Build Website" to="/dashboard/build" icon={<Globe />} />
            <SidebarItem label="Blog" to="/dashboard/blog" icon={<BadgeDollarSign />} />
            <SidebarItem label="Free Projects" to="/dashboard/projects" icon={<FolderOpen />} />
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="
            flex items-center gap-3 px-4 py-3
            text-red-600 dark:text-red-400
            hover:bg-red-100 dark:hover:bg-red-900/30
            rounded-xl transition-all
          "
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* MOBILE APPLE-STYLE BOTTOM NAV */}
      <div
        className="
          md:hidden fixed bottom-0 left-0 w-full 
          bg-white/80 dark:bg-gray-900/80
          backdrop-blur-xl border-t border-gray-200 dark:border-gray-800
          flex justify-around py-3 z-20
        "
      >
        {navItems.map((item) => {
          const active = location.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              className="
                flex flex-col items-center gap-1 transition-all
              "
            >
              <div
                className={`
                  p-2 rounded-2xl 
                  ${active ? "bg-black dark:bg-white text-white dark:text-black" : "text-gray-600 dark:text-gray-300"}
                  transition-all
                `}
              >
                {item.icon}
              </div>
              <span
                className={`
                  text-xs 
                  ${active ? "font-semibold text-black dark:text-white" : "text-gray-500 dark:text-gray-400"}
                `}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
