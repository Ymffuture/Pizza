import React, { useState, useEffect } from "react";
import { api } from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// ✅ Centralized token persistence
function persistSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("filebankUser", JSON.stringify(user));
}

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  // ✅ Restore session on refresh safely
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("filebankUser");

    if (token && user) {
      nav("/dashboard/blog");
    }
  }, [nav]);

  function isPhoneValid(number) {
    return /^[0-9]{9,15}$/.test(number);
  }

  async function sendOtp(e) {
    e.preventDefault();
    setLoading(true);

    if (!isPhoneValid(phone)) {
      toast.error("Use a valid phone number");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/login-phone-otp", { phone });
      toast.success(res.data.message || "OTP sent to your email");
      setStep("otp");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not request OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login-phone", { phone, code: otp });
      const { token, user } = res.data;

      persistSession(token, user);
      toast.success("Login complete ✅");
      nav("/dashboard/blog");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP check failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-black p-5">
      <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-3xl p-6 shadow-xl border dark:border-gray-800">
        <h2 className="text-2xl text-center font-semibold mb-5 text-black dark:text-white">
          Welcome Back
        </h2>

        {step === "phone" && (
          <form onSubmit={sendOtp} className="space-y-3">
            <input
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\s/g, ""))}
              required
              className="w-full text-center px-4 py-3 rounded-full border dark:border-gray-700 bg-gray-50 dark:bg-black text-black dark:text-white"
            />

            <button
              disabled={loading}
              className="w-full py-3 rounded-full font-medium bg-black text-white hover:opacity-90 active:scale-95 transition"
            >
              {loading ? "Sending OTP..." : "Login"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={verifyOtp} className="space-y-3">
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\s/g, ""))}
              required
              className="w-full text-center px-4 py-3 rounded-full border dark:border-gray-700 bg-gray-50 dark:bg-black text-black dark:text-white"
            />

            <button
              disabled={loading}
              className="w-full py-3 rounded-full font-medium bg-black text-white hover:opacity-90 active:scale-95 transition"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
