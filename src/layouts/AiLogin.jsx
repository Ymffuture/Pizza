import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import Loader from "./Loader";
const API_BASE = "https://swiftmeta.onrender.com/api";

const AuthModal = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  /* ===========================
     EMAIL / PASSWORD AUTH
  ============================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/auth/v2/${isLogin ? "login" : "register"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");

      toast.success("Welcome 👋");
      onLoginSuccess(data.token);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
     GOOGLE LOGIN
  ============================ */
  useEffect(() => {
    /* global google */
    if (!window.google) return;

    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          const res = await fetch(`${API_BASE}/auth/v2/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: response.credential }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Google login failed");

          toast("Welcome!");
          onLoginSuccess(data.token);
          onClose();
        } catch (err) {
          toast.error(err.message);
        }
      },
    });
  }, [onClose, onLoginSuccess]);

  const handleGoogleLogin = () => {
    google.accounts.id.prompt();
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

        {/* GOOGLE */}
        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-xl border-gray-400 text-[#202124] bg-gray-50 px-4 py-3"
          >
            <FcGoogle size={24} />
            Continue with Google
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
            className="w-full rounded-xl px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl px-4 py-3"
          />

          <button
  type="submit"
  disabled={loading}
  className="w-full h-12 flex items-center justify-center rounded-xl bg-black text-white"
>
  <span className={`transition-opacity ${loading ? "opacity-0" : "opacity-100"}`}>
    {isLogin ? "Sign in" : "Create account"}
  </span>

  {loading && (
    <span className="absolute">
      <Loader />
    </span>
  )}
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
