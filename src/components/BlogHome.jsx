import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Trash2, Pencil, MoreHorizontal, Send } from "lucide-react";
import { Dropdown } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { api } from "../api";
import toast from "react-hot-toast";

import EditPostModal from "../pages/EditPost";
import EditCommentModal from "../pages/ViewPost";

export default function BlogHome() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const nav = useNavigate();

  // Modal states
  const [editPostOpen, setEditPostOpen] = useState(false);
  const [editPostData, setEditPostData] = useState(null);

  const [editCommentOpen, setEditCommentOpen] = useState(false);
  const [editCommentData, setEditCommentData] = useState(null);
  const [editCommentPostId, setEditCommentPostId] = useState(null);

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

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const updatePostComments = (postId, newComments) => {
    setPosts(prev =>
      prev.map(p => (p._id === postId ? { ...p, comments: newComments } : p))
    );
  };

  function openEditPost(post) {
    setEditPostData(post);
    setEditPostOpen(true);
  }

  function handlePostUpdated(updated) {
    setPosts(prev =>
      prev.map(p => (p._id === updated._id ? updated : p))
    );
  }

  function openEditComment(postId, comment) {
    setEditCommentPostId(postId);
    setEditCommentData(comment);
    setEditCommentOpen(true);
  }

  function handleCommentUpdated(updatedComment) {
    setPosts(prev =>
      prev.map(p =>
        p._id === editCommentPostId
          ? {
              ...p,
              comments: p.comments.map(c =>
                c._id === updatedComment._id ? updatedComment : c
              )
            }
          : p
      )
    );
  }

  // Menu for each post
  const menu = (post) => (
    <div className="bg-white dark:bg-black rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 w-36 overflow-hidden text-xs">
      <button
        onClick={() => openEditPost(post)}
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
        className="flex items-center gap-2 w-full px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
      >
        <Trash2 size={14}/> Delete
      </button>
    </div>
  );

  return (
    <div className="min-h-screen pb-28 md:pb-2 mx-auto px-4 pt-6 max-w-2xl">

      <InfiniteScroll
        dataLength={posts.length}
        next={() => setPage(prev => prev + 1)}
        hasMore={hasMore}
        loader={<p className="text-center py-6 opacity-60">Loading...</p>}
      >
        {posts.map(post => (
          <article key={post._id} className="bg-white dark:bg-black/60 rounded-3xl border border-gray-200 dark:border-gray-800 mb-5 p-5">

            {/* AUTHOR + MENU */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={post.author?.avatar}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">{post.author?.name}</p>
                  <time className="text-[10px] opacity-60">{new Date(post.createdAt).toLocaleString()}</time>
                </div>
              </div>

              <Dropdown overlay={menu(post)} trigger={["click"]}>
                <MoreHorizontal size={24} className="cursor-pointer"/>
              </Dropdown>
            </div>

            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-sm opacity-90">{post.body}</p>

            {/* COMMENTS */}
            <div className="mt-4 border-t pt-3">
              <CommentList
                post={post}
                onEdit={(comment) => openEditComment(post._id, comment)}
              />
            </div>

          </article>
        ))}
      </InfiniteScroll>

      {/* --- MODALS --- */}
      <EditPostModal
        open={editPostOpen}
        onClose={() => setEditPostOpen(false)}
        post={editPostData}
        onUpdated={handlePostUpdated}
      />

      <EditCommentModal
        open={editCommentOpen}
        onClose={() => setEditCommentOpen(false)}
        postId={editCommentPostId}
        comment={editCommentData}
        onUpdated={handleCommentUpdated}
      />

    </div>
  );
}

function CommentList({ post, onEdit }) {
  return (
    <div className="space-y-3 mt-3">
      {post.comments?.map(c => (
        <div key={c._id} className="flex gap-2">
          <img
            src={c.author?.avatar}
            className="w-8 h-8 rounded-full"
          />
          <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-xl text-sm w-fit max-w-[80%]">
            <b>{c.author?.name}</b>
            <p>{c.text}</p>
            <button
              className="text-[10px] mt-1 underline opacity-60"
              onClick={() => onEdit(c)}
            >
              edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
