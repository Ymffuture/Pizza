import React, { useState, useEffect } from "react";
import { api } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function EditPost() {
  const { id } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    loadPost();
  }, []);

  async function loadPost() {
    try {
      const r = await api.get(`/posts/${id}`);
      setTitle(r.data.title);
      setBody(r.data.body);
      setImages(r.data.images || []);
    } catch (e) {
      toast.error("Failed to load post");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setSaving(true);
    try {
      await api.put(`/posts/${id}`, { title, body, images });
      toast.success("Post updated");
      nav("/dashboard/blog");
    } catch (e) {
      toast.error("Failed to update");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-center p-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto pt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>

      <input
        className="w-full px-4 py-3 mb-3 border rounded-xl"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
      />

      <textarea
        className="w-full px-4 py-3 h-40 mb-3 border rounded-xl"
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Write something..."
      />

      <button
        onClick={save}
        disabled={saving}
        className="w-full py-3 bg-black text-white rounded-xl"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
