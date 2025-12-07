import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Trash2, Pencil, MoreHorizontal, Send } from "lucide-react";
import { Dropdown } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { api } from "../api";
import toast from "react-hot-toast";
import EditPostModal from "../pages/EditPost";
import ViewPostModal from "../pages/ViewPost";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiThumbsUp } from "react-icons/fi";

export default function BlogHome() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [editingPostId, setEditingPostId] = useState(null);
const [showEditModal, setShowEditModal] = useState(false);
const [viewPostId, setViewPostId] = useState(null);
const [showViewModal, setShowViewModal] = useState(false);

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
        onClick={() => {
          setEditingPostId(post._id);
          setShowEditModal(true);
        }}
        className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
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
            <h2
  className="text-xl font-bold mb-1 cursor-pointer text-blue-400"
  onClick={() => {
    setViewPostId(post._id);
    setShowViewModal(true);
  }}
>
  {post.title}
</h2>

            <div className="prose dark:prose-invert max-w-none mb-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                pre: ({ node, ...props }) => (
                  <pre
                    {...props}
                    className="bg-gray-900 text-white p-3 rounded-lg overflow-x-auto"
                  />
                ),
                code: ({ node, inline, ...props }) =>
                  inline ? (
                    <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded" {...props} />
                  ) : (
                    <code {...props} />
                  ),
              }}
            >
              {post.body}
            </ReactMarkdown>
          </div>

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

      <EditPostModal
  postId={editingPostId}
  visible={showEditModal}
  onClose={() => setShowEditModal(false)}
  onUpdated={() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts(); // refresh list after save
  }}
/>
<ViewPostModal
  postId={viewPostId}
  visible={showViewModal}
  onClose={() => setShowViewModal(false)}
/>

    </div>
  );
}

function CommentBox({ postId, onCommentUpdate }) {
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Fetch all comments for this post
  useEffect(() => {
    (async () => {
      const r = await api.get(`/posts/${postId}`);
      const data = r.data.comments || [];
      setComments(data);
      onCommentUpdate(postId, data);
    })();
  }, [postId, onCommentUpdate]);

  // Submit a top-level comment
  async function send() {
    if (!text.trim()) return;
    try {
      const r = await api.post(`/posts/${postId}/comments`, { text });
      const newComments = [...comments, r.data];

      setComments(newComments);
      onCommentUpdate(postId, newComments);
      setText("");
    } catch {
      toast.error("Failed to send comment");
    }
  }

  // Start reply mode
  function openReplyField(commentId) {
    setReplyingTo(commentId);
    setReplyText(prev => ({ ...prev, [commentId]: "" }));
  }

  // Submit reply
  async function sendReply(commentId) {
    const msg = replyText[commentId];
    if (!msg?.trim()) return;

    try {
      const r = await api.post(
        `/posts/${postId}/comments/${commentId}/replies`,
        { text: msg }
      );

      const updated = comments.map(c =>
        c._id === commentId ? { ...c, replies: [...c.replies, r.data] } : c
      );

      setComments(updated);
      onCommentUpdate(postId, updated);

      setReplyText(prev => ({ ...prev, [commentId]: "" }));
      setReplyingTo(null);
    } catch {
      toast.error("Failed to send reply");
    }
  }

  // Delete comment
  async function deleteComment(commentId) {
    try {
      await api.delete(`/posts/${postId}/comments/${commentId}`);
      const updated = comments.filter(c => c._id !== commentId);
      setComments(updated);
      onCommentUpdate(postId, updated);
      toast.success("Comment deleted");
    } catch {
      toast.error("Delete failed");
    }
  }

  // Delete reply
  async function deleteReply(commentId, replyId) {
    try {
      await api.delete(
        `/posts/${postId}/comments/${commentId}/replies/${replyId}`
      );

      const updated = comments.map(c =>
        c._id === commentId
          ? { ...c, replies: c.replies.filter(r => r._id !== replyId) }
          : c
      );

      setComments(updated);
      onCommentUpdate(postId, updated);
      toast.success("Reply deleted");
    } catch {
      toast.error("Failed");
    }
  }

  // Like comment
  async function toggleCommentLike(commentId) {
    try {
      const r = await api.post(
        `/posts/${postId}/comments/${commentId}/toggle-like`
      );

      const updated = comments.map(c =>
        c._id === commentId
          ? { ...c, likes: Array(r.data.likesCount).fill(1) }
          : c
      );

      setComments(updated);
      onCommentUpdate(postId, updated);
    } catch {
      toast.error("Failed");
    }
  }

  // Like reply
  async function toggleReplyLike(commentId, replyId) {
    try {
      const r = await api.post(
        `/posts/${postId}/comments/${commentId}/replies/${replyId}/toggle-like`
      );

      const updated = comments.map(c =>
        c._id === commentId
          ? {
              ...c,
              replies: c.replies.map(rep =>
                rep._id === replyId
                  ? { ...rep, likes: Array(r.data.likesCount).fill(1) }
                  : rep
              ),
            }
          : c
      );

      setComments(updated);
      onCommentUpdate(postId, updated);
    } catch {
      toast.error("Failed");
    }
  }

  const visibleComments = showAll ? comments : comments.slice(0, 2);

  return (
    <section>
      {/* COMMENT INPUT */}
      <div className="flex items-center gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-gray-800 text-xs"
        />
        <button
          onClick={send}
          className="bg-black text-white p-2 rounded-full"
        >
          <Send size={16} />
        </button>
      </div>

      {/* COMMENTS */}
      <div className="mt-3 space-y-3">
        {visibleComments.map(c => (
          <div key={c._id} className="flex gap-2 items-start">
            {/* Avatar */}
            <img
              src={c.author?.avatar}
              className="w-7 h-7 rounded-full object-cover border dark:border-gray-600"
            />

            <div className="bg-gray-100 dark:bg-black/50 px-3 py-2 rounded-2xl max-w-[85%]">
              <strong className="block text-[11px] mb-1">{c.author?.name}</strong>
              <p className="text-xs">{c.text}</p>

              {/* ACTIONS */}
              <div className="flex gap-4 mt-1 text-[10px] opacity-70">
                <button onClick={() => toggleCommentLike(c._id)}>
                  <FiThumbsUp/> {c.likes?.length || 0}
                </button>

                <button onClick={() => openReplyField(c._id)}>Reply</button>

                <button
                  className="text-red-500"
                  onClick={() => deleteComment(c._id)}
                >
                  Delete
                </button>
              </div>

              {/* REPLIES */}
              {c.replies?.length > 0 && (
                <div className="ml-4 mt-2 space-y-2">
                  {c.replies.map(r => (
                    <div
                      key={r._id}
                      className="bg-gray-200 dark:bg-black/40 px-3 py-2 rounded-2xl"
                    >
                      <strong className="block text-[10px]">
                        {r.author?.name}
                      </strong>
                      <p className="text-xs">{r.text}</p>

                      <div className="flex gap-3 text-[10px] mt-1 opacity-60">
                        <button onClick={() => toggleReplyLike(c._id, r._id)}>
                          ❤️ {r.likes?.length || 0}
                        </button>

                        <button
                          className="text-red-500"
                          onClick={() => deleteReply(c._id, r._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply input */}
              {replyingTo === c._id && (
                <div className="flex gap-2 mt-2 ml-2">
                  <input
                    value={replyText[c._id] || ""}
                    onChange={e =>
                      setReplyText(prev => ({
                        ...prev,
                        [c._id]: e.target.value,
                      }))
                    }
                    placeholder="Reply..."
                    className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-black/40 border dark:border-gray-700"
                  />
                  <button
                    onClick={() => sendReply(c._id)}
                    className="bg-black text-white px-3 py-1 text-xs rounded-full"
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* SHOW MORE */}
      {comments.length > 2 && (
        <button
          onClick={() => setShowAll(prev => !prev)}
          className="text-xs mt-2 text-blue-500"
        >
          {showAll ? "Show less" : `Show ${comments.length - 2} more`}
        </button>
      )}
    </section>
  );
}
