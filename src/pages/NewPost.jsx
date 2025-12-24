import React, { useState } from "react";
import { api } from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ImagePlus, X } from "lucide-react";

export default function NewPost() {
  const [body, setBody] = useState("");
  const [files, setFiles] = useState([]);
  const [posting, setPosting] = useState(false);
  const navigate = useNavigate();

  // ---------------------------
  // IMAGE UPLOAD
  // ---------------------------
  async function upload(file) {
    const fd = new FormData();
    fd.append("image", file);

    const token = localStorage.getItem("filebankUser")
      ? JSON.parse(localStorage.getItem("filebankUser")).token
      : null;

    const res = await api.post("/uploads/image", fd, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    return res.data.url;
  }

  // ---------------------------
  // FILE HANDLERS
  // ---------------------------
  const handleFiles = (e) => {
    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------------------------
  // SUBMIT (Facebook behavior)
  // ---------------------------
  const submit = async () => {
    if (!body.trim() && files.length === 0) return;

    setPosting(true);
    try {
      const images = await Promise.all(files.map(upload));

      await api.post("/posts", {
        body: body.trim(),
        images,
      });

      toast.success("Post shared");
      navigate("/dashboard/blog");
    } catch (err) {
      console.error(err);
      toast.error("Could not share post");
    } finally {
      setPosting(false);
    }
  };

  const canPost = body.trim().length > 0 || files.length > 0;

  return (
    <main className="bg-[#f0f2f5] dark:bg-black flex justify-center pt-12 px-4">
      <section className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-800">
        
        {/* HEADER */}
        <header className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 text-center">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Create post
          </h1>
        </header>

        {/* BODY */}
        <div className="px-4 pt-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            className="
              w-full resize-none text-lg
              bg-transparent
              text-gray-900 dark:text-white
              placeholder:text-gray-500
              focus:outline-none
            "
          />
        </div>

        {/* IMAGE PREVIEWS */}
        {files.length > 0 && (
          <div className="px-4 grid grid-cols-3 gap-2 mt-2">
            {files.map((file, i) => (
              <div key={i} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <button
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ACTION BAR */}
        <div className="px-4 py-3 mt-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer text-green-600 font-medium">
            <ImagePlus size={20} />
            Photo
            <input
              type="file"
              multiple
              onChange={handleFiles}
              className="hidden"
            />
          </label>

          <button
            onClick={submit}
            disabled={!canPost || posting}
            className={`
              px-6 py-2 rounded-lg font-semibold text-sm
              transition
              ${
                canPost
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            {posting ? "Posting…" : "Post"}
          </button>
        </div>
      </section>
    </main>
  );
}
