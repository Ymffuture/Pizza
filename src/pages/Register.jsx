import React, { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register(){
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function onSubmit(e){
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { phone, email, name, avatar });
      toast.success("Check email for OTP");
      nav("/dashboard/blog/verify-email", { state: { email } });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error");
    } finally { setLoading(false); }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 dark:bg-black p-5">
      <div className="bg-white dark:bg-gray-900 w-full max-w-sm p-6 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-semibold text-center mb-4">Create Account</h2>

        <div className="flex justify-center mb-5">
          <label className="relative">
            <input type="file" accept="image/*" 
              onChange={async (e)=>{
                const f = e.target.files[0];
                const r = await api.post("/uploads/image", new FormData().append("image", f));
                setAvatar(r.data.url);
              }}
              className="hidden"
            />
            <img src={avatar || "/default-avatar.png"} className="w-20 h-20 rounded-full object-cover border-2 dark:border-gray-700 cursor-pointer"/>
            <span className="absolute bottom-0 right-0 bg-black text-white text-xs px-2 py-1 rounded-full">Edit</span>
          </label>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <input placeholder="Cellphone number" value={phone} onChange={e=>setPhone(e.target.value)} required
            className="w-full px-4 py-3 rounded-full border dark:border-gray-700 dark:bg-black"
          />
          <input placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} required
            className="w-full px-4 py-3 rounded-full border dark:border-gray-700 dark:bg-black"
          />
          <input placeholder="Display name" value={name} onChange={e=>setName(e.target.value)}
            className="w-full px-4 py-3 rounded-full border dark:border-gray-700 dark:bg-black"
          />

          <button disabled={loading} className="w-full py-3 rounded-full font-medium bg-black text-white hover:opacity-90 active:scale-95 transition">
            {loading ? "Loading..." : "Register"}
          </button>
        </form>

        <p className="text-center text-xs mt-4 text-gray-400">
          A code will be sent to your email
        </p>
      </div>
    </div>
  );
}
