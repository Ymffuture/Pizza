import React, { useState } from "react";
import { api, setToken } from "../api";
import { toast} from "react-hot-toast";

export default function PostCard({ post, onRefresh }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

  // detect if current user liked — simple approach: frontend won't know user id; server returns liked state ideally
  async function toggleLike(){
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login first");
    setToken(token);
    try {
      const res = await api.post(`/posts/${post._id}/toggle-like`);
      setLikesCount(res.data.likesCount);
      setLiked(res.data.liked);
    } catch (err){
      toast.error("Could not like");
    }
  }

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 10, padding: 12, marginBottom: 12, background: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <strong>{post.author?.name || post.author?.phone}</strong>
        <small>{new Date(post.createdAt).toLocaleString()}</small>
      </div>
      <h3 style={{ margin: "6px 0" }}>{post.title}</h3>
      <p style={{ color: "#333" }}>{post.body}</p>
      {post.images && post.images.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {post.images.map((img) => <img key={img} src={img} style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 6 }} />)}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button onClick={toggleLike}>{likesCount} 👍</button>
      </div>
    </div>
  );
}
