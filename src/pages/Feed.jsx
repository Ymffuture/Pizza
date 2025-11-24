import React, { useEffect, useState } from "react";
import { api } from "../api";
import PostCard from "../components/PostCard";

export default function Feed(){
  const [posts, setPosts] = useState([]);

  async function load(){
    const res = await api.get("/posts");
    setPosts(res.data);
  }

  useEffect(()=>{ load(); }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2>Feed</h2>
      </div>

      {posts.map(p => <PostCard key={p._id} post={p} />)}
    </div>
  );
}
