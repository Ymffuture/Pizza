import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ token, onSelectConversation, onLogout }) => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          "https://swiftmeta.onrender.com/api/conversations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setConversations(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchConversations();
  }, [token]);

  const handleLogout = async () => {
  try {
    await axios.post(
      "https://swiftmeta.onrender.com/api/auth/v2/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (e) {
    // ignore — token may already be invalid
  } finally {
    localStorage.removeItem("token");
    window.location.href = "/";
  }
};


  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 40, opacity: 0 }}
        transition={{
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          fixed top-0 right-0 z-40
          h-full w-72
          px-4 py-5
          flex flex-col

          bg-white/70 dark:bg-neutral-900/70
          backdrop-blur-xl backdrop-saturate-150

          border-l border-black/5 dark:border-white/10
          shadow-[0_10px_30px_rgba(0,0,0,0.08)]

          text-neutral-900 dark:text-neutral-100
        "
      >
        {/* Header */}
        <h3
          className="
            mb-4 px-2
            text-xs font-semibold uppercase tracking-wide
            text-neutral-500 dark:text-neutral-400
          "
        >
          History
        </h3>

        {/* Conversation List */}
        <ul className="flex-1 space-y-1 overflow-y-auto scrollbar-none">
          {conversations.map((c) => (
            <li
              key={c._id}
              onClick={() => onSelectConversation(c._id)}
              className="
                group cursor-pointer
                rounded-xl px-3 py-2
                text-sm font-medium

                hover:bg-black/5 dark:hover:bg-white/10
                active:scale-[0.98]
                transition-all duration-200
              "
            >
              <span
                className="
                  block truncate
                  text-neutral-800 dark:text-neutral-100
                  group-hover:text-neutral-900 dark:group-hover:text-white
                "
              >
                {c.title || "Untitled"}
              </span>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className="my-4 h-px bg-black/5 dark:bg-white/10" />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="
            w-full
            rounded-xl px-4 py-2.5
            text-sm font-medium

            text-red-600 dark:text-red-400
            hover:bg-red-500/10
            active:scale-[0.97]

            transition-all duration-200
          "
        >
          Log out
        </button>
      </motion.aside>
    </AnimatePresence>
  );
};

export default Sidebar;
