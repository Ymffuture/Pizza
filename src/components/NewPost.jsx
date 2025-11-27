import React, { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function NewPost(){
  const [title,setTitle]=useState("");
  const [body,setBody]=useState("");
  const [file, setFile]=useState(null);
  const nav = useNavigate();

  async function send(){
    let images=[];
    if (file){
      const fd=new FormData();
      fd.append("image", file);
      const r=await api.post("/uploads/image", fd);
      images=[r.data.url];
    }
    await api.post("/posts", {title, body, images});
    toast.success("Posted");
    nav("/dashboard/blog");
  }

  return (
    <div className="max-w-xl mx-auto mt-5 p-5 bg-white dark:bg-black/60 rounded-3xl shadow-xl border dark:border-gray-800">
      <h2 className="text-2xl font-semibold mb-4 text-center">New Blog Post</h2>
      <input placeholder="Post title" value={title} onChange={e=>setTitle(e.target.value)} required
        className="w-full px-4 py-3 text-sm rounded-full border dark:border-gray-800 dark:bg-black text-center mb-3"
      />
      <textarea placeholder="Write something..." value={body} onChange={e=>setBody(e.target.value)} required
        className="w-full px-4 py-3 text-sm rounded-2xl border dark:border-gray-800 dark:bg-black text-xs text-center h-32 mb-3"
      />

      <div className="flex justify-center">
        <label className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full cursor-pointer hover:opacity-80 text-xs active:scale-95">
          🖼 Upload image
          <input type="file" hidden accept="image/*" onChange={e=> setFile(e.target.files[0])}/>
        </label>
      </div>
      <button onClick={send} className="w-full mt-4 py-3 font-medium bg-black text-white rounded-full hover:opacity-80 active:scale-95 transition text-sm">Publish</button>
    </div>
  );
}
