import React, { useState } from "react";
import { api } from "../api";
import toast from "react-hot-toast";
import { Send } from "lucide-react";

export default function CommentBox({ postId, onCommentUpdate }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitComment() {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const r = await api.post(`/posts/${postId}/comments`, {
        text,
        plainText: text,
      });

      setText("");

      // ⬅ this updates the parent UI safely
      onCommentUpdate(postId, r.data);

      toast.success("Comment added");
    } catch {
      toast.error("Failed to comment");
    }
    setLoading(false);
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-full">

        {/* User text input (Facebook style) */}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 bg-transparent outline-none text-sm"
        />

        {/* Send button */}
        <button
          onClick={submitComment}
          disabled={loading}
          className="text-blue-600 hover:text-blue-800 disabled:opacity-40"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
