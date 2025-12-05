import { Outlet, Link } from "react-router-dom";
import { Dropdown } from "antd";
import { FilePlus, User, LogIn, UserPlus, MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../../../api";
import Home from "../../../components/BlogHome";

export default function Pricing() {
  const [user, setUser] = useState(null);

  // Load current logged-in user from MongoDB (JWT stored in localStorage)
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await api.get("/auth/me"); // MUST return user: {name, email, avatar}
        setUser(res.data.user || null);
      } catch {
        setUser(null);
      }
    }
    loadUser();
  }, []);

  // Logout from MongoDB-based auth
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); // OPTIONAL depending on backend
    } catch (e) {
      /* ignore */
    }
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/dashboard/blog/login";
  };

  // MOBILE DROPDOWN MENU
  const menu = (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">

      {!user && (
        <>
          <Link to="/dashboard/blog/login">
            <button className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
              <LogIn size={18} /> Login
            </button>
          </Link>

          <Link to="/dashboard/blog/register">
            <button className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
              <UserPlus size={18} /> Register
            </button>
          </Link>
        </>
      )}

      <Link to="/dashboard/blog/new">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
          <FilePlus size={18} /> New Post
        </button>
      </Link>

      {user && (
        <>
          <Link to="/dashboard/blog/profile">
            <button className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
              <User size={18} /> Profile
            </button>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="text-gray-900 dark:text-white mx-auto w-full">

      {/* NAVBAR */}
      <nav className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-2xl border border-gray-200 dark:border-gray-800 p-3 sm:p-4 rounded-2xl shadow-md flex justify-between items-center">

        <Link to="/" className="text-lg font-semibold hover:opacity-80">
          SwiftMeta Blog
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-5 text-sm font-medium pr-2">

          {!user && (
            <>
              <Link to="/dashboard/blog/login" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
                <LogIn size={15}/> Login
              </Link>

              <Link to="/dashboard/blog/register" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
                <UserPlus size={15}/> Register
              </Link>
            </>
          )}

          <Link to="/dashboard/blog/new" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
            <FilePlus size={15}/> Post
          </Link>

          {user && (
            <>
              <Link to="/dashboard/blog/profile" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
                <User size={15}/> Profile
              </Link>

              <button
                onClick={handleLogout}
                className="hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1"
              >
                Logout
              </button>
            </>
          )}

        </div>

        {/* MOBILE */}
        <div className="md:hidden">
          <Dropdown overlay={menu} trigger={["click"]} placement="topRight">
            <MoreHorizontal
              size={28}
              className="cursor-pointer text-gray-700 dark:text-gray-300 active:scale-95 transition-transform"
            />
          </Dropdown>
        </div>

      </nav>

      <main className="mt-4">
        <Outlet />
      </main>

      <main className="mt-4">
        <Home />
      </main>
    </div>
  );
}
