import React, { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  // CORRECT register submit
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/register", { phone, email, name, avatar });
      toast.success("OTP sent, check your email 📩");
      nav("/dashboard/blog/verify-email", { state: { email } });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed ❌");
      console.error("REGISTER ERROR:", err);
    } finally {
      setLoading(false);
    }
  }

  // ✅ FIXED image upload logic
  async function handleAvatarUpload(file) {
    const fd = new FormData();
    fd.append("image", file);

    try {
      const res = await api.post("/uploads/image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAvatar(res.data.url);
      toast.success("Avatar uploaded ✅");
    } catch (err) {
      toast.error("Image upload failed ❌");
      console.error("IMAGE ERROR:", err);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 dark:bg-black p-5">
      <div className="bg-white dark:bg-gray-900 w-full max-w-sm p-6 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-semibold text-center mb-4 text-black dark:text-white">
          Create Account 🍎
        </h2>

        {/* AVATAR PICK */}
        <div className="flex justify-center mb-5">
          <label className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files[0];
                if (f) handleAvatarUpload(f);
              }}
              className="hidden"
            />
            <img
              src={avatar || "/default-avatar.png"}
              className="w-20 h-20 rounded-full object-cover border-2 dark:border-gray-700 cursor-pointer"
            />
            <span className="absolute bottom-0 right-0 bg-black text-white text-[10px] px-2 py-1 rounded-full">
              Edit
            </span>
          </label>
        </div>

        {/* FORM */}
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            placeholder="Cellphone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 dark:bg-black text-sm text-black dark:text-white outline-none"
          />

          <input
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 dark:bg-black text-sm text-black dark:text-white outline-none"
          />

          <input
            placeholder="Display name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 dark:bg-black text-sm text-black dark:text-white outline-none"
          />

          <button
            disabled={loading}
            className="w-full py-3 rounded-full font-medium bg-black text-white hover:opacity-90 active:scale-95 transition text-sm"
          >
            {loading ? "Processing..." : "Register"}
          </button>
        </form>

        <p className="text-center text-[11px] mt-4 text-gray-500 dark:text-gray-400">
          A verification code will be delivered to your email
        </p>
      </div>
    </div>
  );
}
