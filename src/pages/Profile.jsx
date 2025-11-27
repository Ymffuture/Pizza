
import React, { useState, useEffect } from "react";
import { Dropdown } from "antd";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../../layouts/lib/supabaseClient";
import { UserCircle, LogOut } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        toast.error("Failed to load user");
      } else {
        setUser(data.user);
      }
    });
  }, []);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Logout failed");
      return;
    }
    toast.success("Logged out successfully");
    nav("/dashboard/blog/login");
  }

  const menu = {
    items: [
      {
        key: "profile",
        label: (
          <Link to="/dashboard/blog/profile" className="flex items-center gap-2">
            <UserCircle size={18} /> <span>Profile</span>
          </Link>
        ),
      },
      {
        key: "logout",
        label: (
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 w-full">
            <LogOut size={18} /> <span>Logout</span>
          </button>
        ),
      },
    ],
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-4 bg-[#f5f5f7] dark:bg-black">
      {/* Profile Card */}
      <div className="w-full max-w-sm bg-white dark:bg-[#111] rounded-3xl shadow-2xl p-6 flex flex-col items-center transition-all">

        {/* Avatar */}
        <div className="relative">
          <Dropdown {...menu} trigger={["click"]} placement="bottomCenter">
            <img
              src={user?.user_metadata?.avatar_url || "/default-avatar.png"}
              alt="User avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:scale-105 transition-transform"
            />
          </Dropdown>
        </div>

        {/* Email */}
        <h3 className="text-xl font-semibold mt-4 break-all text-center text-gray-900 dark:text-white">
          {user?.email || "Loading user..."}
        </h3>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
          Click avatar to open menu
        </p>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-black dark:bg-white text-white dark:text-black py-2.5 rounded-2xl font-medium hover:opacity-80 active:scale-95 transition-all flex justify-center items-center gap-2"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

      </div>
    </div>
  );
}
