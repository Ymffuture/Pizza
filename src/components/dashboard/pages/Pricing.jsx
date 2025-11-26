import { Outlet, Link } from "react-router-dom";
import { Dropdown } from "antd";
import { Menu, FilePlus, User, LogIn, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../../../layouts/lib/supabaseClient";

export default function Pricing() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const mobileMenu = {
    overlay: (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 w-44 overflow-hidden">
        <Link to="/dashboard/blog/login">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
            <LogIn size={18}/> Login
          </button>
        </Link>
        <Link to="/dashboard/blog/register">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
            <UserPlus size={18}/> Register
          </button>
        </Link>
        <Link to="/dashboard/blog/new">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
            <FilePlus size={18}/> New Post
          </button>
        </Link>

        {user && (
          <>
            <Link to="/dashboard/blog/profile">
              <button className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                <User size={18}/> Profile
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut size={18}/> Logout
            </button>
          </>
        )}
      </div>
    ),
    trigger: ["click"],
    placement: "topRight"
  };

  return (
    <>
    <div className="
      px-5 sm:px-8 md:px-12 py-8
      text-gray-900 dark:text-white
      max-w-5xl mx-auto
    ">
      {/* Hero text section */}
      <header className="text-center space-y-4 mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          SwiftMeta
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
          Explore our plans, features, and smart website-building tools.
        </p>
      </header>

      {/* Navbar Section */}
      <nav className="
        bg-white/70 dark:bg-gray-900/60 backdrop-blur-2xl
        border border-gray-200 dark:border-gray-800
        p-3 sm:p-4 rounded-2xl shadow-md
        flex justify-between items-center
      ">
        <Link to="/" className="text-lg font-semibold hover:opacity-80">
          SwiftMeta Blog
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-5 text-sm font-medium pr-2">
          <Link to="/dashboard/blog/login" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
            <LogIn size={15}/> Login
          </Link>
          <Link to="/dashboard/blog/register" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
            <UserPlus size={15}/> Register
          </Link>
          <Link to="/dashboard/blog/new" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
            <FilePlus size={15}/> Post
          </Link>
          {user && (
            <Link to="/dashboard/blog/profile" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
              <User size={15}/> Profile
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Dropdown {...mobileMenu}>
            <Menu size={26} className="text-gray-700 dark:text-gray-200 active:scale-95 transition-transform"/>
          </Dropdown>
        </div>
      </nav>

      {/* Content Area */}
      <main className="mt-10 min-h-[60vh]">
        <Outlet/>
      </main>
    </div>
    </>
  );
}
