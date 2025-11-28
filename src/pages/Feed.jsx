import React, { useEffect, useState } from "react";
import { api } from "../api";
import PostCard from "../components/PostCard";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to load posts", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="bg-white dark:bg-black transition-colors duration-300">
      {/* Feed container */}
      <div className="mx-auto max-w-[470px] px-4 pt-6 pb-4">

        {/* Header Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[26px] font-semibold text-gray-900 dark:text-white tracking-tight">
            Feed
          </h2>
          
          {/* Placeholder for future profile icon or menu */}
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800"></div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Loading posts...
          </div>
        )}

        {/* Posts List */}
        {!loading && (
          <div className="space-y-5 opacity-100 transition-opacity duration-500">
            {posts.map((p) => (
              <PostCard key={p._id} post={p} />
            ))}

            {/* Empty Feed */}
            {posts.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 pt-10">
                No posts yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
