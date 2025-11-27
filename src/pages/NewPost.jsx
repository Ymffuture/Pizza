import React, { useState } from "react";
import { api } from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { PenLine /*, ImagePlus, X*/ } from "lucide-react";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [uploading, setUploading] = useState(false);
  const nav = useNavigate();

  // ─────────────────────────────────────────────────────────────
  // IMAGE UPLOAD (Cloudinary) — preserved but disabled for now
  // const [files, setFiles] = useState([]);
  //
  // async function upload(file) {
  //   const fd = new FormData();
  //   fd.append("image", file);
  //
  //   const token = localStorage.getItem("filebankUser")
  //     ? JSON.parse(localStorage.getItem("filebankUser")).token
  //     : null;
  //
  //   const res = await api.post("/uploads/image", fd, {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //       ...(token && { Authorization: `Bearer ${token}` }),
  //     },
  //   });
  //
  //   return res.data.url;
  // }
  // ─────────────────────────────────────────────────────────────

  async function submit(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("A title and message are required");
      return;
    }

    setUploading(true);
    try {
      await api.post("/posts", {
        title: title.trim(),
        body: body.trim(),
        // images: uploaded,  ← disabled while upload UI is commented
      });

      toast.success("Post shared");
      nav("/");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Could not publish post");
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F5F7] dark:bg-black flex justify-center pt-12 px-4">
      <section
        className="
          w-full max-w-xl
          bg-white/50 dark:bg-gray-900/30
          backdrop-blur-xl
          border border-gray-200 dark:border-gray-800
          shadow-lg hover:shadow-xl transition-shadow
          rounded-3xl
          p-6 sm:p-8 md:p-10
          space-y-6
        "
      >
        {/* HEADER */}
        <header className="flex items-center gap-2">
          <PenLine size={28} />
          <h1 className="text-2xl sm:text-3xl font-semibold">
            New Post
          </h1>
        </header>

        {/* FORM */}
        <form onSubmit={submit} className="space-y-5">
          <input
            aria-label="Post title"
            placeholder="Give your post a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="
              w-full
              text-lg font-medium
              px-4 py-3
              rounded-2xl
              bg-gray-100/80 dark:bg-gray-800/40
              border border-transparent focus:border-blue-500
              focus:ring-2 focus:ring-blue-500/30
              outline-none transition-all
            "
          />

          <textarea
            aria-label="Post content"
            placeholder="What's on your mind?"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            className="
              w-full
              text-base sm:text-lg
              px-4 py-3
              rounded-2xl
              bg-gray-100/80 dark:bg-gray-800/40
              border border-transparent focus:border-blue-500
              focus:ring-2 focus:ring-blue-500/30
              outline-none resize-none transition-all
            "
          />

          {/* ─────────────────────────────────────────────────────────
            IMAGE UPLOAD UI COMMENTED OUT FOR NOW
          ───────────────────────────────────────────────────────── 
          <label className="..."> ... </label>
          {files.length > 0 && <div> ...preview... </div>}
          ───────────────────────────────────────────────────────── */}

          <button
            type="submit"
            aria-busy={uploading}
            disabled={uploading}
            className="
              w-full
              py-4
              rounded-2xl
              bg-black dark:bg-white
              text-white dark:text-black
              font-semibold text-lg
              active:scale-[0.99] transition-transform
              disabled:opacity-30 disabled:cursor-not-allowed
            "
          >
            {uploading ? "Posting..." : "Share Post"}
          </button>
        </form>
      </section>
    </main>
  );
}
