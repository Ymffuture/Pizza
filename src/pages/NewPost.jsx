import React, { useState } from "react";
import { api } from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ImagePlus, X } from "lucide-react";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const nav = useNavigate();

  async function upload(file) {
    const fd = new FormData();
    fd.append("image", file);

    const token = localStorage.getItem("filebankUser")
      ? JSON.parse(localStorage.getItem("filebankUser")).role
      : null;

    const res = await api.post("/uploads/image", fd, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    return res.data.url;
  }

  async function submit(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const url = await upload(file);
        uploaded.push(url);
      }

      await api.post("/posts", {
        title: title.trim(),
        body: body.trim(),
        images: uploaded,
      });

      toast.success("Post created");
      nav("/");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to create post");
    } finally {
      setUploading(false);
    }
  }

  const removeFile = (name) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-black flex justify-center pt-10 sm:pt-16 px-4">
      <div
        className="
        w-full max-w-2xl
        bg-white/60 dark:bg-gray-900/40
        backdrop-blur-2xl
        border border-gray-200 dark:border-gray-800
        shadow-xl
        rounded-2xl
        p-6 sm:p-8 md:p-10
        space-y-6
      "
      >
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-semibold flex items-center gap-2">
          <ImagePlus size={26} />
          Create Post
        </h2>

        {/* Form */}
        <form onSubmit={submit} className="space-y-5">
          <input
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="
            w-full
            text-lg sm:text-xl
            px-4 py-3
            rounded-xl
            bg-gray-100/70 dark:bg-gray-800/70
            focus:ring-2 focus:ring-blue-500
            outline-none transition
          "
          />

          <textarea
            placeholder="Write something amazing..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            className="
            w-full
            text-base sm:text-lg
            px-4 py-3
            rounded-xl
            bg-gray-100/70 dark:bg-gray-800/70
            focus:ring-2 focus:ring-blue-500
            outline-none resize-none transition
          "
          />

          {/* File upload */}
          <label
            className="
            flex flex-col items-center justify-center
            w-full
            h-28 sm:h-36
            border border-dashed border-gray-300 dark:border-gray-700
            rounded-xl cursor-pointer
            hover:bg-gray-50 dark:hover:bg-gray-800/50 transition
          "
          >
            <ImagePlus size={32} className="text-gray-500 mb-2" />
            <span className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400">
              Upload images
            </span>
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="hidden"
            />
          </label>

          {/* Preview row */}
          {files.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
              {files.map((file) => (
                <div key={file.name} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full aspect-square object-cover rounded-xl border dark:border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(file.name)}
                    className="
                    absolute top-1 right-1
                    bg-white/80 dark:bg-black/60
                    p-1 rounded-full
                    opacity-0 group-hover:opacity-100 transition
                  "
                  >
                    <X size={16} className="text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={uploading}
            className="
            w-full
            py-3 sm:py-4
            rounded-xl
            bg-black dark:bg-white
            text-white dark:text-black
            font-semibold text-lg
            active:scale-[0.98] transition
            disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed
          "
          >
            {uploading ? "Publishing..." : "Publish"}
          </button>
        </form>
      </div>
    </div>
  );
}
