import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Trash2, Pencil, MoreHorizontal, Send } from "lucide-react";
import { Dropdown } from "antd";
import { api } from "../api";
import toast from "react-hot-toast";

export default function BlogHome() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const observer = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL || ""; // ✅ always defined

  const loadPosts = useCallback(async (p) => {
    try {
      const r = await api.get(`/posts?page=${p}&limit=10`);
      const newPosts = r.data.posts || [];
      setPosts(prev => (p === 1 ? newPosts : [...prev, ...newPosts]));
      setHasMore(!!r.data.hasMore);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load posts");
    }
  }, []);

  useEffect(() => {
    loadPosts(page);
  }, [page, loadPosts]);

  const lastPostRef = useCallback(
    (node) => {
      if (!window || !("IntersectionObserver" in window)) return; // ✅ guard browser API
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, hasMore]
  );

  const menuItems = (post) => ([ // ✅ valid AntD 5 menu format
    {
      key: "edit",
      label: (
        <div onClick={() => navigate(`/dashboard/blog/edit/${post._id}`)} className="flex items-center gap-2">
          <Pencil size={14} /> Edit
        </div>
      )
    },
    {
      key: "delete",
      label: (
        <div onClick={async () => {
          try {
            await api.delete(`/posts/${post._id}`);
            setPosts(prev => prev.filter(p => p._id !== post._id));
            toast.success("Post deleted");
          } catch (e) {
            console.error(e);
            toast.error("Delete failed");
          }
        }} className="flex items-center gap-2 text-red-500">
          <Trash2 size={14} /> Delete
        </div>
      )
    }
  ]);

  return (
    <div className="pb-28 md:pb-5 overflow-x-hidden">
      {posts.map((post, i) => {
        const created = post.createdAt ? new Date(post.createdAt).toLocaleString() : "";

        return (
          <article
            ref={posts.length === i + 1 ? lastPostRef : null}
            key={post._id || i}
            className="bg-white dark:bg-black/60 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-800 mb-5 p-5 transition-all hover:shadow-xl max-w-2xl mx-auto animate-fade-in"
          >
            <header className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={post.author?.avatar ? `${API_URL}${post.author.avatar}` : "/default-avatar.png"}
                  alt="author"
                  className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                  onError={(e) => (e.target.src = "/default-avatar.png")}
                />

                <div>
                  <p className="text-sm font-semibold">{post.author?.name || "Anonymous"}</p>
                  <time className="text-[10px] opacity-60">{created}</time>
                </div>
              </div>

              <Dropdown menu={{ items: menuItems(post) }} trigger={["click"]} placement="bottomRight">
                <MoreHorizontal size={24} className="cursor-pointer hover:opacity-70 transition" />
              </Dropdown>
            </header>

            <h2 className="text-xl font-bold mb-1">{post.title || ""}</h2>
            <p className="text-sm opacity-90 whitespace-pre-line">{post.body || ""}</p>

            {Array.isArray(post.images) && post.images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                {post.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={`${API_URL}${img}`}
                    alt="post media"
                    className="w-full min-h-[160px] object-cover rounded-2xl"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ))}
              </div>
            )}

            <footer className="flex justify-between items-center mt-5">
              <button
                onClick={async () => {
                  try {
                    const r = await api.post(`/posts/${post._id}/toggle-like`);
                    setPosts(prev =>
                      prev.map(p =>
                        p._id === post._id
                          ? { ...p, likes: r.data.likes, likesCount: r.data.likesCount }
                          : p
                      )
                    );
                    toast.success(r.data.liked ? "Liked ❤️" : "Unliked 💔");
                  } catch (e) {
                    console.error(e);
                    toast.error("Like failed");
                  }
                }}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Heart size={18} fill={post.likesCount ? "currentColor" : "none"} />
                {post.likesCount || 0}
              </button>

              <Link to={`/posts/${post._id}`} className="text-xs opacity-60 hover:underline">
                {post.commentCount || 0} comments
              </Link>
            </footer>

            <section className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-3">
              <CommentBox
                API_URL={API_URL}
                postId={post._id}
                onCommentAdded={() =>
                  setPosts(prev =>
                    prev.map(p =>
                      p._id === post._id
                        ? { ...p, commentCount: (p.commentCount || 0) + 1 }
                        : p
                    )
                  )
                }
              />
            </section>
          </article>
        );
      })}
    </div>
  );
}

function CommentBox({ API_URL, postId, onCommentAdded }) {
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    api.get(`/posts/${postId}/comments`)
      .then(r => setComments(r.data || []))
      .catch(err => console.error(err));
  }, [postId]);

  const send = async () => {
    if (!text.trim()) return;
    try {
      const r = await api.post(`/posts/${postId}/comments`, { text });
      setComments(prev => [...prev, r.data]);
      setText("");
      onCommentAdded();
    } catch (err) {
      console.error(err);
      toast.error("Failed to post comment");
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-gray-800 text-xs focus:outline-none focus:ring-1"
        />
        <button onClick={send} className="bg-black text-white p-2 rounded-full hover:opacity-80 active:scale-95 transition" aria-label="send comment">
          <Send size={16} />
        </button>
      </div>

      <div className="mt-3 space-y-2">
        {comments.map((c, idx) => (
          <div key={c._id || idx} className="flex gap-2 items-start animate-slide-up">
            <img
              src={c.author?.avatar ? `${API_URL}${c.author.avatar}` : "/default-avatar.png"}
              alt="comment author"
              className="w-7 h-7 rounded-full object-cover border border-gray-300 dark:border-gray-700"
              onError={(e) => (e.target.src = "/default-avatar.png")}
            />

            <div className="bg-gray-100 dark:bg-black/50 px-3 py-2 rounded-2xl w-fit max-w-[80%] text-xs">
              <strong className="block mb-1 text-[11px]">{c.author?.name || "User"}</strong>
              {c.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
