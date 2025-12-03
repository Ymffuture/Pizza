// CommentRichBox.jsx
import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import { api } from "../api";
import toast from "react-hot-toast";
import { Send, ImageIcon, Heart } from "lucide-react";
import stripHtml from "string-strip-html";

export default function CommentBox({ postId, onCommentUpdate }) {
  const [editorHtml, setEditorHtml] = useState("");
  const [plainText, setPlainText] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    loadComments();
  }, []);

  async function loadComments() {
    setLoadingComments(true);
    try {
      const res = await api.get(`/posts/${postId}`);
      setComments(res.data.comments || []);
      onCommentUpdate(postId, res.data.comments || []);
    } catch {
      toast.error("Failed to load comments");
    } finally {
      setLoadingComments(false);
    }
  }

  function handleEditorChange(html) {
    setEditorHtml(html);
    setPlainText(stripHtml(html).result || stripHtml(html));
  }

  async function uploadFile(file) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const r = await api.post("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return r.data.url;
    } catch {
      toast.error("Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function submitComment() {
    if (!plainText.trim()) return toast.error("Write something");
    try {
      const r = await api.post(`/posts/${postId}/comments`, {
        text: editorHtml,
        plainText,
      });
      setComments(prev => [...prev, r.data]);
      onCommentUpdate(postId, [...comments, r.data]);
      setEditorHtml("");
      setPlainText("");
      toast.success("Comment posted");
    } catch {
      toast.error("Failed to post comment");
    }
  }

  function addEmoji(emoji) {
    const sym = emoji.native;
    setEditorHtml(prev => prev + sym);
    setShowEmoji(false);
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-3 border">
        <ReactQuill
          value={editorHtml}
          onChange={handleEditorChange}
          theme="snow"
          placeholder="Write a comment..."
        />

        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => fileRef.current.click()} className="p-2 rounded bg-gray-100">
            <ImageIcon size={16} />
          </button>
          <input
            type="file"
            ref={fileRef}
            className="hidden"
            onChange={async e => {
              const f = e.target.files[0];
              if (!f) return;
              const url = await uploadFile(f);
              if (url) {
                setEditorHtml(prev => prev + `<p><img src="${url}" alt="image" style="max-width:100%" /></p>`);
              }
            }}
          />

          <button onClick={() => setShowEmoji(s => !s)} className="p-2 rounded bg-gray-100">
            😊
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button onClick={submitComment} className="px-4 py-2 bg-black text-white rounded-full">
              <Send size={14} /> Send
            </button>
          </div>
        </div>

        {showEmoji && (
          <div className="mt-2">
            <Picker onSelect={addEmoji} />
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.map(c => (
          <CommentRow key={c._id} comment={c} postId={postId} onUpdate={loadComments} />
        ))}
      </div>
    </div>
  );
}

function CommentRow({ comment, postId, onUpdate }) {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);

  async function likeComment() {
    try {
      await api.post(`/posts/${postId}/comments/${comment._id}/like`);
      onUpdate();
    } catch {
      toast.error("Failed to like comment");
    }
  }

  async function toggleReplies() {
    setShowReplies(s => !s);
    if (!showReplies && replies.length === 0) {
      // fetch first page of replies if needed
      try {
        const r = await api.get(`/posts/${postId}/comments/${comment._id}/replies?page=1&pageSize=5`);
        setReplies(r.data.replies || []);
      } catch {
        toast.error("Failed to load replies");
      }
    }
  }

  return (
    <div className="p-3 rounded-xl bg-gray-50 dark:bg-black/40 border">
      <div className="flex items-start gap-3">
        <img src={comment.author?.avatar} className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <strong>{comment.author?.name}</strong>
              <div className="text-xs text-gray-500" dangerouslySetInnerHTML={{ __html: comment.text }} />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={likeComment} className="flex items-center gap-1">
                <Heart size={14} /> {comment.likes?.length || 0}
              </button>
              <button onClick={toggleReplies} className="text-xs">
                {comment.replies?.length || 0} Replies
              </button>
            </div>
          </div>

          {showReplies && (
            <div className="mt-3 space-y-2">
              {replies.map(rep => (
                <div key={rep._id} className="flex gap-2 items-start">
                  <img src={rep.author?.avatar} className="w-8 h-8 rounded-full" />
                  <div className="bg-white p-2 rounded-xl text-sm" dangerouslySetInnerHTML={{ __html: rep.text }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
