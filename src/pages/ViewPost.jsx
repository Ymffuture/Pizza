import React, { useEffect, useState } from "react";
import { X, Send } from "lucide-react";
import { api } from "../api";
import toast from "react-hot-toast";

const FALLBACK_IMAGES = {
  avatar: "https://swiftmeta.vercel.app/pp.jpeg",
  error: "https://swiftmeta.vercel.app/err.jpg",
};

export default function ViewPostModal({ postId, visible, onClose }) {
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCommenting, setIsCommenting] = useState(false);

  useEffect(() => {
    if (visible) fetchPost();
  }, [visible]);

  const fetchPost = async () => {
    if (!postId) return;
    
    setIsLoading(true);
    try {
      const { data } = await api.get(`/posts/${postId}`);
      setPost(data);
    } catch (error) {
      toast.error("Failed to load post");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    const trimmedText = commentText.trim();
    if (!trimmedText) return;

    setIsCommenting(true);
    try {
      const { data: newComment } = await api.post(`/posts/${postId}/comments`, { 
        text: trimmedText 
      });
      
      setPost(prev => ({
        ...prev,
        comments: [...(prev?.comments || []), newComment],
      }));
      setCommentText("");
    } catch (error) {
      toast.error("Failed to post comment");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <article className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur supports-[backdrop-filter]:bg-white/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate pr-4">
            {post?.title || "Loading..."}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all duration-200"
            aria-label="Close modal"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {isLoading ? (
            <LoadingState />
          ) : (
            <>
              <PostContent body={post.body} images={post.images} />
              <CommentsSection comments={post.comments} />
            </>
          )}
        </div>

        {/* Sticky Comment Input */}
        {!isLoading && (
          <footer className="border-t border-gray-200 dark:border-gray-800 px-5 py-4 bg-gray-50/80 dark:bg-gray-800/50 backdrop-blur">
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a comment..."
                disabled={isCommenting}
                className="flex-1 px-5 py-2.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              <button
                onClick={handleSubmitComment}
                disabled={!commentText.trim() || isCommenting}
                className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 active:scale-95 disabled:opacity-40 disabled:active:scale-100 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-600/20"
                aria-label="Send comment"
              >
                <Send size={18} className={isCommenting ? "animate-pulse" : ""} />
              </button>
            </div>
          </footer>
        )}
      </article>
    </div>
  );
}

// Sub-components for better organization

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
        Loading post...
      </p>
    </div>
  );
}

function PostContent({ body, images }) {
  return (
    <section className="space-y-4">
      <p className="whitespace-pre-line text-gray-800 dark:text-gray-200 leading-relaxed text-[15px]">
        {body}
      </p>
      
      {images?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Post attachment ${index + 1}`}
              loading="lazy"
              className="rounded-xl object-cover w-full h-64 sm:h-80 hover:opacity-95 transition-opacity cursor-pointer"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMAGES.error;
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function CommentsSection({ comments = [] }) {
  if (comments.length === 0) {
    return (
      <section className="pt-6 border-t border-gray-200 dark:border-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Comments</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      </section>
    );
  }

  return (
    <section className="pt-6 border-t border-gray-200 dark:border-gray-800">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Comments <span className="text-gray-500 font-normal ml-1">({comments.length})</span>
      </h3>
      
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentBubble key={comment._id} comment={comment} />
        ))}
      </div>
    </section>
  );
}

function CommentBubble({ comment }) {
  const { author, text } = comment;
  
  return (
    <div className="flex gap-3 group">
      <img
        src={author?.avatar || FALLBACK_IMAGES.avatar}
        alt={`${author?.name || "User"}'s avatar`}
        className="w-9 h-9 rounded-full object-cover ring-2 ring-white dark:ring-gray-800 flex-shrink-0"
        loading="lazy"
      />
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[85%] hover:bg-gray-200 dark:hover:bg-gray-750 transition-colors">
        <p className="font-semibold text-xs text-gray-900 dark:text-gray-200 mb-0.5">
          {author?.name || "Anonymous"}
        </p>
        <p className="text-sm text-gray-800 dark:text-gray-300 leading-snug">
          {text}
        </p>
      </div>
    </div>
  );
}
