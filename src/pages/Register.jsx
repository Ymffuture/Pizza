import React, { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("name", name);
      if (avatarFile) formData.append("avatar", avatarFile); // ✅ key matches backend

      // ✅ Wait for backend to confirm OTP email was sent
      const res = await api.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Only continue if request succeeded
      if (res.data?.message) {
        toast.success("Check your email for the verification code 📩");
        nav("/dashboard/blog/verify-email", { state: { email } });
      } else {
        toast.error("Didn't receive confirmation from server");
      }

    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg);
      console.error("REGISTER ERROR:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 dark:bg-black p-5">
      <div className="bg-white dark:bg-gray-900 w-full max-w-sm p-6 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-semibold text-center mb-4 text-black dark:text-white">
          Create Account
        </h2>

        <div className="flex justify-center mb-5">
          <label className="relative cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files[0])}
              className="hidden"
            />
            <img
              src={
                avatarFile
                  ? URL.createObjectURL(avatarFile)
                  : "https://via.placeholder.com/80?text=Avatar"
              }
              alt="User avatar"
              className="w-20 h-20 rounded-full object-cover border-2 dark:border-gray-700"
            />
            <span className="absolute bottom-0 right-0 bg-black text-white text-[10px] px-2 py-1 rounded-full">
              Edit
            </span>
          </label>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            placeholder="Cellphone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 dark:bg-black text-sm text-black dark:text-white outline-none text-center"
          />

          <input
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 dark:bg-black text-sm text-black dark:text-white outline-none text-center"
          />

          <input
            placeholder="Display name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 dark:bg-black text-sm text-black dark:text-white outline-none text-center"
          />

          <button
            type="submit"
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
