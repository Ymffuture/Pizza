import React, { useState } from "react";
import { api } from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { PenLine, ImagePlus, X } from "lucide-react";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState([]); // ✅ re-enabled
  const [uploading, setUploading] = useState(false);
  const nav = useNavigate();

  async function upload(file) {
    const fd = new FormData();
    fd.append("image", file);

    const token = localStorage.getItem("filebankUser")
      ? JSON.parse(localStorage.getItem("filebankUser")).token
      : null;

    const res = await api.post("/uploads/image", fd, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return res.data.url;
  }

  function handleFileChange(e) {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]); // store selection
  }

  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function submit(e) {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      toast.error("A title and message are required");
      return;
    }

    setUploading(true);
    try {
      const uploaded = await Promise.all(files.map(upload)); // upload to Cloudinary

      await api.post("/posts", {
        title: title.trim(),
        body: body.trim(),
        images: uploaded, // ✅ now included
      });

      toast.success("Post shared");
      nav("/dashboard/blog");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Could not publish post");
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F5F7] dark:bg-black flex justify-center pt-12 px-4">
      <section className="w-full max-w-xl bg-white/50 dark:bg-gray-900/30 backdrop-blur-xl border border-gray-200 dark:border-gray-800 shadow-lg rounded-3xl p-6 sm:p-8 md:p-10 space-y-6">
        
        <header className="flex items-center gap-2">
          <PenLine size={28} />
          <h1 className="text-2xl sm:text-3xl font-semibold">
            New Post
          </h1>
        </header>

        <form onSubmit={submit} className="space-y-5">
          <input
            aria-label="Post title"
            placeholder="Give your post a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-lg font-medium px-4 py-3 rounded-2xl bg-gray-100/80 dark:bg-gray-800/40 border border-transparent focus:border-blue-500 outline-none transition-all"
          />

          <textarea
            aria-label="Post content"
            placeholder="What's on your mind?"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            className="w-full text-base sm:text-lg px-4 py-3 rounded-2xl bg-gray-100/80 dark:bg-gray-800/40 border border-transparent focus:border-blue-500 outline-none resize-none"
          />

          {/* ✅ File Upload UI is now visible */}
          <label
            htmlFor="image-upload"
            className="h-36 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/20 rounded-2xl cursor-pointer hover:border-blue-500 transition-all"
          >
            <ImagePlus size={26} className="text-gray-600 dark:text-gray-400 mb-2" />
            <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">
              Upload Images
            </span>
            <input
              id="image-upload"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* ✅ Image previews */}
          {files.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {files.map((file, i) => (
                <div key={i} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full aspect-square object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute top-1 right-1 p-[3px] rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="w-full py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-semibold text-lg active:scale-[0.99] transition-transform disabled:opacity-30"
          >
            {uploading ? "Posting..." : "Share Post"}
          </button>
        </form>

      </section>
    </main>
  );
}
