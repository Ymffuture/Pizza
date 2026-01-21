import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ token, onSelectConversation }) => {
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

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="
          fixed top-0 right-0 z-40
          h-full w-72
          bg-gray-50 dark:bg-gray-900
          border-l border-gray-200 dark:border-gray-700
          p-4
          shadow-xl
        "
      >
        <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
          Your Conversations
        </h3>

        <ul className="flex flex-col gap-2 overflow-y-auto">
          {conversations.map((c) => (
            <li
              key={c._id}
              onClick={() => onSelectConversation(c._id)}
              className="
                cursor-pointer
                rounded-lg px-3 py-2
                text-sm
                hover:bg-gray-200 dark:hover:bg-gray-800
                transition
              "
            >
              {c.title || "Untitled"}
            </li>
          ))}
        </ul>
      </motion.aside>
    </AnimatePresence>
  );
};

export default Sidebar;
