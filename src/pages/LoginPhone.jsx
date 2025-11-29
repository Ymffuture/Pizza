import React, { useState, useEffect } from "react";
import { api } from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // phone → otp
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  // ✅ Restore login on refresh
  useEffect(() => {
    const saved = localStorage.getItem("filebankUser");
    const token = localStorage.getItem("token");
    if (saved && token) {
      nav("/dashboard/blog");
    }
  }, [nav]);

  async function sendOtp(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login-phone", { phone });
      toast.success(res.data.message || "OTP sent to email");
      setStep("otp");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-login-otp", { phone, otp });

      // ✅ Save token so it survives refresh
      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "filebankUser",
        JSON.stringify(res.data.user)
      );

      toast.success("Logged in successfully");
      nav("/dashboard/blog");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-black p-5">
      <div className="bg-white dark:bg-black/60 w-full max-w-sm rounded-3xl p-6 shadow-xl border dark:border-gray-800">
        <h2 className="text-2xl text-center font-semibold mb-5">Welcome Back</h2>

        {/* STEP 1: enter phone */}
        {step === "phone" && (
          <form onSubmit={sendOtp} className="space-y-3">
            <input
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full text-center px-4 py-3 rounded-full border dark:border-gray-700 bg-gray-50 dark:bg-black"
            />

            <button
              disabled={loading}
              className="w-full py-3 rounded-full font-medium bg-black text-white hover:opacity-90 active:scale-95 transition"
            >
              {loading ? "Sending OTP..." : "Login"}
            </button>
          </form>
        )}

        {/* STEP 2: enter OTP */}
        {step === "otp" && (
          <form onSubmit={verifyOtp} className="space-y-3">
            <input
              placeholder="Enter OTP from email"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full text-center px-4 py-3 rounded-full border dark:border-gray-700 bg-gray-50 dark:bg-black"
            />

            <button
              disabled={loading}
              className="w-full py-3 rounded-full font-medium bg-black text-white hover:opacity-90 active:scale-95 transition"
            >
              {loading ? "Verifying OTP..." : "Verify OTP"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
