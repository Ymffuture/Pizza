import React, { useState, useEffect } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Mail, Smartphone, ArrowLeft, Shield } from "lucide-react";

function persistSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("filebankUser", JSON.stringify(user));
}

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("identifier");
  const [loading, setLoading] = useState(false);
  const [devOtp, setDevOtp] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("filebankUser");
    if (token && user) nav("/dashboard/blog");
  }, [nav]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const isIdentifierValid = (id) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id) || /^[0-9]{9,15}$/.test(id);

  const isEmail = identifier.includes("@");

  async function sendOtp(e) {
    e?.preventDefault();
    setLoading(true);
    setError(null);

    if (!isIdentifierValid(identifier)) {
      setError("Please enter a valid email or phone number");
      setLoading(false);
      return;
    }

    try {
      const endpoint = isEmail ? "/auth/request-login-otp" : "/auth/request-phone-otp";
      const payload = isEmail ? { email: identifier } : { phone: identifier };
      const res = await api.post(endpoint, payload);

      const receivedOtp = res.data?.otp;
      if (receivedOtp) setDevOtp(receivedOtp);

      setStep("otp");
      setOtp("");
      setResendCooldown(30);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
      console.error("REQUEST OTP ERROR:", err);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = isEmail ? "/auth/verify-login-otp" : "/auth/verify-phone";
      const payload = isEmail
        ? { email: identifier, code: otp }
        : { phone: identifier, code: otp };

      const res = await api.post(endpoint, payload);
      const { token, user } = res.data;

      persistSession(token, user);
      nav("/dashboard/blog");
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
      console.error("VERIFY OTP ERROR:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/20 border border-gray-200 dark:border-gray-800 overflow-hidden">
          
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black mb-4">
              {step === "identifier" ? (
                isEmail ? <Mail size={20} /> : <Smartphone size={20} />
              ) : (
                <Shield size={20} />
              )}
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
              {step === "identifier" ? "Welcome Back" : "Verify Identity"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {step === "identifier" 
                ? "Enter your email or phone to continue" 
                : `Code sent to ${identifier}`}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mx-8 mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 flex items-center gap-3 text-sm text-red-700 dark:text-red-400">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Forms */}
          <div className="px-8 pb-8">
            {step === "identifier" ? (
              <form onSubmit={sendOtp} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Email or phone number"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value.replace(/\s/g, ""))}
                    required
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all text-center font-medium"
                  />
                </div>

                <button
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-semibold bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "Continue"
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyOtp} className="space-y-4">
                {/* OTP Display Banner */}
                {devOtp && (
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 p-4 text-white shadow-lg">
                    <div className="absolute inset-0 bg-white/10" />
                    <div className="relative flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-white/80 uppercase tracking-wider mb-1">Development OTP</p>
                        <p className="text-2xl font-mono font-bold tracking-widest">{devOtp}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Shield size={20} className="text-white" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    autoFocus
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all text-center text-2xl font-mono tracking-[0.5em]"
                  />
                </div>

                <button
                  disabled={loading || otp.length < 4}
                  className="w-full py-4 rounded-2xl font-semibold bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    "Verify & Login"
                  )}
                </button>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep("identifier")}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft size={14} />
                    Back
                  </button>

                  <button
                    type="button"
                    disabled={resendCooldown > 0 || loading}
                    onClick={sendOtp}
                    className="text-sm font-medium text-gray-900 dark:text-white disabled:text-gray-400 dark:disabled:text-gray-600 transition-colors"
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Security Note */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
          Secured with end-to-end encryption
        </p>
      </div>
    </div>
  );
}
