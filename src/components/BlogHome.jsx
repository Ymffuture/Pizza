import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Heart, Trash2, Pencil, MoreHorizontal } from "lucide-react";

import {  Edit3 } from "react-icons/fa";
import { Dropdown } from "antd";
import { api } from "../api";
import toast from "react-hot-toast";

export default function BlogHome(){
  const [posts, setPosts] = useState([]);
  const nav = useNavigate();

  useEffect(()=>{
    api.get("/posts").then(r=> setPosts(r.data)).catch(()=> toast.error("Failed loading"));
  },[]);

  const PostMenu = (post) => ({
    overlay: (
      <div className="bg-white dark:bg-black rounded-2xl shadow-xl border dark:border-gray-800 w-32 overflow-hidden">
        {post.author.phone === post.phone && (
          <>
            <button onClick={()=> nav(`/dashboard/blog/edit/${post._id}`)} className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-gray-100">
              ✏ Edit
            </button>
            <button onClick={async()=>{
              await api.delete(`/posts/${post._id}`);
              toast.success("Deleted");
            }} className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-red-50 text-red-600">
              🗑 Delete
            </button>
          </>
        )}
      </div>
    ),
    trigger: ["click"],
    placement: "top"
  });

  return (
    <div className="pb-20">
      {posts.map(post=> (
        <div key={post._id} className="bg-white dark:bg-black/60 rounded-3xl shadow-md border dark:border-gray-800 mb-4 p-5">
        
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3 mb-3">
              <img src={post.author.avatar || "/default-avatar.png"} className="w-10 h-10 rounded-full object-cover"/>
              <p className="text-sm font-medium">{post.author.name}</p>
            </div>

            <Dropdown {...PostMenu(post)}>
              <MoreHorizontal size={22} className="cursor-pointer hover:opacity-60 transition"/>
            </Dropdown>
          </div>

          <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
          <p className="text-sm opacity-80 mb-3">{post.body}</p>

          {post.images?.length > 0 && (
            <img src={post.images[0]} className="w-full rounded-2xl"/>
          )}

          <div className="flex justify-between items-center mt-4">
            <button onClick={async()=>{
              const r = await api.post(`/posts/${post._id}/toggle-like`);
              toast.success(r.data.liked ? "Liked ❤️" : "Unliked 💔");
            }} className="flex items-center gap-1 text-sm">
              ❤️ {post.likes?.length || 0}
            </button>

            <span className="text-xs opacity-60">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* COMMENTS */}
          <div className="mt-4 border-t dark:border-gray-800 pt-3">
            <CommentBox postId={post._id}/>
          </div>
        </div>
      ))}
      <Outlet/>
    </div>
  );
}

// FACEBOOK STYLE COMMENT BOX
function CommentBox({postId}){
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(()=>{
    api.get(`/posts/${postId}`).then(r=> setComments(r.data.comments || []));
  },[postId]);

  async function send(){
    if (!text.trim()) return;
    const r = await api.post(`/posts/${postId}/comments`, {text});
    setComments([...comments, r.data]);
    setText("");
  }

  return (
    <div>
      <div className="flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-black border dark:border-gray-800 text-xs"
        />
        <button onClick={send} className="bg-black text-white px-4 rounded-full text-xs hover:opacity-80 active:scale-95">Post</button>
      </div>

      <div className="mt-3 space-y-2">
        {comments.map(c=>(
          <div key={c._id} className="flex gap-2">
            <img src={c.author.avatar || "/default-avatar.png"} className="w-7 h-7 rounded-full object-cover"/>
            <div className="bg-gray-100 dark:bg-black px-3 py-2 rounded-2xl text-xs w-fit max-w-[80%]">
              <span className="font-semibold block">{c.author.name}</span>
              {c.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
