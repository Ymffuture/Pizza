import React, { useState } from "react";
import { api } from "../api";
import { toast} from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function NewPost(){
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState([]);
  const nav = useNavigate();

  async function upload(file){
    const fd = new FormData();
    fd.append("image", file);
    const res = await api.post("/uploads/image", fd, { headers: { "Content-Type": "multipart/form-data" }});
    return res.data.url;
  }

  async function submit(e){
    e.preventDefault();
    try {
      const uploaded = [];
      for (const f of images) {
        const url = await upload(f);
        uploaded.push(url);
      }
      await api.post("/posts", { title, body, images: uploaded });
      toast.success("Post created");
      nav("/");
    } catch (err){
      toast.error("Error creating post");
    }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h2>New Post</h2>
      <form onSubmit={submit}>
        <div style={{ marginBottom: 8 }}>
          <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <textarea placeholder="Body" value={body} onChange={e=>setBody(e.target.value)} rows={6} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <input type="file" multiple onChange={e=>setImages(Array.from(e.target.files))} />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
