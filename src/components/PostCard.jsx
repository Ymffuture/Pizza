import React, { useState, useEffect } from "react";
import { api, setToken } from "../api";
import toast from "react-hot-toast";
import { Heart } from "lucide-react";

export default function PostCard({ post, onRefresh }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

  useEffect(() => {
    // If backend returns liked state, it's ideal to set here:
    if (post.liked !== undefined) setLiked(post.liked);
  }, [post.liked]);

  async function toggleLike() {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login first");
    setToken(token);

    try {
      const res = await api.post(`/posts/${post._id}/toggle-like`);
      setLikesCount(res.data.likesCount);
      setLiked(res.data.liked);
      onRefresh?.(); 
    } catch (err) {
      toast.error("Could not like");
    }
  }

  return (
    <article className="bg-white dark:bg-[#121212] rounded-2xl shadow-sm dark:shadow-none p-4 transition-all duration-300">

      {/* Author bar */}
      <header className="flex justify-between items-center mb-3">
        <strong className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {post.author?.name || post.author?.phone || "Unknown"}
        </strong>
        <time className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(post.createdAt).toLocaleString()}
        </time>
      </header>

      {/* Content */}
      <h3 className="text-xl font-bold text-gray-950 dark:text-white mb-2 tracking-tight">
        {post.title}
      </h3>
      <p className="text-sm text-gray-800 dark:text-gray-300 leading-relaxed mb-3">
        {post.body}
      </p>

      {/* Media grid */}
      {post.images?.length > 0 && (
        <section className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
          {post.images.map((img) => (
            <img
              key={img}
              src={img}
              alt={post.title}
              className="w-full h-28 object-cover rounded-xl bg-gray-100 dark:bg-gray-800"
              loading="lazy"
            />
          ))}
        </section>
      )}

      {/* Like Bar */}
      <footer className="flex items-center">
        <button
          onClick={toggleLike}
          aria-label="Toggle like"
          className={`flex items-center gap-1 px-2 py-1 text-sm font-medium rounded-full transition-transform active:scale-90 ${
            liked 
              ? "text-red-600 dark:text-red-500" 
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Heart size={18} className={liked ? "fill-current" : ""} />
          <span>{likesCount}</span>
        </button>
      </footer>

    </article>
  );
}
