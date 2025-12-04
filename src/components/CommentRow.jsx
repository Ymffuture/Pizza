import React, { useState } from "react";
import { api } from "../api";
import toast from "react-hot-toast";
import Picker from "emoji-picker-react";
import { Smile, Send } from "lucide-react";

export default function CommentBox({ postId, onCommentUpdate }) {
  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
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
      setShowPicker(false);

      onCommentUpdate(postId, r.data);
      toast.success("Comment added");
    } catch {
      toast.error("Failed to comment");
    }
    setLoading(false);
  }

  return (
    <div className="relative w-full">
      {/* Comment input container (Facebook style) */}
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-full">

        {/* Text Input */}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 bg-transparent outline-none text-sm"
        />

        {/* Emoji Button */}
        <button
          onClick={() => setShowPicker((v) => !v)}
          className="text-gray-600 dark:text-gray-300 hover:text-black"
        >
          <Smile size={20} />
        </button>

        {/* Send Button */}
        <button
          onClick={submitComment}
          disabled={loading}
          className="text-blue-600 hover:text-blue-800"
        >
          <Send size={18} />
        </button>
      </div>

      {/* Emoji Picker */}
      {showPicker && (
        <div className="absolute bottom-12 right-0 z-50 shadow-xl">
          <Picker
            onEmojiClick={(emoji) => setText((t) => t + emoji.emoji)}
            theme="light"
            width={300}
            height={350}
          />
        </div>
      )}
    </div>
  );
}
