import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "https://swiftmeta.onrender.com/api";

const Sidebar = ({ token, onSelectConversation, onLogout }) => {
  const [conversations, setConversations] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch conversations
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API_BASE}/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setConversations(res.data))
      .catch(console.error);
  }, [token]);

  // Fetch user profile
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, [token]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_BASE}/auth/v2/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch {
      // token already invalid — safe to ignore
    } finally {
      onLogout(); // 🔥 parent handles everything
    }
  };

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 40, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="
          fixed top-0 right-0 z-40
          h-full w-72
          px-4 py-5
          flex flex-col
          bg-white/70 dark:bg-neutral-900/70
          backdrop-blur-xl
          border-l border-black/5 dark:border-white/10
          shadow-xl
        "
      >
        {/* USER INFO */}
        {user && (
          <div className="flex items-center gap-3 mb-5 px-2">
            <img
              src={user.avatar || "/avatar.png"}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="leading-tight">
              <p className="text-sm font-semibold truncate">
                {user.email}
              </p>
              <p className="text-xs text-neutral-500">Signed in</p>
            </div>
          </div>
        )}

        <h3 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          History
        </h3>

        {/* CONVERSATIONS */}
        <ul className="flex-1 space-y-1 overflow-y-auto scrollbar-none">
          {conversations.map((c) => (
            <li
              key={c._id}
              onClick={() => onSelectConversation(c._id)}
              className="
                cursor-pointer rounded-xl px-3 py-2 text-sm
                hover:bg-black/5 dark:hover:bg-white/10
                transition
              "
            >
              <span className="block truncate">
                {c.title || "Untitled"}
              </span>
            </li>
          ))}
        </ul>

        <div className="my-4 h-px bg-black/5 dark:bg-white/10" />

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="
            w-full rounded-xl px-4 py-2.5 text-sm font-medium
            text-red-600 dark:text-red-400
            hover:bg-red-500/10 transition
          "
        >
          Log out
        </button>
      </motion.aside>
    </AnimatePresence>
  );
};

export default Sidebar;
