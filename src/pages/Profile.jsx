import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { api } from "../api";
import { LogOut, Image } from "react-icons/fa";
import { Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../layouts/lib/supabaseClient";

export default function Profile() {
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(()=> {
    supabase.auth.getUser().then(({data})=> setUser(data.user));
  },[]);

  const menu = (
    <div className="bg-white dark:bg-black rounded-2xl shadow-xl overflow-hidden w-40">
      <Link to="/dashboard/blog/profile">
        <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
          <UserCircle size={18}/> Profile
        </button>
      </Link>
      <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50">
        <LogOut size={18}/> Logout
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center p-6">
      <div className="relative">
        <Dropdown overlay={menu} trigger={["click"]} placement="topCenter">
          <img 
            src={user?.user_metadata?.avatar_url || "/default-avatar.png"} 
            className="w-24 h-24 rounded-full object-cover border dark:border-gray-700 cursor-pointer"
          />
        </Dropdown>
      </div>
      <h3 className="text-xl mt-4">{user?.email}</h3>
    </div>
  );
}
