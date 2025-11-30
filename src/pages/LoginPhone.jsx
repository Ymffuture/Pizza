import React, { useState, useEffect } from "react";
import { api } from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Save session to localStorage
function persistSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("filebankUser", JSON.stringify(user));
}

export default function Login() {
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("identifier"); // "identifier" | "otp"
  const [loading, setLoading] = useState(false);
  const [devOtp, setDevOtp] = useState(null); // OTP for dev/testing
  const nav = useNavigate();

  // Auto-redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("filebankUser");
    if (token && user) nav("/dashboard/blog");
  }, [nav]);

  // Validate email or phone
  const isIdentifierValid = (id) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{9,15}$/;
    return emailRegex.test(id) || phoneRegex.test(id);
  };

  // Request OTP
  async function sendOtp(e) {
    e.preventDefault();
    setLoading(true);

    if (!isIdentifierValid(identifier)) {
      toast.error("Enter a valid email or phone number");
      setLoading(false);
      return;
    }

    try {
      const isEmail = identifier.includes("@");
      const endpoint = isEmail ? "/auth/request-login-otp" : "/auth/request-phone-otp";

      const res = await api.post(endpoint, isEmail ? { email: identifier } : { phone: identifier });

      // Show OTP in dev environment only
      if (res.data?.otp) {
        setDevOtp(res.data.otp);
        toast.success(`OTP (dev only): ${res.data.otp}`);
        setOtp(res.data.otp); // optionally prefill
      } else {
        toast.success("OTP sent successfully");
      }

      setStep("otp");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP request failed");
      console.error("REQUEST OTP ERROR:", err);
    } finally {
      setLoading(false);
    }
  }

  // Verify OTP and login
  async function verifyOtp(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const isEmail = identifier.includes("@");
      const endpoint = isEmail ? "/auth/verify-login-otp" : "/auth/verify-phone";

      const res = await api.post(endpoint, isEmail ? { email: identifier, code: otp } : { phone: identifier, code: otp });
      const { token, user } = res.data;

      if (!token) throw new Error("No token returned");

      persistSession(token, user);
      toast.success("Logged in ✅");
      nav("/dashboard/blog");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Invalid OTP");
      console.error("VERIFY OTP ERROR:", err);
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

        {step === "identifier" && (
          <form onSubmit={sendOtp} className="space-y-3">
            <input
              placeholder="Email or phone"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value.replace(/\s/g, ""))}
              required
              className="w-full text-center px-4 py-3 rounded-full border dark:border-gray-700 bg-gray-50 dark:bg-black text-black dark:text-white outline-none"
            />
            <button
              disabled={loading}
              className="w-full py-3 rounded-full font-medium bg-black text-white hover:opacity-90 active:scale-95 transition"
            >
              {loading ? "Sending OTP..." : "Request OTP"}
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
              className="w-full text-center px-4 py-3 rounded-full border dark:border-gray-700 bg-gray-50 dark:bg-black text-black dark:text-white outline-none"
            />
            <button
              disabled={loading}
              className="w-full py-3 rounded-full font-medium bg-black text-white hover:opacity-90 active:scale-95 transition"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            {devOtp && (
              <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
                Dev OTP: {devOtp}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
