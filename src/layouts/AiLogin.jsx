import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  Zap
} from "lucide-react";
import { Input, Button, Divider, Tooltip, Badge } from "antd";
import Loader from "./Loader";

const API_BASE = "https://swiftmeta.onrender.com/api";
const GOOGLE_CLIENT_ID = "744445938022-nju0135l9hs6fcs4eb4nnk5gadgq48tv.apps.googleusercontent.com";

// Animated Star Background Component
const StarBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    const createParticles = () => {
      particles = [];
      const colors = ['#60a5fa', '#a78bfa', '#f472b6', '#34d399', '#fbbf24'];
      
      for (let i = 0; i < 150; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 0.5,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          alpha: Math.random(),
          color: colors[Math.floor(Math.random() * colors.length)],
          pulse: Math.random() * 0.02
        });
      }
    };
    
    const draw = () => {
      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(0.5, '#1e1b4b');
      gradient.addColorStop(1, '#312e81');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        
        // Pulse effect
        p.alpha += p.pulse;
        if (p.alpha > 1 || p.alpha < 0.3) p.pulse = -p.pulse;
        
        // Move
        p.x += p.vx;
        p.y += p.vy;
        
        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });
      
      // Draw connecting lines for nearby particles
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(draw);
    };
    
    resize();
    createParticles();
    draw();
    
    window.addEventListener('resize', resize);
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
};

// Floating particles for foreground
const FloatingOrbs = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full blur-3xl opacity-30"
        style={{
          width: Math.random() * 400 + 200,
          height: Math.random() * 400 + 200,
          background: `radial-gradient(circle, ${
            ['#60a5fa', '#a78bfa', '#f472b6'][i % 3]
          } 0%, transparent 70%)`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          x: [0, 100, -100, 0],
          y: [0, -50, 50, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 20 + i * 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

const AuthModal = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [focusedField, setFocusedField] = useState(null);

  /* ===========================
     EMAIL / PASSWORD AUTH
  ============================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${API_BASE}/auth/v2/${isLogin ? "login" : "register"}`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success(
        <div className="flex items-center gap-2">
          <Sparkles className="text-yellow-400" size={18} />
          <span>Welcome back! 👋</span>
        </div>,
        { duration: 3000 }
      );
      
      onLoginSuccess(data.token);
      onClose();
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Authentication failed",
        { icon: '❌' }
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

      toast.success(
        <div className="flex items-center gap-2">
          <FcGoogle size={18} />
          <span>Welcome! 🎉</span>
        </div>
      );
      
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
    const googleBtn = document.querySelector("#google-hidden-btn [role=button]");
    googleBtn?.click();
  };

  /* ===========================
     UI
  ============================ */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backgrounds */}
      <StarBackground />
      <FloatingOrbs />
      
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-20" onClick={onClose} />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative z-30 w-full max-w-md mx-4"
      >
        {/* Glass Card */}
        <div className="relative bg-white/10 dark:bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden">
          
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 pointer-events-none" />
          
          {/* Content */}
          <div className="relative p-8">
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all"
            >
              ✕
            </motion.button>

            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg shadow-blue-500/30"
              >
                <ShieldCheck className="text-white" size={32} />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-white mb-2">
                {isLogin ? "Welcome Back" : "Join Us"}
              </h2>
              <p className="text-white/60 text-sm">
                {isLogin 
                  ? "Sign in to continue your journey" 
                  : "Create an account to get started"}
              </p>
            </div>

            {/* Google Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="group relative w-full flex items-center justify-center gap-3 rounded-xl bg-white hover:bg-gray-50 px-4 py-3.5 text-gray-700 font-medium transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/0 to-blue-600/0 group-hover:from-blue-600/5 group-hover:via-purple-600/5 group-hover:to-pink-600/5 transition-all" />
                <FcGoogle size={22} />
                <span>Continue with Google</span>
              </button>
              
              {/* Hidden Google container */}
              <div id="google-hidden-btn" className="hidden" />
            </motion.div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/40 text-xs uppercase tracking-wider">Or continue with email</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Form */}
            <motion.form 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onSubmit={handleSubmit} 
              className="space-y-4"
            >
              {/* Email Field */}
              <div className="relative group">
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-focus-within:opacity-20 blur transition-opacity ${focusedField === 'email' ? 'opacity-20' : ''}`} />
                <div className="relative flex items-center">
                  <Mail className={`absolute left-4 text-white/40 transition-colors ${focusedField === 'email' ? 'text-blue-400' : ''}`} size={18} />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="relative group">
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-focus-within:opacity-20 blur transition-opacity ${focusedField === 'password' ? 'opacity-20' : ''}`} />
                <div className="relative flex items-center">
                  <Lock className={`absolute left-4 text-white/40 transition-colors ${focusedField === 'password' ? 'text-blue-400' : ''}`} size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="relative w-full h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                
                {loading ? (
                  <Loader />
                ) : (
                  <span className="relative flex items-center gap-2">
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </motion.button>
            </motion.form>

            {/* Toggle Mode */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center"
            >
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {isLogin ? (
                  <span>Don't have an account? <span className="text-blue-400 hover:underline">Create one</span></span>
                ) : (
                  <span>Already have an account? <span className="text-blue-400 hover:underline">Sign in</span></span>
                )}
              </button>
            </motion.div>

            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 flex items-center justify-center gap-2 text-white/40 text-xs"
            >
              <Zap size={14} className="text-green-400" />
              <span>Secured with 256-bit encryption</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
