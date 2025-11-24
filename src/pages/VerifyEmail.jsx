import React, { useState } from "react";
import { api } from "../api";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function VerifyEmail() {
  const loc = useLocation();
  const nav = useNavigate();
  const [email, setEmail] = useState(loc.state?.email || "");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function onVerify(e){
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/verify-email", { email, code });
      toast.success("Email verified — you can now request phone OTP and login");
      nav("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid code");
    } finally { setLoading(false); }
  }

  return (
    <div style={{ maxWidth: 640, margin: "24px auto" }}>
      <h2>Verify Email</h2>
      <form onSubmit={onVerify}>
        <div style={{ marginBottom: 8 }}>
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Code</label>
          <input value={code} onChange={e => setCode(e.target.value)} required />
        </div>
        <button disabled={loading}>{loading ? "..." : "Verify"}</button>
      </form>
    </div>
  );
}
