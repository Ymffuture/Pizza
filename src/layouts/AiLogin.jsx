import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import Loader from "./Loader";

const API_BASE = "https://swiftmeta.onrender.com/api";
const GOOGLE_CLIENT_ID =
  "744445938022-nju0135l9hs6fcs4eb4nnk5gadgq48tv.apps.googleusercontent.com";

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
      const { data } = await axios.post(
        `${API_BASE}/auth/v2/${isLogin ? "login" : "register"}`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Welcome 👋");
      onLoginSuccess(data.token);
      onClose();
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Authentication failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
     GOOGLE LOGIN (GIS)
  ============================ */
  useEffect(() => {
    if (!window.google) return;

    const container = document.getElementById("google-hidden-btn");
    if (!container) return;

    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });

    // Google renders its OWN button here (must be EMPTY)
    google.accounts.id.renderButton(container, {
      theme: "outline",
      size: "large",
      width: "300",
    });
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        `${API_BASE}/auth/v2/google`,
        { token: response.credential },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Welcome 👋");
      onLoginSuccess(data.token);
      onClose();
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Google login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const googleBtn = document.querySelector(
      "#google-hidden-btn [role=button]"
    );
    googleBtn?.click();
  };

  /* ===========================
     UI
  ============================ */
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

        {/* GOOGLE (VISIBLE BUTTON) */}
        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-xl border bg-gray-50 px-4 py-3 text-[#202124]"
          >
            <FcGoogle size={24} />
            Continue with Google
          </button>
        </div>

        {/* GOOGLE (HIDDEN CONTAINER — MUST BE EMPTY) */}
        <div id="google-hidden-btn" className="hidden" />

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
            className="relative w-full h-12 flex items-center justify-center rounded-xl bg-black text-white"
          >
            <span
              className={`transition-opacity ${
                loading ? "opacity-0" : "opacity-100"
              }`}
            >
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
