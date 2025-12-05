import { Outlet, Link } from "react-router-dom";
import { Dropdown } from "antd";
import { FilePlus, User, LogIn, UserPlus, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../../../api";
import Home from "../../../components/BlogHome";

export default function Pricing() {
  const [user, setUser] = useState(null);

  // Load logged-in MongoDB user
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user || null);
      } catch {
        setUser(null);
      }
    }
    loadUser();
  }, []);

  // MongoDB logout
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/dashboard/blog/login";
  };

  // AVATAR DROPDOWN
  const avatarMenu = (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">

      <div className="px-4 py-3 border-b dark:border-gray-700">
        <p className="font-medium text-sm">{user?.name}</p>
        <p className="text-xs text-gray-500">{user?.email}</p>
      </div>

      <Link to="/dashboard/blog/profile">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
          <User size={16} /> Profile
        </button>
      </Link>

      <Link to="/dashboard/blog/new">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
          <FilePlus size={16} /> New Post
        </button>
      </Link>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <LogOut size={16} /> Logout
      </button>

    </div>
  );

  return (
    <div className="text-gray-900 dark:text-white mx-auto w-full">

      {/* NAV */}
      <nav className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-2xl border border-gray-200 dark:border-gray-800 p-3 sm:p-4 rounded-2xl shadow-md flex justify-between items-center">

        <Link to="/" className="text-lg font-semibold hover:opacity-80">
          SwiftMeta Blog
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-5 items-center text-sm font-medium pr-2">

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
            <Dropdown overlay={avatarMenu} trigger={["click"]} placement="bottomRight">
              <img
                src={user?.avatar || "https://via.placeholder.com/40"}
                alt="avatar"
                className="w-10 h-10 rounded-full border dark:border-gray-700 cursor-pointer hover:opacity-80 transition"
              />
            </Dropdown>
          )}
        </div>

        {/* MOBILE MENU */}
        <div className="md:hidden flex items-center">
          {user ? (
            <Dropdown overlay={avatarMenu} trigger={["click"]} placement="bottomRight">
              <img
                src={user?.avatar || "https://via.placeholder.com/36"}
                className="w-10 h-10 rounded-full border dark:border-gray-700 cursor-pointer"
              />
            </Dropdown>
          ) : (
            <Dropdown
              overlay={
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
                  <Link to="/dashboard/blog/login">
                    <button className="w-full px-4 py-3 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <LogIn size={16}/> Login
                    </button>
                  </Link>

                  <Link to="/dashboard/blog/register">
                    <button className="w-full px-4 py-3 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <UserPlus size={16}/> Register
                    </button>
                  </Link>
                </div>
              }
              trigger={["click"]}
              placement="bottomRight"
            >
              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            </Dropdown>
          )}
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
