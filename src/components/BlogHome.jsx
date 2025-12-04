import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Trash2, Pencil, MoreHorizontal, Send } from "lucide-react";
import { Dropdown } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { api } from "../api";
import toast from "react-hot-toast";

export default function BlogHome() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const nav = useNavigate();

  const fetchPosts = useCallback(async () => {
    try {
      const r = await api.get(`/posts?page=${page}`);
      if (r.data.length <= 0 ) {
        setHasMore(false);
        return;
      }
      setPosts(prev => [...prev, ...r.data]);
    } catch {
      toast.error("Failed to load posts");
    }
  }, [page]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const updatePostComments = (postId, newComments) => {
    setPosts(prev =>
      prev.map(p => (p._id === postId ? { ...p, comments: newComments } : p))
    );
  };

  const menu = (post) => (
    <div className="bg-white dark:bg-black rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 w-36 overflow-hidden text-xs">
      <button
        onClick={() => nav(`/dashboard/blog/edit/${post._id}`)}
        className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Pencil size={14}/> Edit
      </button>
      <button
        onClick={async () => {
          await api.delete(`/posts/${post._id}`);
          setPosts(posts.filter(p => p._id !== post._id));
          toast.success("Post deleted");
        }}
        className="flex items-center gap-2 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
      >
        <Trash2 size={14}/> Delete
      </button>
    </div>
  );
const Loader = () => (
  <div className="flex flex-col items-center justify-center min-h-[120px] bg-transparent overflow-hidden">
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-spin text-gray-300 dark:text-gray-700 w-16 h-16 shrink-0"
    >
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="250"
        strokeDashoffset="180"
      />
      <circle cx="50" cy="50" r="10" fill="currentColor">
        <animate
          attributeName="r"
          values="10;14;10"
          dur="4.8s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="1;0.6;1"
          dur="2.6s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
    <p className="text-gray-800 dark:text-gray-400 mt-3 text-sm tracking-wide">
      Loading Blogs...
    </p>
  </div>
);

  
  return (
    <div className="min-h-screen pb-28 md:pb-2 mx-auto px-4 pt-6 pb-4 max-w-2xl overflow-x-hidden">

      <InfiniteScroll
        dataLength={posts.length}
        next={() => setPage(prev => prev + 1)}
        hasMore={hasMore}
        loader={<div className="flex justify-center py-5"><Loader/></div>}

      >
        {posts.map(post => (
          <article key={post._id} className="bg-white dark:bg-black/60 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-800 mb-5 p-5 transition-all hover:shadow-xl mx-auto">

            {/* AUTHOR + MENU */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={post.author?.avatar || "https://swiftmeta.vercel.app/pp.jpeg"}
                  onError={e => (e.currentTarget.src = "https://swiftmeta.vercel.app/err.jpg")}
                  alt="author"
                  className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                />
                <div>
                  <p className="text-sm font-semibold">{post.author?.name || "Anonymous"}</p>
                  <time className="text-[10px] opacity-60">{new Date(post.createdAt).toLocaleString()}</time>
                </div>
              </div>

              <Dropdown overlay={menu(post)} trigger={["click"]} placement="bottomRight">
                <MoreHorizontal size={24} className="cursor-pointer hover:opacity-70 transition"/>
              </Dropdown>
            </div>

            {/* POST CONTENT */}
            <h2 className="text-xl font-bold mb-1">{post.title}</h2>
            <p className="text-sm opacity-90 whitespace-pre-line">{post.body}</p>

            {/* IMAGE DISPLAY */}
            {Array.isArray(post.images) && post.images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                {post.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    onError={e => (e.currentTarget.src = "https://swiftmeta.vercel.app/pp.jpeg")}
                    alt="post media"
                    className="w-full min-h-[160px] object-cover rounded-2xl transition-all hover:scale-105 duration-300"
                  />
                ))}
              </div>
            )}

            {/* ACTION BAR */}
            <div className="flex justify-between items-center mt-5">
              <button
                onClick={async () => {
                  const r = await api.post(`/posts/${post._id}/toggle-like`);
                  setPosts(prev =>
                    prev.map(p => p._id === post._id ? { ...p, likes: Array(r.data.likesCount).fill(1) } : p)
                  );
                  toast.success(r.data.liked ? "Liked post" : "Unliked post");
                }}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Heart size={20} fill={post.likes?.length ? "#000" : "none"} /> 
                {post.likes?.length || 0}
              </button>

              <Link to={`/dashboard/blog/posts/${post._id}`} className="text-xs opacity-60 hover:underline">
                {post.comments?.length || 0} comments
              </Link>
            </div>

            {/* COMMENT BOX */}
            <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-3">
              <CommentBox postId={post._id} onCommentUpdate={updatePostComments} />
            </div>

          </article>
        ))}
      </InfiniteScroll>
    </div>
  );
}

function CommentBox({ postId, onCommentUpdate }) {
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    api.get(`/posts/${postId}`).then(r => {
      const data = r.data.comments || [];
      setComments(data);
      onCommentUpdate(postId, data);
    });
  }, [postId, onCommentUpdate]);

  async function send() {
    if (!text.trim()) return;
    try {
      const r = await api.post(`/posts/${postId}/comments`, { text });
      const newComments = [...comments, r.data];
      setComments(newComments);
      onCommentUpdate(postId, newComments);
      setText("");
    } catch {
      toast.error("Failed to post comment");
    }
  }

  return (
    <section>
      <div className="flex items-center gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-gray-800 text-xs focus:outline-none focus:ring-1"
        />
        <button onClick={send} className="bg-black text-white p-2 rounded-full hover:opacity-80 active:scale-95 transition" aria-label="send comment">
          <Send size={16}/>
        </button>
      </div>

      <div className="mt-3 space-y-2">
        {comments.map(c => (
          <div key={c._id} className="flex gap-2 items-start">
            <img
              src={c.author?.avatar || "/default-avatar.png"}
              onError={e => (e.currentTarget.src = "https://swiftmeta.vercel.app/images.jpeg")}
              alt="comment author"
              className="w-7 h-7 rounded-full object-cover border border-gray-300 dark:border-gray-700"
            />
            <div className="bg-gray-100 dark:bg-black/50 px-3 py-2 rounded-2xl w-fit max-w-[80%] text-xs">
              <strong className="block mb-1 text-[11px]">{c.author?.name || "User"}</strong>
              {c.text}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
