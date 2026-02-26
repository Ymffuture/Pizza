import React, { useEffect, useState, useRef, useCallback } from "react";
import { api } from "../api";
import toast from "react-hot-toast";
import { X, Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EditPostModal({ postId, visible, onClose, onUpdated }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  
  const textareaRef = useRef(null);
  const titleInputRef = useRef(null);
  const originalData = useRef({ title: "", body: "" });

  // -------------------------------
  // Lock body scroll + backdrop blur
  // -------------------------------
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [visible]);

  // -------------------------------
  // Load post on open
  // -------------------------------
  useEffect(() => {
    if (visible && postId) {
      loadPost();
      // Focus title after load
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  }, [visible, postId]);

  // -------------------------------
  // Keyboard shortcuts
  // -------------------------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!visible) return;
      
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
      // Cmd/Ctrl + Enter to save
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !saving && isDirty) {
        e.preventDefault();
        save();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, saving, isDirty, title, body]);

  async function loadPost() {
    setLoading(true);
    try {
      const r = await api.get(`/posts/${postId}`);
      const postData = {
        title: r.data.title || "",
        body: r.data.body || ""
      };
      setTitle(postData.title);
      setBody(postData.body);
      originalData.current = postData;
      setIsDirty(false);
    } catch {
      toast.error("Failed to load post");
      onClose();
    } finally {
      setLoading(false);
    }
  }

  const handleClose = useCallback(() => {
    if (isDirty && !window.confirm("You have unsaved changes. Discard them?")) {
      return;
    }
    onClose();
  }, [isDirty, onClose]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setIsDirty(e.target.value !== originalData.current.title || body !== originalData.current.body);
  };

  const handleBodyChange = (e) => {
    setBody(e.target.value);
    setIsDirty(e.target.value !== originalData.current.body || title !== originalData.current.title);
    // Auto-resize
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 400)}px`;
    }
  };

  async function save() {
    if (!title.trim() && !body.trim()) return;

    setSaving(true);
    try {
      await api.put(`/posts/${postId}`, {
        title: title.trim(),
        body: body.trim(),
      });

      toast.success("Post updated successfully");
      onUpdated?.();
      onClose();
    } catch {
      toast.error("Failed to update post");
    } finally {
      setSaving(false);
    }
  }

  // -------------------------------
  // Skeleton loader component
  // -------------------------------
  const SkeletonLoader = () => (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* BACKDROP with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* MODAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0.1 }}
            className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Edit Post
                </h2>
                {isDirty && (
                  <span className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full font-medium">
                    Unsaved
                  </span>
                )}
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200 group"
                title="Close (Esc)"
              >
                <X size={18} className="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {loading ? (
                <SkeletonLoader />
              ) : (
                <>
                  {/* Title Input */}
                  <div className="space-y-1">
                    <input
                      ref={titleInputRef}
                      value={title}
                      onChange={handleTitleChange}
                      placeholder="Post title..."
                      className="w-full text-lg font-semibold px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>

                  {/* Body Textarea */}
                  <div className="space-y-1">
                    <textarea
                      ref={textareaRef}
                      value={body}
                      onChange={handleBodyChange}
                      placeholder="What's on your mind?"
                      rows={4}
                      className="w-full text-base px-4 py-3 resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 leading-relaxed"
                      style={{ minHeight: "120px" }}
                    />
                    <div className="flex justify-end">
                      <span className={`text-xs ${body.length > 500 ? 'text-amber-500' : 'text-gray-400'}`}>
                        {body.length} characters
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="text-xs text-gray-400">
                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400 font-mono text-[10px]">⌘</kbd>
                <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400 font-mono text-[10px] ml-1">Enter</kbd>
                <span className="ml-2">to save</span>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  disabled={saving}
                  className="px-5 py-2.5 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={save}
                  disabled={saving || !isDirty || loading}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
