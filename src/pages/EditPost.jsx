import React, { useEffect, useState } from "react";
import { api } from "../api";
import toast from "react-hot-toast";
import { X } from "lucide-react";

export default function EditPostModal({
  postId,
  visible,
  onClose,
  onUpdated,
}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // -------------------------------
  // Lock body scroll (Facebook UX)
  // -------------------------------
  useEffect(() => {
    if (visible) document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, [visible]);

  // -------------------------------
  // Load post on open
  // -------------------------------
  useEffect(() => {
    if (visible && postId) loadPost();
  }, [visible, postId]);

  async function loadPost() {
    setLoading(true);
    try {
      const r = await api.get(`/posts/${postId}`);
      setTitle(r.data.title || "");
      setBody(r.data.body || "");
    } catch {
      toast.error("Failed to load post");
      onClose();
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!title.trim() && !body.trim()) return;

    setSaving(true);
    try {
      await api.put(`/posts/${postId}`, {
        title: title.trim(),
        body: body.trim(),
      });

      toast.success("Post updated");
      onUpdated?.(); // refresh feed
      onClose();
    } catch {
      toast.error("Failed to update post");
    } finally {
      setSaving(false);
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold">Edit Post</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-4 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center py-10">
              <span className="text-sm text-gray-500 animate-pulse">
                Loading post…
              </span>
            </div>
          ) : (
            <>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="
                  w-full text-base font-medium px-3 py-2
                  rounded-lg border border-gray-300 dark:border-gray-700
                  bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500
                "
              />

              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="What's on your mind?"
                rows={5}
                className="
                  w-full text-sm px-3 py-2 resize-none
                  rounded-lg border border-gray-300 dark:border-gray-700
                  bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500
                "
              />
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            onClick={save}
            disabled={saving}
            className="
              px-4 py-2 text-sm font-semibold rounded-md
              bg-blue-600 text-white hover:bg-blue-700
              disabled:opacity-50
            "
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
