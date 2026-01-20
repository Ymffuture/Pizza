import React, { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "./lib/supabaseClient";

const Sidebar = ({ token, onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchConversations = async () => {
      try {
        const res = await axios.get("https://swiftmeta.onrender.com/api/conversations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConversations(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchConversations();
  }, [token]);

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-900">
      <h3 className="font-bold mb-3">Your Conversations</h3>
      <ul className="flex flex-col gap-2">
        {conversations.map((c) => (
          <li
            key={c._id}
            onClick={() => onSelectConversation(c._id)}
            className="cursor-pointer p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            {c.title || "Untitled"}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
