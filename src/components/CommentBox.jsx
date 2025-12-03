// CommentRichBox.jsx
import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic"; // if using Next; otherwise import react-quill normally
import ReactQuill from "react-quill"; // npm i react-quill
import "react-quill/dist/quill.snow.css";
import { Picker } from "@katherineheadshall/emoji-mart-react";
import "@katherineheadshall/emoji-mart-react/dist/style.css";
import "emoji-mart/css/emoji-mart.css";
import { api } from "../api";
import toast from "react-hot-toast";
import { Send, ImageIcon, Heart } from "lucide-react";
import stripHtml from "string-strip-html"; // or implement simple regex

export default function CommentBox({ postId, onCommentUpdate }) {
  const [editorHtml, setEditorHtml] = useState("");
  const [plainText, setPlainText] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoadingComments(true);
    try {
      const r = await api.get(`/posts/${postId}`);
      setComments(r.data.comments || []);
      onCommentUpdate(postId, r.data.comments || []);
    } finally {
      setLoadingComments(false);
    }
  }

  function handleEditorChange(html) {
    setEditorHtml(html);
    setPlainText(stripHtml(html).result || stripHtml(html)); // adapt per library
  }

  async function uploadFile(file) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const r = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" }});
      return r.data.url;
    } catch {
      toast.error("Upload failed");
      return null;
    } finally { setUploading(false); }
  }

  async function submitComment() {
    if (!plainText.trim()) return toast.error("Write something");
    try {
      // mentions detection example: extract @username with regex and map to userId if needed
      const mentions = []; // implement mention resolution by searching user DB
      const media = []; // if you supported drag-drop with images, push URLs here

      const r = await api.post(`/posts/${postId}/comments`, {
        text: editorHtml,
        plainText,
        mentions,
        media
      });
      setComments(prev => [...prev, r.data]);
      onCommentUpdate(postId, [...comments, r.data]);
      setEditorHtml(""); setPlainText("");
      toast.success("Comment posted");
    } catch (e) {
      toast.error("Failed to post");
    }
  }

  async function likeComment(commentId) {
    try {
      const r = await api.post(`/posts/${postId}/comments/${commentId}/like`);
      setComments(prev => prev.map(c => c._id === commentId ? { ...c, likes: Array(r.data.likesCount).fill(1) } : c));
    } catch { toast.error("Failed"); }
  }

  // Minimal GIF picker integration: use Giphy SDK or a modal to pick gif url and then insert into comment as <img src=...>
  // Emoji picker: append emoji to HTML
  function addEmoji(e) {
    const char = e.native || e.colons || e.native;
    setEditorHtml(prev => prev + char);
    setShowEmoji(false);
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-3 border">
        <ReactQuill value={editorHtml} onChange={handleEditorChange} theme="snow" placeholder="Write a comment..." />

        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => fileRef.current.click()} className="p-2 rounded bg-gray-100">
            <ImageIcon size={16}/>
          </button>
          <input type="file" ref={fileRef} className="hidden" onChange={async (e) => {
            const f = e.target.files[0];
            if (!f) return;
            const url = await uploadFile(f);
            if (url) {
              // insert image tag into editor
              setEditorHtml(prev => prev + `<p><img src="${url}" alt="image" style="max-width:100%"/></p>`);
            }
          }} />

          <button onClick={() => setShowEmoji(s => !s)} className="p-2 rounded bg-gray-100">😊</button>

          <div className="ml-auto flex items-center gap-2">
            <button onClick={submitComment} className="px-4 py-2 bg-black text-white rounded-full">
              <Send size={14}/> Send
            </button>
          </div>
        </div>

        {showEmoji && (
          <div className="mt-2">
            <Picker onSelect={addEmoji} />
          </div>
        )}
      </div>

      {/* Comments list (short view). Each comment should display likes, replies summary */}
      <div className="space-y-3">
        {comments.map(c => (
          <CommentRow key={c._id} comment={c} postId={postId} onUpdate={() => load()} />
        ))}
      </div>
    </div>
  );
}

// Child component showing a comment (with like, reply button, load replies, delete)
function CommentRow({ comment, postId, onUpdate }) {
  const [showReplies, setShowReplies] = useState(false);
  const [repliesPage, setRepliesPage] = useState(1);
  const [replies, setReplies] = useState(comment.replies || []);
  const [loadingMore, setLoadingMore] = useState(false);

  async function toggleReplies() {
    setShowReplies(s => !s);
    if (!showReplies && replies.length === 0) {
      // load first page
      await loadReplies(1);
    }
  }

  async function loadReplies(page) {
    setLoadingMore(true);
    try {
      const r = await api.get(`/posts/${postId}/comments/${comment._id}/replies?page=${page}&pageSize=5`);
      setReplies(prev => [...prev, ...r.data.replies]);
      setRepliesPage(page);
    } catch {
      toast.error("Failed to load replies");
    } finally { setLoadingMore(false); }
  }

  async function like() {
    try {
      const r = await api.post(`/posts/${postId}/comments/${comment._id}/like`);
      // update UI quickly
      onUpdate();
    } catch { toast.error("Failed"); }
  }

  return (
    <div className="p-3 rounded-xl bg-gray-50 dark:bg-black/40 border">
      <div className="flex items-start gap-3">
        <img src={comment.author?.avatar} className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <strong>{comment.author?.name}</strong>
              <div className="text-xs text-gray-500" dangerouslySetInnerHTML={{__html: comment.text}} />
            </div>

            <div className="flex items-center gap-2">
              <button onClick={like} className="flex items-center gap-1">
                <Heart size={14} /> {comment.likes?.length || 0}
              </button>

              <button onClick={() => setShowReplies(s => !s)} className="text-xs">
                {comment.replies?.length || 0} Replies
              </button>
            </div>
          </div>

          {showReplies && (
            <div className="mt-3 space-y-2">
              {replies.map(rep => (
                <div key={rep._id} className="flex gap-2 items-start">
                  <img src={rep.author?.avatar} className="w-8 h-8 rounded-full" />
                  <div className="bg-white p-2 rounded-xl text-sm" dangerouslySetInnerHTML={{__html: rep.text}} />
                  <div className="flex gap-2 ml-auto">
                    <button onClick={() => likeReply(postId, comment._id, rep._id)} className="text-xs">Like</button>
                    <button onClick={() => deleteReply(postId, comment._id, rep._id)} className="text-xs text-red-500">Delete</button>
                  </div>
                </div>
              ))}

              {loadingMore ? (
                <div>Loading...</div>
              ) : (
                <button onClick={() => loadReplies(repliesPage + 1)} className="text-xs text-blue-600">
                  Load more replies
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Implement likeReply and deleteReply utility functions to call backend endpoints shown above
async function likeReply(postId, commentId, replyId) {
  try {
    const r = await api.post(`/posts/${postId}/comments/${commentId}/replies/${replyId}/like`);
    toast.success(r.data.liked ? "Liked" : "Unliked");
  } catch { toast.error("Failed"); }
}

async function deleteReply(postId, commentId, replyId) {
  try {
    await api.delete(`/posts/${postId}/comments/${commentId}/replies/${replyId}`);
    toast.success("Deleted reply");
  } catch { toast.error("Failed deleting"); }
}
