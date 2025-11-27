import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Heart, Send, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { api } from "../api";
import toast from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";

export default function BlogHome() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch posts paginated
  const fetchPosts = async () => {
    try {
      const res = await api.get(`/posts?page=${page}&limit=5`);
      if (res.data.length === 0) setHasMore(false);
      else setPosts(prev => [...prev, ...res.data]);
    } catch {
      toast.error("Failed to load posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  // Infinite scroll trigger
  const fetchMore = () => setPage(prev => prev + 1);

  // Update posts in real-time (poll every 5s)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const latest = await api.get("/posts/latest");
        setPosts(prev => {
          const newPosts = latest.data.filter(lp => !prev.find(p => p._id === lp._id));
          return [...newPosts, ...prev];
        });
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchMore}
      hasMore={hasMore}
      loader={<p className="text-center py-4">Loading...</p>}
    >
      {posts.map(post => (
        <Post key={post._id} post={post} setPosts={setPosts} />
      ))}
    </InfiniteScroll>
  );
}

function Post({ post, setPosts }) {
  const [comments, setComments] = useState(post.comments || []);
  const [text, setText] = useState("");

  const handleLike = async () => {
    try {
      const r = await api.post(`/posts/${post._id}/toggle-like`);
      setPosts(prev => prev.map(p => 
        p._id === post._id ? { ...p, likes: r.data.likes } : p
      ));
    } catch {
      toast.error("Failed to like post");
    }
  };

  const sendComment = async () => {
    if (!text.trim()) return;
    try {
      const r = await api.post(`/posts/${post._id}/comments`, { text });
      setComments(prev => [...prev, r.data]);
      setText("");
    } catch {
      toast.error("Failed to post comment");
    }
  };

  return (
    <article className="bg-white dark:bg-black/60 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-800 mb-5 p-5 max-w-2xl mx-auto transition-all hover:shadow-xl">
      
      {/* Author */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <img
            src={post.author?.avatar || "/default-avatar.png"}
            onError={(e) => e.target.src = "/default-avatar.png"}
            className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-700"
          />
          <div>
            <p className="text-sm font-semibold">{post.author?.name || "Anonymous"}</p>
            <time className="text-[10px] opacity-60">{new Date(post.createdAt).toLocaleString()}</time>
          </div>
        </div>
      </div>

      {/* Content */}
      <h2 className="text-xl font-bold mb-1">{post.title}</h2>
      <p className="text-sm opacity-90 whitespace-pre-line">{post.body}</p>

      {/* Images */}
      {post.images?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
          {post.images.map((img, i) => (
            <img key={i} src={img} alt="post media" className="w-full min-h-[160px] object-cover rounded-2xl"/>
          ))}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex justify-between items-center mt-5">
        <button onClick={handleLike} className="flex items-center gap-2 text-sm font-medium">
          <Heart size={18} fill={post.likes?.length ? "currentColor" : "none"} /> {post.likes?.length || 0}
        </button>
        <span className="text-xs opacity-60">{comments.length} comments</span>
      </div>

      {/* Comment Box */}
      <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-3">
        <div className="flex items-center gap-2">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-gray-800 text-xs focus:outline-none focus:ring-1"
          />
          <button onClick={sendComment} className="bg-black text-white p-2 rounded-full hover:opacity-80 active:scale-95 transition">
            <Send size={16}/>
          </button>
        </div>

        <div className="mt-3 space-y-2">
          {comments.map(c => (
            <div key={c._id} className="flex gap-2 items-start">
              <img
                src={c.author?.avatar || "/default-avatar.png"}
                onError={(e) => e.target.src = "/default-avatar.png"}
                className="w-7 h-7 rounded-full object-cover border border-gray-300 dark:border-gray-700"
              />
              <div className="bg-gray-100 dark:bg-black/50 px-3 py-2 rounded-2xl w-fit max-w-[80%] text-xs">
                <strong className="block mb-1 text-[11px]">{c.author?.name || "User"}</strong>
                {c.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
