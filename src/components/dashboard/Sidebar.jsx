import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import SidebarItem from "./SidebarItem";
import {
  LayoutDashboard,
  Globe,
  BadgeDollarSign,
  FolderOpen,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/"; // go home
  };

  return (
    <aside
      className="
        w-72 hidden md:flex flex-col justify-between
        bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
        p-6 shadow-sm
      "
    >
      {/* TOP SECTION */}
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
          <SidebarItem label="Price Range" to="/dashboard/pricing" icon={<BadgeDollarSign />} />
          <SidebarItem label="Free Projects" to="/dashboard/projects" icon={<FolderOpen />} />
        </div>
      </div>

      {/* LOGOUT BUTTON */}
      <button
        onClick={handleLogout}
        className="
          flex items-center gap-3 px-4 py-3 mt-10
          text-red-600 dark:text-red-400
          hover:bg-red-100 dark:hover:bg-red-900/30
          rounded-xl transition-all
        "
      >
        <LogOut size={20} /> Logout
      </button>
    </aside>
  );
}
