import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Home, 
  Search, 
  Sparkles, 
  Compass,
  Zap,
  MessageCircle
} from "lucide-react";
import { Button, Input, Tooltip } from "antd";
import { useState, useEffect, useRef } from "react";

// Animated Starfield Background
const StarBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    const particles = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Create particles with Kimi AI colors
    const createParticles = () => {
      const colors = ['#60a5fa', '#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#6366f1'];
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 0.5,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          alpha: Math.random(),
          color: colors[Math.floor(Math.random() * colors.length)],
          pulse: Math.random() * 0.02
        });
      }
    };
    
    const draw = () => {
      // Deep space gradient
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
        if (p.alpha > 1 || p.alpha < 0.2) p.pulse = -p.pulse;
        
        // Move
        p.x += p.vx;
        p.y += p.vy;
        
        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });
      
      // Draw constellation lines
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
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
      className="fixed inset-0 w-full h-full pointer-events-none"
    />
  );
};

// Floating orbs for depth
const FloatingOrbs = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full blur-3xl opacity-20"
        style={{
          width: 300 + i * 100,
          height: 300 + i * 100,
          background: `radial-gradient(circle, ${
            ['#60a5fa', '#a78bfa', '#f472b6', '#34d399', '#fbbf24'][i]
          } 0%, transparent 70%)`,
          left: `${20 + i * 15}%`,
          top: `${10 + i * 20}%`,
        }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 15 + i * 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

// Glitch text effect component
const GlitchText = ({ text }) => {
  return (
    <div className="relative inline-block">
      <motion.h1 
        className="text-[140px] md:text-[180px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tracking-tighter"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        {text}
      </motion.h1>
      <motion.div
        className="absolute inset-0 text-[140px] md:text-[180px] font-bold text-blue-500/30 tracking-tighter"
        animate={{
          x: [-2, 2, -2, 0],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
      >
        {text}
      </motion.div>
    </div>
  );
};

export default function NotFound() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions] = useState([
    { name: "Home", path: "/", icon: Home },
    { name: "Dashboard", path: "/dashboard", icon: Compass },
    { name: "Blog", path: "/blog", icon: Sparkles },
    { name: "Contact", path: "/contact", icon: MessageCircle },
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Backgrounds */}
      <StarBackground />
      <FloatingOrbs />
      
      {/* Grid overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
        
        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          {/* 404 Display */}
          <div className="text-center mb-8">
            <GlitchText text="404" />
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 mb-4"
            >
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-500" />
              <span className="text-blue-400 text-sm font-medium tracking-widest uppercase">Page Not Found</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-500" />
            </motion.div>
          </div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Lost in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">digital void</span>?
            </h2>
            <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
              The page you're looking for seems to have drifted into another dimension. Let's get you back on track.
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleSearch}
            className="mb-8"
          >
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20" />
              <div className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 focus-within:border-blue-500/50 transition-all">
                <Search className="text-gray-400 mr-3" size={20} />
                <input
                  type="text"
                  placeholder="Search for pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none"
                />
                <Button 
                  type="primary"
                  htmlType="submit"
                  className="bg-blue-600 hover:bg-blue-500 border-none rounded-xl"
                >
                  Search
                </Button>
              </div>
            </div>
          </motion.form>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
          >
            {suggestions.map((item, idx) => (
              <Tooltip key={item.name} title={`Go to ${item.name}`}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-blue-500/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 group-hover:text-white group-hover:from-blue-500 group-hover:to-purple-500 transition-all">
                    <item.icon size={24} />
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white">{item.name}</span>
                </motion.button>
              </Tooltip>
            ))}
          </motion.div>

          {/* Primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all group"
              >
                <Home size={20} />
                <span>Return Home</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </motion.span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Decorative Element */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 flex items-center justify-center gap-2 text-gray-500 text-sm"
          >
            <Zap size={16} className="text-yellow-400" />
            <span>Error Code: 404_PAGE_NOT_FOUND</span>
            <span className="w-1 h-1 rounded-full bg-gray-500" />
            <span>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </motion.div>
        </motion.div>

        {/* Corner Decorations */}
        <div className="fixed top-8 left-8 flex items-center gap-2 text-gray-500 text-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono">SYSTEM ONLINE</span>
        </div>
        
        <div className="fixed top-8 right-8 text-gray-500 text-sm font-mono">
          {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
