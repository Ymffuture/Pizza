import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Globe, 
  Database, 
  Cloud,
  Code2,
  Layers,
  Cpu,
  Fingerprint
} from "lucide-react";
import { Tooltip, Badge } from "antd";

// Logos (kept as imports)
import Cloudinary from "../assets/partners/Cloudinary.png";
import MongoDB from "../assets/partners/MongoDB.png";
import Gemini from "../assets/partners/Gemini.png";
import EmailJS from "../assets/partners/emailjs_logo.png";
import SwiftMeta from "../assets/partners/new.jpeg";
import GitHub from "../assets/partners/github-logo-vector.png";
import Vercel from "../assets/partners/Vercel.png";
import Supabase from "../assets/partners/Supabase_Logo.png";
import CheckID from "../assets/partners/checkid-logo.png";
import Tailwind from "../assets/partners/Tailwindcss.png";

const partners = [
  { 
    name: "Cloudinary", 
    logo: Cloudinary, 
    category: "Media",
    description: "Cloud-based image & video management",
    icon: Cloud,
    color: "#3448C5"
  },
  { 
    name: "MongoDB", 
    logo: MongoDB, 
    category: "Database",
    description: "Modern NoSQL database platform",
    icon: Database,
    color: "#47A248"
  },
  { 
    name: "Gemini AI", 
    logo: Gemini, 
    category: "AI",
    description: "Advanced artificial intelligence",
    icon: Sparkles,
    color: "#4285F4"
  },
  { 
    name: "EmailJS", 
    logo: EmailJS, 
    category: "Communication",
    description: "Email delivery service",
    icon: Zap,
    color: "#FF6B6B"
  },
  { 
    name: "SwiftMeta", 
    logo: SwiftMeta, 
    category: "Platform",
    description: "Core development platform",
    icon: Layers,
    color: "#6366F1"
  },
  { 
    name: "GitHub", 
    logo: GitHub, 
    category: "Development",
    description: "Code collaboration platform",
    icon: Code2,
    color: "#181717"
  },
  { 
    name: "Vercel", 
    logo: Vercel, 
    category: "Deployment",
    description: "Frontend cloud platform",
    icon: Globe,
    color: "#000000"
  },
  { 
    name: "Supabase", 
    logo: Supabase, 
    category: "Backend",
    description: "Open source Firebase alternative",
    icon: Shield,
    color: "#3ECF8E"
  },
  { 
    name: "Check ID SA", 
    logo: CheckID, 
    category: "Security",
    description: "Identity verification solutions",
    icon: Fingerprint,
    color: "#0EA5E9"
  },
  { 
    name: "TailwindCSS", 
    logo: Tailwind, 
    category: "Styling",
    description: "Utility-first CSS framework",
    icon: Cpu,
    color: "#06B6D4"
  },
];

// Animated background component
const ParticleBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    const createParticles = () => {
      particles = [];
      for (let i = 0; i < 30; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
        ctx.fill();
        
        p.x += p.speedX;
        p.y += p.speedY;
        
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    resize();
    createParticles();
    animate();
    
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
    />
  );
};

// Individual partner card
const PartnerCard = ({ partner, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = partner.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <Tooltip 
        title={
          <div className="text-center">
            <p className="font-semibold">{partner.name}</p>
            <p className="text-xs opacity-80">{partner.description}</p>
          </div>
        }
        placement="top"
      >
        <div className="relative flex flex-col items-center p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer">
          
          {/* Glow effect on hover */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${partner.color}15 0%, transparent 70%)`
            }}
          />
          
          {/* Category badge */}
          <Badge 
            count={partner.category}
            style={{ 
              backgroundColor: partner.color,
              fontSize: '10px',
              padding: '0 8px',
              borderRadius: '12px'
            }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          />
          
          {/* Logo container */}
          <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
            <motion.img
              src={partner.logo}
              alt={partner.name}
              className="max-w-full max-h-full object-contain opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300 dark:opacity-50 dark:group-hover:opacity-100"
              animate={isHovered ? { scale: 1.1, rotate: [0, -5, 5, 0] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Icon overlay on hover */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg"
              style={{ backgroundColor: partner.color }}
            >
              <Icon size={16} />
            </motion.div>
          </div>
          
          {/* Name */}
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors text-center">
            {partner.name}
          </h4>
          
          {/* Decorative line */}
          <motion.div
            className="absolute bottom-0 left-1/2 h-1 rounded-full"
            style={{ backgroundColor: partner.color }}
            initial={{ width: 0, x: '-50%' }}
            animate={isHovered ? { width: '40%', x: '-50%' } : { width: 0, x: '-50%' }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </Tooltip>
    </motion.div>
  );
};

const TrustedPartners = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Duplicate partners for infinite scroll effect
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section 
      ref={ref}
      className="relative py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black overflow-hidden"
    >
      {/* Background Effects */}
      <ParticleBackground />
      
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
            <Sparkles size={16} />
            <span>Our Technology Stack</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Industry Leaders</span>
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We integrate with world-class technologies to deliver exceptional experiences
          </p>
        </motion.div>

        {/* Partners Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6"
        >
          {partners.map((partner, idx) => (
            <PartnerCard key={partner.name} partner={partner} index={idx} />
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: "99.9%", label: "Uptime SLA", icon: Shield },
            { value: "50ms", label: "Avg Response", icon: Zap },
            { value: "10+", label: "Integrations", icon: Layers },
            { value: "24/7", label: "Support", icon: Globe },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-3">
                <stat.icon size={24} />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400"
        >
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-green-500" />
            <span>SOC 2 Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <Fingerprint size={16} className="text-blue-500" />
            <span>GDPR Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <Database size={16} className="text-purple-500" />
            <span>End-to-end Encrypted</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedPartners;
