import React, { useState } from "react";
import { api } from "../api";
import toast from "react-hot-toast";

export default function CommentRow({ comment, postId, onUpdate }) {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  // ---------------------------
  // LIKE COMMENT
  // ---------------------------
  async function likeComment() {
    try {
      await api.post(`/posts/${postId}/comments/${comment._id}/like`);
      onUpdate(); // refresh post
    } catch {
      toast.error("Failed to like comment");
    }
  }

  // ---------------------------
  // LOAD FIRST PAGE OF REPLIES
  // ---------------------------
  async function loadReplies() {
    if (showReplies) {
      setShowReplies(false);
      return;
    }

    setShowReplies(true);
    setLoadingReplies(true);

    try {
      const r = await api.get(
        `/posts/${postId}/comments/${comment._id}/replies?page=1&pageSize=10`
      );

      setReplies(r.data.replies || []);
    } catch {
      toast.error("Failed to load replies");
    }

    setLoadingReplies(false);
  }

  return (
    <div className="p-3 bg-gray-50 border rounded-xl">
      <div className="flex gap-3">
        <img
          src={comment.author?.avatar}
          className="w-10 h-10 rounded-full"
          alt="avatar"
        />

        <div className="flex-1">
          {/* AUTHOR NAME */}
          <strong>{comment.author?.name}</strong>

          {/* COMMENT TEXT */}
          <div className="text-sm mt-1 whitespace-pre-line">
            {comment.text}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4 mt-2 text-sm">
            <button onClick={likeComment}>
              ❤️ {comment.likes?.length || 0}
            </button>

            <button onClick={loadReplies}>
              {comment.replies?.length ?? 0} Replies
            </button>
          </div>

          {/* REPLIES SECTION */}
          {showReplies && (
            <div className="mt-3 space-y-3">
              {loadingReplies && (
                <div className="text-gray-500 text-sm">Loading replies...</div>
              )}

              {!loadingReplies &&
                replies.map((rep) => (
                  <div key={rep._id} className="flex gap-2">
                    <img
                      src={rep.author?.avatar}
                      className="w-8 h-8 rounded-full"
                      alt="avatar"
                    />
                    <div className="bg-white p-2 rounded-xl text-sm">
                      <strong>{rep.author?.name}</strong>
                      <div className="text-xs mt-1">{rep.text}</div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
