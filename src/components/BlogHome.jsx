import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Heart, Trash2, Pencil, MoreHorizontal, UserCircle, LogOut } from "lucide-react";
import { Dropdown } from "antd";
import { api } from "../api";
import toast from "react-hot-toast";

export default function BlogHome() {
  const [posts, setPosts] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    api.get("/posts")
      .then((r) => setPosts(r.data))
      .catch(() => toast.error("Failed loading posts"));
  }, []);

  async function toggleLike(postId) {
    try {
      const r = await api.post(`/posts/${postId}/toggle-like`);
      setPosts(posts.map(p =>
        p._id === postId ? { ...p, likes: Array(r.data.liked ? p.likes.length + 1 : p.likes.length - 1).fill(1) } : p
      ));
    } catch {
      toast.error("Failed liking post");
    }
  }

  return (
    <div className="w-full h-screen overflow-y-auto bg-[#f5f5f7] dark:bg-black text-black dark:text-white pb-20">
      
      {/* DESKTOP HEADER */}
      <header className="text-center pt-6">
        <h1 className="text-4xl font-bold">SwiftMeta</h1>
        <p className="opacity-60 mt-2">Build. Post. Share.</p>
      </header>

      {/* POSTS */}
      <section className="max-w-4xl mx-auto px-2 sm:px-4 mt-6">
        {posts.map(post => {
          const menu = (
            <div className="bg-white dark:bg-black rounded-2xl shadow-lg border dark:border-gray-800 w-32 p-1">
              <button
                onClick={() => nav(`/dashboard/blog/edit/${post._id}`)}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl text-xs"
              >
                <Pencil size={14}/> Edit
              </button>
              <button
                onClick={async () => {
                  await api.delete(`/posts/${post._id}`);
                  setPosts(posts.filter(p => p._id !== post._id));
                  toast.success("Post deleted");
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-xl text-xs"
              >
                <Trash2 size={14}/> Delete
              </button>
            </div>
          );

          return (
            <article
              key={post._id}
              className="w-full bg-white dark:bg-[#111] rounded-3xl shadow-md p-4 sm:p-5 mb-4 border dark:border-gray-900"
            >
              {/* AUTHOR ROW */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author?.avatar || "/default-avatar.png"}
                    className="w-10 h-10 rounded-full object-cover border dark:border-gray-700"
                  />
                  <span className="text-sm font-medium">{post.author?.name || "Unknown"}</span>
                </div>

                <Dropdown overlay={menu} trigger={["click"]} placement="topRight">
                  <MoreHorizontal size={22} className="cursor-pointer hover:opacity-70"/>
                </Dropdown>
              </div>

              {/* POST TEXT */}
              <h2 className="text-xl font-semibold mt-3">{post.title}</h2>
              <p className="text-sm opacity-80 mt-1">{post.body}</p>

              {/* IMAGES */}
              {post.images?.length > 0 && (
                <div className="mt-4 grid gap-2
                  grid-cols-1
                  sm:grid-cols-2
                  md:grid-cols-3
                ">
                  {post.images.map(img => (
                    <img key={img} src={img} className="w-full h-44 object-cover rounded-2xl"/>
                  ))}
                </div>
              )}

              {/* ACTION ROW */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => toggleLike(post._id)}
                  className="flex items-center gap-1 text-sm font-medium hover:opacity-70 active:scale-95"
                >
                  <Heart size={18} fill={post.likes?.includes(1) ? "currentColor" : "none"}/> {post.likes?.length || 0}
                </button>

                <time className="text-xs opacity-60">
                  {new Date(post.createdAt).toLocaleDateString()}
                </time>
              </div>

              {/* COMMENTS */}
              <div className="mt-4 border-t dark:border-gray-900 pt-3">
                <CommentBox postId={post._id}/>
              </div>
            </article>
          );
        })}
      </section>

      <Outlet/>
    </div>
  );
}

function CommentBox({ postId }) {
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    api.get(`/posts/${postId}`)
      .then(r => setComments(r.data.comments || []))
      .catch(() => toast.error("Failed loading comments"));
  }, [postId]);

  async function send() {
    if (!text.trim()) return;
    try {
      const r = await api.post(`/posts/${postId}/comments`, { text });
      setComments([...comments, r.data]);
      setText("");
      toast.success("Comment posted");
    } catch {
      toast.error("Failed posting comment");
    }
  }

  return (
    <div>
      <div className="flex gap-2 items-center">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write a comment..."
          className="
            flex-1 px-4 py-2 rounded-full bg-gray-200 dark:bg-black/30
            border dark:border-gray-800 text-xs focus:outline-none
          "
        />
        <button
          onClick={send}
          className="
            bg-black text-white px-4 py-2 rounded-full text-xs
            hover:opacity-80 active:scale-95 transition
          "
        >
          Send
        </button>
      </div>

      <div className="mt-3 space-y-2">
        {comments.map(c => (
          <div key={c._id} className="flex items-start gap-2">
            <img
              src={c.author?.avatar || "/default-avatar.png"}
              className="w-7 h-7 rounded-full object-cover"
            />
            <p className="bg-gray-200 dark:bg-black/30 px-3 py-2 rounded-2xl text-xs max-w-[75%]">
              <b className="block mb-1">{c.author?.name}</b>
              {c.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
