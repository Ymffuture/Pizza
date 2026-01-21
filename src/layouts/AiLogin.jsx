import React, { useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const AuthModal = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  /* ===========================
     EMAIL / PASSWORD
  ============================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = isLogin
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) throw error;

      toast.success("Welcome 👋");
      onLoginSuccess(data.session.access_token);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
     SOCIAL LOGIN
  ============================ */
  const signInWithProvider = async (provider) => {
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
    } catch {
      toast.error("Authentication failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 p-8 border border-black/10 dark:border-white/10">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ✕
        </button>

        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
          {isLogin ? "Sign in" : "Create account"}
        </h2>
        <p className="mt-1 text-center text-sm text-gray-500">
          Continue to SwiftMeta AI
        </p>

        {/* SOCIAL BUTTONS */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => signInWithProvider("google")}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <button
            onClick={() => signInWithProvider("facebook")}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition"
          >
            <FaFacebook size={20} className="text-blue-600" />
            Continue with Facebook
          </button>
        </div>

        {/* DIVIDER */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* EMAIL FORM */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black text-white py-3 text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
          </button>
        </form>

        {/* TOGGLE */}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          {isLogin
            ? "Don’t have an account? Create one"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
