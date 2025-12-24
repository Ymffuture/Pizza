import React, { useEffect, useState } from "react";
import { X, Send } from "lucide-react";
import { api } from "../api";
import toast from "react-hot-toast";

export default function ViewPostModal({ postId, visible, onClose }) {
  const [post, setPost] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    if (visible) loadPost();
  }, [visible]);

  async function loadPost() {
    if (!postId) return;
    setLoading(true);
    try {
      const r = await api.get(`/posts/${postId}`);
      setPost(r.data);
    } catch {
      toast.error("Failed to load post");
      onClose();
    } finally {
      setLoading(false);
    }
  }

  async function sendComment() {
    if (!text.trim()) return;
    setCommenting(true);

    try {
      const r = await api.post(`/posts/${postId}/comments`, { text });
      setPost(prev => ({
        ...prev,
        comments: [...(prev?.comments || []), r.data],
      }));
      setText("");
    } catch {
      toast.error("Failed to comment");
    } finally {
      setCommenting(false);
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold truncate">
            {post?.title || "Post"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {loading ? (
            <div className="flex justify-center py-16 text-gray-500">
              Loading post...
            </div>
          ) : (
            <>
              {/* Body */}
              <p className="whitespace-pre-line text-gray-800 dark:text-gray-200">
                {post.body}
              </p>

              {/* Images */}
              {Array.isArray(post.images) && post.images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {post.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="post"
                      className="rounded-xl object-cover w-full max-h-80"
                      onError={e =>
                        (e.currentTarget.src =
                          "https://swiftmeta.vercel.app/err.jpg")
                      }
                    />
                  ))}
                </div>
              )}

              {/* Comments */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold mb-3">Comments</h3>

                <div className="space-y-3">
                  {(post.comments || []).map(c => (
                    <div key={c._id} className="flex gap-2">
                      <img
                        src={
                          c.author?.avatar ||
                          "https://swiftmeta.vercel.app/pp.jpeg"
                        }
                        className="w-8 h-8 rounded-full object-cover"
                        alt="avatar"
                      />
                      <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-2xl text-sm max-w-[85%]">
                        <p className="font-semibold text-xs mb-0.5">
                          {c.author?.name || "User"}
                        </p>
                        <p className="leading-snug">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Comment Input (Sticky like Facebook) */}
        {!loading && (
          <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex gap-2">
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Write a comment..."
              disabled={commenting}
              className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendComment}
              disabled={!text.trim() || commenting}
              className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition"
            >
              <Send size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
