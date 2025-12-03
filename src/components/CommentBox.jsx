// CommentBox.jsx
import React, { useState, useEffect, useRef } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { convertToHTML, convertFromHTML } from "draft-convert";
import { Editor } from "draft-js";
import "draft-js/dist/Draft.css";

import { api } from "../api";
import toast from "react-hot-toast";
import { Send, ImageIcon, Heart } from "lucide-react";
import { Picker } from "emoji-picker-react";

export default function CommentBox({ postId, onCommentUpdate }) {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
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

  function handleEditorChange(state) {
    setEditorState(state);
  }

  function getHTML() {
    return convertToHTML(editorState.getCurrentContent());
  }

  function getPlainText() {
    return editorState.getCurrentContent().getPlainText();
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
    const plainText = getPlainText();
    if (!plainText.trim()) return toast.error("Write something");

    const html = getHTML();
    try {
      const r = await api.post(`/posts/${postId}/comments`, {
        text: html,
        plainText,
      });
      setComments(prev => [...prev, r.data]);
      onCommentUpdate(postId, [...comments, r.data]);
      setEditorState(EditorState.createEmpty());
      toast.success("Comment posted");
    } catch {
      toast.error("Failed to post comment");
    }
  }

  function addEmoji(event, emojiObject) {
    const emoji = emojiObject.emoji;
    const content = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const newContent = ContentState.createFromText(
      content.getPlainText().slice(0, selection.getStartOffset()) + emoji + content.getPlainText().slice(selection.getEndOffset())
    );
    setEditorState(EditorState.createWithContent(newContent));
    setShowEmoji(false);
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-3 border">
        <div className="border p-2 rounded min-h-[100px]" onClick={() => {}}>
          <Editor
            editorState={editorState}
            onChange={handleEditorChange}
            placeholder="Write a comment..."
          />
        </div>

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
                const content = editorState.getCurrentContent();
                const newContent = ContentState.createFromText(
                  content.getPlainText() + `\n![image](${url})`
                );
                setEditorState(EditorState.createWithContent(newContent));
              }
            }}
          />

          <button onClick={() => setShowEmoji(s => !s)} className="p-2 rounded bg-gray-100">
            😊
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button onClick={submitComment} className="px-4 py-2 bg-black text-white rounded-full flex items-center gap-1">
              <Send size={14} /> Send
            </button>
          </div>
        </div>

        {showEmoji && (
          <div className="mt-2">
            <Picker onEmojiClick={addEmoji} />
          </div>
        )}
      </div>

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
