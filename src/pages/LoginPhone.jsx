import React, { useState } from "react";
import { api, setToken } from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function LoginPhone(){
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const nav = useNavigate();

  async function requestOtp(){
    setLoading(true);
    try {
      const res = await api.post("/auth/request-phone-otp", { phone });
      toast.success("OTP requested. Dev returns OTP in response (for testing).");
      console.log("phone otp (dev):", res.data.devPreviewOtp);
      setOtpSent(true);
    } catch (err) {
      toast.error("Could not request OTP");
    } finally { setLoading(false); }
  }

  async function verify(){
    if (!code) return;
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-phone", { phone, code });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      toast.success("Logged in");
      nav("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid code");
    } finally { setLoading(false); }
  }

  return (
    <div style={{ maxWidth: 640, margin: "24px auto" }}>
      <h2>Login with Phone</h2>
      <div style={{ marginBottom: 8 }}>
        <label>Phone</label>
        <input value={phone} onChange={e=>setPhone(e.target.value)} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <button onClick={requestOtp} disabled={loading}>{loading ? "..." : "Request OTP"}</button>
      </div>

      {otpSent && (
        <>
          <div style={{ marginBottom: 8 }}>
            <label>OTP</label>
            <input value={code} onChange={e=>setCode(e.target.value)} />
          </div>
          <button onClick={verify} disabled={loading}>{loading ? "..." : "Verify & Login"}</button>
        </>
      )}
    </div>
  );
}
