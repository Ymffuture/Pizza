import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { 
  FaCode, FaPalette, FaHtml5, FaJsSquare, FaReact, 
  FaNodeJs, FaPython, FaGitAlt, FaDatabase, FaCss3Alt, 
  FaLaptopCode, FaAngular, FaVuejs, FaDocker, FaPhp 
} from "react-icons/fa";
import { BsPatchCheckFill, BsArrowRight, BsStars } from "react-icons/bs";
import { Link } from "react-router-dom";
import { MdDevices, MdSecurity, MdSpeed } from "react-icons/md";
import { SiNextdotjs, SiTailwindcss, SiTypescript, SiMongodb } from "react-icons/si";
import { Tooltip, Badge, Button } from "antd";
import { Sparkles, Zap, Globe, ChevronDown } from "lucide-react";

// Enhanced Star Background with Canvas
const StarBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    const particles = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    const createParticles = () => {
      const colors = ['#60a5fa', '#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#6366f1', '#22d3ee'];
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 0.5,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          alpha: Math.random(),
          color: colors[Math.floor(Math.random() * colors.length)],
          pulse: Math.random() * 0.02,
          connectionRadius: Math.random() * 100 + 50
        });
      }
    };
    
    const draw = () => {
      // Clear with slight fade for trail effect
      ctx.fillStyle = 'rgba(10, 10, 13, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        // Draw particle
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
        
        // Draw connections
        ctx.globalAlpha = 0.15;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 0.5;
        
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < p.connectionRadius) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      
      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(draw);
    };
    
    resize();
    createParticles();
    draw();
    
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
};

// Floating Tech Icon Component
const FloatingIcon = ({ icon: Icon, color, size, position, delay, duration }) => (
  <motion.div
    className={`absolute ${color} pointer-events-none`}
    style={position}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0.15, 0.25, 0.15],
      scale: 1,
      y: [0, -15, 0],
      rotate: [0, 5, -5, 0]
    }}
    transition={{
      opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
      y: { duration: duration || 5, repeat: Infinity, ease: "easeInOut", delay },
      rotate: { duration: duration * 1.5 || 8, repeat: Infinity, ease: "easeInOut", delay },
      scale: { duration: 0.5 }
    }}
  >
    <Icon size={size || 40} />
  </motion.div>
);

// Tech Stack Data
const techStack = [
  { icon: FaReact, name: "React", color: "text-cyan-400", category: "Frontend" },
  { icon: SiNextdotjs, name: "Next.js", color: "text-white", category: "Framework" },
  { icon: SiTypescript, name: "TypeScript", color: "text-blue-400", category: "Language" },
  { icon: SiTailwindcss, name: "Tailwind", color: "text-cyan-300", category: "Styling" },
  { icon: FaNodeJs, name: "Node.js", color: "text-green-400", category: "Backend" },
  { icon: SiMongodb, name: "MongoDB", color: "text-green-500", category: "Database" },
];

const Hero = () => {
  const [heroImg, setHeroImg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const springY1 = useSpring(y1, { stiffness: 100, damping: 30 });
  const springY2 = useSpring(y2, { stiffness: 100, damping: 30 });

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const QUERIES = [
          "modern web development",
          "coding workspace",
          "developer setup",
          "tech innovation",
          "digital design"
        ];
        const randomQuery = QUERIES[Math.floor(Math.random() * QUERIES.length)];
        const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(randomQuery)}&client_id=vKvUZ1Wv3ez0cdcjK-d9KMB8_wPVRLNQaC2P8FVssaw`;

        const response = await fetch(url);
        const data = await response.json();
        if (data?.urls?.regular) {
          setHeroImg(data.urls.regular);
          localStorage.setItem("hero_cache", JSON.stringify({ 
            img: data.urls.regular, 
            fetchedAt: Date.now() 
          }));
        }
      } catch (error) {
        console.log("Image fetch failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const cache = localStorage.getItem("hero_cache");
    if (cache) {
      const { img, fetchedAt } = JSON.parse(cache);
      if (Date.now() - fetchedAt < 7 * 24 * 60 * 60 * 1000) {
        setHeroImg(img);
        setIsLoading(false);
        return;
      }
    }
    fetchImage();
  }, []);

  // Floating icons configuration
  const floatingIcons = [
    { icon: FaCode, color: "text-blue-500", size: 60, position: { top: '10%', left: '5%' }, delay: 0, duration: 6 },
    { icon: FaNodeJs, color: "text-green-500", size: 50, position: { top: '15%', right: '10%' }, delay: 1, duration: 7 },
    { icon: FaReact, color: "text-cyan-400", size: 55, position: { top: '30%', left: '8%' }, delay: 0.5, duration: 8 },
    { icon: SiNextdotjs, color: "text-white", size: 45, position: { top: '25%', right: '15%' }, delay: 1.5, duration: 6 },
    { icon: FaJsSquare, color: "text-yellow-400", size: 50, position: { top: '45%', left: '3%' }, delay: 2, duration: 7 },
    { icon: FaDocker, color: "text-blue-400", size: 45, position: { top: '40%', right: '5%' }, delay: 0.8, duration: 8 },
    { icon: SiTailwindcss, color: "text-cyan-300", size: 40, position: { top: '60%', left: '10%' }, delay: 1.2, duration: 6 },
    { icon: FaDatabase, color: "text-indigo-400", size: 45, position: { top: '55%', right: '12%' }, delay: 2.5, duration: 7 },
    { icon: FaGitAlt, color: "text-red-400", size: 40, position: { bottom: '25%', left: '15%' }, delay: 0.3, duration: 8 },
    { icon: FaPython, color: "text-yellow-300", size: 50, position: { bottom: '20%', right: '8%' }, delay: 1.8, duration: 6 },
    { icon: MdDevices, color: "text-purple-400", size: 45, position: { bottom: '35%', left: '5%' }, delay: 2.2, duration: 7 },
    { icon: MdSecurity, color: "text-green-300", size: 40, position: { bottom: '30%', right: '20%' }, delay: 0.6, duration: 8 },
    { icon: FaHtml5, color: "text-orange-500", size: 45, position: { top: '70%', left: '20%' }, delay: 3, duration: 6 },
    { icon: FaCss3Alt, color: "text-blue-600", size: 40, position: { top: '75%', right: '25%' }, delay: 1.3, duration: 7 },
    { icon: SiTypescript, color: "text-blue-400", size: 35, position: { bottom: '15%', left: '25%' }, delay: 2.8, duration: 8 },
    { icon: FaVuejs, color: "text-green-400", size: 40, position: { bottom: '10%', right: '30%' }, delay: 0.9, duration: 6 },
  ];

  return (
    <section className="relative min-h-screen bg-[#0A0A0D] text-white overflow-hidden flex items-center">
      {/* Background Layers */}
      <StarBackground />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0D]/50 to-[#0A0A0D] pointer-events-none" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Floating Icons */}
      {floatingIcons.map((icon, idx) => (
        <FloatingIcon key={idx} {...icon} />
      ))}

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ y: springY1 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6"
            >
              <BsStars className="animate-pulse" />
              <span>Professional Web Services</span>
              <Badge count="NEW" className="ml-2" style={{ backgroundColor: '#3b82f6' }} />
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            >
              Elevate Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Digital
              </span>
              <br />
              Presence
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-400 max-w-xl mb-8 leading-relaxed"
            >
              Crafting stunning, high-performance websites with cutting-edge technologies. 
              From React to AI integration, we build the future of web.
            </motion.p>

            {/* Tech Stack Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              {techStack.map((tech, idx) => (
                <Tooltip key={tech.name} title={tech.category}>
                  <motion.div
                    whileHover={{ scale: 1.1, y: -2 }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 ${tech.color} text-sm font-medium cursor-pointer hover:bg-white/10 transition-all`}
                  >
                    <tech.icon size={16} />
                    <span>{tech.name}</span>
                  </motion.div>
                </Tooltip>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/start-quiz">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl font-semibold text-lg overflow-hidden shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative flex items-center gap-2">
                    Start Your Journey
                    <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </Link>

              <a href="https://futurecv.vercel.app" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-2xl font-semibold text-lg border border-white/20 hover:bg-white/5 hover:border-white/40 transition-all flex items-center gap-2"
                >
                  <Globe size={20} />
                  View Portfolio
                </motion.button>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-8 mt-12 pt-8 border-t border-white/10"
            >
              {[
                { value: "50+", label: "Projects", icon: Zap },
                { value: "99%", label: "Satisfaction", icon: BsPatchCheckFill },
                { value: "24/7", label: "Support", icon: MdSpeed },
              ].map((stat, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-blue-400">
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
            style={{ 
              y: springY2,
              x: mousePosition.x,
              rotateY: mousePosition.x * 0.5,
              rotateX: -mousePosition.y * 0.5,
            }}
          >
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl" />
            
            {/* Image Container */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              {isLoading ? (
                <div className="aspect-[4/3] bg-gray-800 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                </div>
              ) : heroImg ? (
                <motion.img
                  src={heroImg}
                  alt="Modern Web Development"
                  className="w-full aspect-[4/3] object-cover"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                />
              ) : (
                <div className="aspect-[4/3] bg-gray-800 flex items-center justify-center text-gray-500">
                  Failed to load image
                </div>
              )}

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D] via-transparent to-transparent opacity-60" />

              {/* Floating Badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
                className="absolute top-4 left-4 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium flex items-center gap-2"
              >
                <FaCode className="text-blue-400" />
                Clean Code
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, type: "spring" }}
                className="absolute top-4 right-4 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium flex items-center gap-2"
              >
                <FaPalette className="text-purple-400" />
                UI/UX Design
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, type: "spring" }}
                className="absolute bottom-4 left-4 right-4 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <MdDevices size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Fully Responsive</div>
                      <div className="text-xs text-gray-400">Mobile-first approach</div>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {[FaReact, SiNextdotjs, SiTailwindcss].map((Icon, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                        <Icon size={16} className="text-gray-300" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
      >
        <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
