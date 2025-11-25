import React, { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register(){
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function onSubmit(e){
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { phone, email, name });
      toast.success("Registered. Check email for OTP (dev shows OTP in response).");
      // in dev we return OTP in res.data.devPreviewOtp
      console.log("email otp (dev):", res.data.devPreviewOtp);
      nav("/verify-email", { state: { email } });
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Error");
    } finally { setLoading(false); }
  }

  return (
    <div style={{ maxWidth: 640, margin: "24px auto" }}>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>Phone (login)</label>
          <input value={phone} onChange={e=>setPhone(e.target.value)} required />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Email (for OTP)</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Name (optional)</label>
          <input value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <button disabled={loading}>{loading ? "Please wait..." : "Register"}</button>
      </form>
    </div>
  );
} 
