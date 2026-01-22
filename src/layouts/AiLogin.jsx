import React, { useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const API_BASE = "https://swiftmeta.onrender.com/api";

const AuthModal = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  /* ===========================
     EXCHANGE SUPABASE → BACKEND JWT
  ============================ */
  const exchangeToken = async (supabaseToken) => {
    const res = await fetch(`${API_BASE}/auth/supabase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseToken}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Authentication failed");

    return data.token;
  };

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

      const backendToken = await exchangeToken(
        data.session.access_token
      );

      toast.success("Welcome 👋");
      onLoginSuccess(backendToken);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
     SOCIAL LOGIN (GOOGLE / FB)
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
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 dark:text-white p-8 border border-black/10 dark:border-white/10">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-center">
          {isLogin ? "Sign in" : "Create account"}
        </h2>

        {/* SOCIAL */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => signInWithProvider("google")}
            className="w-full flex items-center justify-center gap-3 rounded-xl border px-4 py-3"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <button
            onClick={() => signInWithProvider("facebook")}
            className="w-full flex items-center justify-center gap-3 rounded-xl border px-4 py-3"
          >
            <FaFacebook size={20} className="text-blue-600" />
            Continue with Facebook
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border px-4 py-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black text-white py-3"
          >
            {loading ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 w-full text-sm text-gray-500"
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
