import React, { useEffect, useState } from "react";
import { api } from "../api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function ViewPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [text, setText] = useState("");

  useEffect(() => {
    api.get(`/posts/${id}`).then(r => setPost(r.data));
  }, [id]);

  async function sendComment() {
    if (!text.trim()) return;
    try {
      const r = await api.post(`/posts/${id}/comments`, { text });
      setPost(prev => ({ ...prev, comments: [...prev.comments, r.data] }));
      setText("");
    } catch {
      toast.error("Failed to comment");
    }
  }

  if (!post) return <p className="text-center p-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto pt-8 p-4">
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p className="mb-4 opacity-80">{post.body}</p>

      <hr className="my-4" />

      <h3 className="text-lg font-bold mb-2">Comments</h3>

      <div className="flex items-center gap-2 mb-3">
        <input
          placeholder="Write a comment..."
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-full"
        />
        <button onClick={sendComment} className="bg-black text-white px-4 py-2 rounded-full">
          Send
        </button>
      </div>

      <div className="space-y-3">
        {post.comments?.map(c => (
          <div key={c._id} className="flex gap-2">
            <img
              src={c.author?.avatar}
              className="w-8 h-8 rounded-full"
            />
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-xl text-sm">
              <b>{c.author?.name}</b>
              <p>{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
