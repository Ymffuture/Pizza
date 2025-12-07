import React, { useState, useEffect } from "react";
import { api } from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";



function persistSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("filebankUser", JSON.stringify(user));
}

export default function Login() {
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [otp, setOtp] = useState("");               // fixed controlled input
  const [step, setStep] = useState("identifier");
  const [loading, setLoading] = useState(false);
  const [devOtp, setDevOtp] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("filebankUser");
    if (token && user) nav("/dashboard/blog");
  }, [nav]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Email or phone
  const isIdentifierValid = (id) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id) || /^[0-9]{9,15}$/.test(id);

  // ----------------------------
  // SEND OTP
  // ----------------------------
  async function sendOtp(e) {
    e.preventDefault();
    setLoading(true);

    if (!isIdentifierValid(identifier)) {
      toast.error("Enter valid email or phone number", {
  icon: <AlertTriangle className="text-red-500" />,
});
      setLoading(false);
      return;
    }

    try {
      const isEmail = identifier.includes("@");
      const endpoint = isEmail
        ? "/auth/request-login-otp"
        : "/auth/request-phone-otp";

      const payload = isEmail ? { email: identifier } : { phone: identifier };
      const res = await api.post(endpoint, payload);

      const receivedOtp = res.data?.otp;

      // Only show for development
      if (receivedOtp) {
        setDevOtp(receivedOtp);
        toast(`Login OTP: ${receivedOtp}`, {
  duration: 30000, // 1 minute
});

      } else {
        toast("OTP sent successfully");
      }

      setStep("otp");
      setOtp("");                  // clear input
      setResendCooldown(30);
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP request failed");
      console.error("REQUEST OTP ERROR:", err);
    } finally {
      setLoading(false);
    }
  }

  // ----------------------------
  // VERIFY OTP
  // ----------------------------
  async function verifyOtp(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const isEmail = identifier.includes("@");
      const endpoint = isEmail
        ? "/auth/verify-login-otp"
        : "/auth/verify-phone";

      const payload = isEmail
        ? { email: identifier, code: otp }
        : { phone: identifier, code: otp };

      const res = await api.post(endpoint, payload);
      const { token, user } = res.data;

      persistSession(token, user);
      toast("Logged in");
      window.location.reload();
      nav("/dashboard/blog");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
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
              onChange={(e) =>
                setIdentifier(e.target.value.replace(/\s/g, ""))
              }
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
              value={otp}                                // FIXED controlled input
              onChange={(e) =>
                setOtp(e.target.value.replace(/\s/g, ""))
              }
              required
              className="w-full text-center px-4 py-3 rounded-full border dark:border-gray-700 bg-gray-50 dark:bg-black text-black dark:text-white outline-none"
            />

            <button
              disabled={loading}
              className="w-full py-3 rounded-full font-medium bg-black text-white hover:opacity-90 active:scale-95 transition"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            {/*
            {devOtp && (
              <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
                Login OTP: {devOtp}
              </p>
            )}
*/} 
            <button
              type="button"
              disabled={resendCooldown > 0 || loading}
              onClick={sendOtp}
              className={`w-full py-2 text-sm mt-2 rounde font-medium ${
                resendCooldown > 0
                  ? "bg-gray-400"
                  : "bg-gray-800 text-white"
              } transition`}
            >
              {resendCooldown > 0
                ? `Resend OTP in ${resendCooldown}s`
                : "Resend OTP"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
