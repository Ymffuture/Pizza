// src/pages/BlogHome.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Trash2, Pencil, MoreHorizontal } from "lucide-react";
import { Dropdown, Modal, Button } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { api } from "../api";
import toast from "react-hot-toast";

// ⭐ Components
import CommentBox from "../components/CommentBox";

const { confirm } = Modal;

// Post menu dropdown component
function PostMenu({ post, onEdit, onDelete }) {
  const handleDelete = () => {
    confirm({
      title: "Are you sure you want to delete this post?",
      content: "This action cannot be undone.",
      okText: "Yes, delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          await api.delete(`/posts/${post._id}`);
          onDelete(post._id);
          toast.success("Post deleted");
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete post");
        }
      },
    });
  };

  return (
    <div className="bg-white dark:bg-black rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 w-36 overflow-hidden text-xs">
      <button
        onClick={onEdit}
        className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Pencil size={14} /> Edit
      </button>

      <button
        onClick={handleDelete}
        className="flex items-center gap-2 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
      >
        <Trash2 size={14} /> Delete
      </button>
    </div>
  );
}

export default function BlogHome() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const nav = useNavigate();

  // Fetch posts with pagination
  const fetchPosts = useCallback(async () => {
    try {
      const r = await api.get(`/posts?page=${page}`);
      if (r.data.length === 0) {
        setHasMore(false);
        return;
      }
      setPosts(prev => [...prev, ...r.data]);
    } catch {
      toast.error("Failed to load posts");
    }
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Update comments for a post
  const updatePostComments = (postId, newComments) => {
    setPosts(prev =>
      prev.map(p => (p._id === postId ? { ...p, comments: newComments } : p))
    );
  };

  // Loader for infinite scroll
  const Loader = () => (
    <div className="flex flex-col items-center justify-center min-h-[120px]">
      <div className="animate-spin border-4 border-gray-300 border-t-black rounded-full w-10 h-10"></div>
      <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">Loading Blogs...</p>
    </div>
  );

  return (
    <div className="min-h-screen pb-28 md:pb-2 mx-auto px-4 pt-6 pb-4 max-w-2xl">

      <InfiniteScroll
        dataLength={posts.length}
        next={() => setPage(prev => prev + 1)}
        hasMore={hasMore}
        loader={<div className="flex justify-center py-5"><Loader/></div>}
      >
        {posts.map(post => (
          <article
            key={post._id}
            className="bg-white dark:bg-black/60 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-800 mb-5 p-5 hover:shadow-xl transition-all"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={post.author?.avatar || "https://swiftmeta.vercel.app/pp.jpeg"}
                  onError={e => (e.currentTarget.src = "https://swiftmeta.vercel.app/err.jpg")}
                  className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700"
                  alt=""
                />

                <div>
                  <p className="text-sm font-semibold">{post.author?.name || "Anonymous"}</p>
                  <time className="text-[10px] opacity-60">{new Date(post.createdAt).toLocaleString()}</time>
                </div>
              </div>

              <Dropdown
                overlay={
                  <PostMenu
                    post={post}
                    onEdit={() => nav(`/dashboard/blog/edit/${post._id}`)}
                    onDelete={(id) => setPosts(prev => prev.filter(p => p._id !== id))}
                  />
                }
                trigger={["click"]}
                placement="bottomRight"
              >
                <MoreHorizontal size={22} className="cursor-pointer" />
              </Dropdown>
            </div>

            {/* TITLE */}
            <h2 className="text-xl font-bold mb-1">{post.title}</h2>
            <p className="text-sm opacity-90 whitespace-pre-line mb-3">{post.body}</p>

            {/* IMAGES */}
            {Array.isArray(post.images) && post.images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {post.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    onError={e => (e.currentTarget.src = "https://swiftmeta.vercel.app/pp.jpeg")}
                    className="w-full rounded-2xl object-cover min-h-[160px]"
                    alt=""
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
                    prev.map(p =>
                      p._id === post._id
                        ? { ...p, likes: Array(r.data.likesCount).fill(1) }
                        : p
                    )
                  );
                }}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Heart size={20} fill={post.likes?.length ? "black" : "none"} />
                {post.likes?.length || 0}
              </button>

              <Link to={`/dashboard/blog/posts/${post._id}`} className="text-xs opacity-60 hover:underline">
                {post.comments?.length || 0} comments
              </Link>
            </div>

            {/* COMMENT BOX */}
            <div className="mt-4 border-t border-gray-200 dark:border-gray-800 pt-3">
              <CommentBox postId={post._id} onCommentUpdate={updatePostComments} />
            </div>
          </article>
        ))}
      </InfiniteScroll>
    </div>
  );
}
