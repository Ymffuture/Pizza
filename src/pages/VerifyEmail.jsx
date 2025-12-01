import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../api";

export default function VerifyEmail() {
  const nav = useNavigate();
  const location = useLocation();
  const state = location.state;

  // Prevent crash if page is opened without navigation state
  if (!state?.email) {
    toast.error("No email to verify. Please register again.");
    nav("/");
    return null;
  }

  const [code, setCode] = useState("");

  async function verify() {
    try {
      await api.post("/auth/verify-email", { email: state.email, code });
      toast.success("Verified");
      nav("/dashboard/blog");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Verification failed");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-black p-5">
      <div className="bg-white dark:bg-black/60 p-6 rounded-3xl shadow-xl border dark:border-gray-800 w-full max-w-sm">
        <h2 className="text-xl font-semibold text-center mb-4">Verify your Email</h2>

        <input
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          inputMode="numeric"
          pattern="[0-9]*"
          className="w-full text-center px-4 py-3 rounded-full border dark:border-gray-700 dark:bg-black mb-3"
        />

        <button
          onClick={verify}
          className="w-full py-3 rounded-full font-medium bg-black text-white hover:opacity-90 active:scale-95"
        >
          Verify
        </button>

        <p className="text-center text-xs mt-4 text-gray-400">
          A code was sent to <b>{state.email}</b>
        </p>
      </div>
    </div>
  );
}
