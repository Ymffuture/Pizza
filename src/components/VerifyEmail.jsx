import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../api";

export default function VerifyEmail() {
  const nav = useNavigate();
  const { state } = useLocation();
  const [code, setCode] = useState("");

  // Safety fallback if page opened without state
  const email = state?.email;
  if (!email) {
    toast.error("Invalid verification access");
    nav("/");
    return null; // stop rendering
  }

  async function verify() {
    try {
      await api.post("/auth/verify-email", { email, code });
      toast.success("Verified");
      nav("/dashboard/blog");
    } catch (err) {
      console.error(err);
      toast.error("Verification failed");
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-black transition-colors p-5">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 w-full max-w-[380px] shadow-md dark:shadow-none border border-gray-200 dark:border-zinc-800 transition-all">

        <h1 className="text-2xl font-semibold text-center text-gray-950 dark:text-white mb-4 tracking-tight">
          Verify Email
        </h1>

        <input
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          inputMode="numeric"
          className="w-full bg-white dark:bg-black text-center text-lg text-gray-900 dark:text-gray-100 px-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-black dark:focus:border-white transition"
        />

        <button
          onClick={verify}
          className="w-full mt-4 bg-black dark:bg-white text-white dark:text-black font-medium py-3 rounded-full active:scale-[0.97] hover:opacity-90 transition-transform"
        >
          Verify
        </button>

        <p className="text-center text-xs mt-4 text-gray-500 dark:text-gray-400">
          Code sent to <strong className="text-gray-900 dark:text-gray-100">{email}</strong>
        </p>

      </div>
    </main>
  );
}
