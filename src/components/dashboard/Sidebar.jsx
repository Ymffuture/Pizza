import React, { useEffect, useState } from "react";
import { supabase } from "../../layouts/lib/supabaseClient";
import SidebarItem from "./SidebarItem";
import {
  Globe,
  MessageCircle,
  FolderOpen,
  LogOut,
  Home,
  UserCircle,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const [showLoading, setShowLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null));
  }, []);

  /* ---------------------------
     LOADING BAR TRIGGER
  ---------------------------- */
  const triggerLoading = () => {
    setShowLoading(true);
    setTimeout(() => setShowLoading(false), 3000);
  };

  const handleLogout = async () => {
    triggerLoading();
    await supabase.auth.signOut();
    toast.success("Goodbye!");
    navigate("/");
  };

  const navItems = [
    { label: "Home", to: "/dashboard", icon: <Home size={20} /> },
    { label: "Build", to: "/dashboard/build", icon: <Globe size={20} /> },
    { label: "Blog", to: "/dashboard/blog", icon: <MessageCircle size={20} /> },
    { label: "Projects", to: "/dashboard/projects", icon: <FolderOpen size={20} /> },
  ];

  return (
    <>
      {/* TOP LOADING BAR */}
      {showLoading && (
        <div className="fixed top-0 left-0 w-full h-[3px] bg-transparent z-50">
          <div className="h-full bg-black dark:bg-white animate-loading-bar" />
        </div>
      )}

      {/* DESKTOP */}
      <aside className="w-80 hidden md:flex flex-col justify-between bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-6">
        <div>
          {user && (
            <div className="flex items-center gap-3 mb-8">
              <img
                src={user.user_metadata?.avatar_url || "/default-avatar.png"}
                alt="Profile"
                className="w-14 h-14 rounded-full object-cover border border-gray-300 dark:border-gray-700"
              />
              <div>
                <p className="font-semibold">
                  {user.user_metadata?.full_name || "User"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <div onClick={triggerLoading}>
              <SidebarItem label="Build Website" to="/dashboard/build" icon={<Globe />} />
            </div>
            <div onClick={triggerLoading}>
              <SidebarItem label="Blog" to="/dashboard/blog" icon={<MessageCircle />} />
            </div>
            <div onClick={triggerLoading}>
              <SidebarItem label="Free Projects" to="/dashboard/projects" icon={<FolderOpen />} />
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 flex justify-around py-3 z-20">
        {navItems.map(({ to, icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={triggerLoading}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={`p-2 rounded-2xl ${
                  active
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {icon}
              </div>
              <span
                className={`text-xs ${
                  active
                    ? "font-semibold text-black dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}

        {user ? (
          <button onClick={triggerLoading} className="flex flex-col items-center gap-1">
            <img
              src={user.user_metadata?.avatar_url || "/default-avatar.png"}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">You</span>
          </button>
        ) : (
          <button
            onClick={() => {
              triggerLoading();
              navigate("/signup");
            }}
            className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300"
          >
            <UserCircle size={28} />
            <span className="text-xs">Sign In</span>
          </button>
        )}
      </div>

      {/* TAILWIND ANIMATION */}
      <style>
        {`
          @keyframes loadingBar {
            from { width: 0%; }
            to { width: 100%; }
          }
          .animate-loading-bar {
            animation: loadingBar 3s linear forwards;
          }
        `}
      </style>
    </>
  );
}
