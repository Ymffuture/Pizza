import React, { useState, useEffect } from "react";
import { Dropdown } from "antd";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../layouts/lib/supabaseClient";
import { UserCircle, LogOut } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        toast.error("Failed to load user");
        return;
      }
      setUser(data.user);
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
            <UserCircle size={18} />
            <span>Profile</span>
          </Link>
        ),
      },
      {
        key: "logout",
        label: (
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 w-full">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        ),
      },
    ],
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f2f2f6] dark:bg-black p-4">
      <div className="w-full max-w-[360px] bg-white dark:bg-[#0A0A0A] rounded-[32px] shadow-xl p-6 flex flex-col items-center gap-4 border border-gray-100 dark:border-gray-900">
        
        {/* Avatar with dropdown menu (correct v5 usage) */}
        <Dropdown menu={menu} trigger={["click"]} placement="bottomCenter">
          <img
            src={user?.user_metadata?.avatar_url || "/default-avatar.png"}
            alt="User avatar"
            className="w-28 h-28 rounded-full object-cover cursor-pointer transition hover:scale-[1.03] border border-gray-200 dark:border-gray-800"
          />
        </Dropdown>

        {/* Display Name */}
        <h2 className="text-[22px] font-semibold text-center text-gray-900 dark:text-white">
          {user?.user_metadata?.full_name || "No name"}
        </h2>

        {/* Email */}
        <p className="text-[13px] text-gray-500 dark:text-gray-400 text-center break-all">
          {user?.email}
        </p>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="w-full mt-4 bg-black dark:bg-white text-white dark:text-black py-3 rounded-2xl font-medium flex justify-center items-center gap-2 transition hover:opacity-80 active:scale-95"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>
    </div>
  );
}

