import React, { useState } from "react";
import { api, setToken } from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function onSubmit(e){
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login-phone", { phone });
      setToken(res.data.token);
      toast.success("Logged in");
      nav("/dashboard/blog");
    } catch(err){
      toast.error("Login failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-black p-5">
      <div className="bg-white dark:bg-black/60 w-full max-w-sm rounded-3xl p-6 shadow-xl border dark:border-gray-800">
        <h2 className="text-2xl text-center font-semibold mb-5">Welcome Back</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <input placeholder="Enter phone number" value={phone} onChange={e=>setPhone(e.target.value)} required
            className="w-full text-center px-4 py-3 rounded-full border dark:border-gray-700 bg-gray-50 dark:bg-black"
          />
          <button disabled={loading} className="w-full py-3 rounded-full font-medium bg-black text-white hover:opacity-90 active:scale-95 transition">
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
