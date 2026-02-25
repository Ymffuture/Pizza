import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { 
  Lightbulb, 
  Code2, 
  ShieldCheck, 
  Rocket, 
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Timer
} from "lucide-react";
import { Tooltip, Badge, Progress } from "antd";

// Animated connection line between steps
const ConnectionLine = ({ index, isActive }) => (
  <motion.div
    className="hidden lg:block absolute top-1/2 -right-5 w-10 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
    initial={{ scaleX: 0, opacity: 0 }}
    animate={{ 
      scaleX: isActive ? 1 : 0, 
      opacity: isActive ? 1 : 0.3 
    }}
    transition={{ duration: 0.6, delay: index * 0.2 }}
    style={{ originX: 0 }}
  >
    <motion.div
      className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-500"
      animate={{ scale: isActive ? [1, 1.5, 1] : 1 }}
      transition={{ duration: 1, repeat: Infinity }}
    />
  </motion.div>
);

// Enhanced Process Card Component
const ProcessCard = ({ step, index, isActive, totalSteps }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  
  const icons = {
    0: Lightbulb,
    1: Code2,
    2: ShieldCheck,
    3: Rocket
  };
  
  const Icon = icons[index];
  
  const colors = [
    { bg: "from-blue-500/20 to-cyan-500/20", text: "text-blue-400", border: "border-blue-500/30", glow: "shadow-blue-500/20" },
    { bg: "from-green-500/20 to-emerald-500/20", text: "text-green-400", border: "border-green-500/30", glow: "shadow-green-500/20" },
    { bg: "from-orange-500/20 to-amber-500/20", text: "text-orange-400", border: "border-orange-500/30", glow: "shadow-orange-500/20" },
    { bg: "from-purple-500/20 to-pink-500/20", text: "text-purple-400", border: "border-purple-500/30", glow: "shadow-pink-500/20" }
  ];
  
  const color = colors[index];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative group"
    >
      {/* Connection line to next step */}
      {index < totalSteps - 1 && <ConnectionLine index={index} isActive={isActive} />}
      
      {/* Card */}
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        className={`
          relative p-8 rounded-3xl bg-white dark:bg-gray-900/50 
          border ${color.border} 
          backdrop-blur-sm overflow-hidden
          transition-all duration-500
          hover:shadow-2xl hover:${color.glow}
        `}
      >
        {/* Animated gradient background */}
        <div className={`
          absolute inset-0 bg-gradient-to-br ${color.bg} 
          opacity-0 group-hover:opacity-100 transition-opacity duration-500
        `} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px] opacity-30" />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Step number badge */}
          <div className="flex items-center justify-between mb-6 dark:text-white">
            <Badge 
              count={`0${index + 1}`}
              style={{ 
                backgroundColor: 'transparent',
                color: 'inherit',
                border: '1px solid currentColor',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
              className={color.text}
            />
            
            {isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`flex items-center gap-1 text-xs ${color.text}`}
              >
                <Zap size={12} className="animate-pulse" />
                <span>Active</span>
              </motion.div>
            )}
          </div>
          
          {/* Icon with animation */}
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className={`
              w-20 h-20 mx-auto mb-6 rounded-2xl 
              bg-gradient-to-br ${color.bg}
              border ${color.border}
              flex items-center justify-center
              group-hover:shadow-lg transition-shadow
            `}
          >
            <Icon 
              size={40} 
              strokeWidth={1.5} 
              className={color.text}
            />
          </motion.div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
            {step.title}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
            {step.desc}
          </p>
          
          {/* Features list */}
          <ul className="space-y-2 mb-6">
            {step.features.map((feature, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.15 + i * 0.1 }}
                className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
              >
                <CheckCircle2 size={14} className={color.text} />
                <span>{feature}</span>
              </motion.li>
            ))}
          </ul>
          
          {/* Progress indicator */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Completion</span>
              <span>{step.progress}%</span>
            </div>
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: `${step.progress}%` } : {}}
                transition={{ duration: 1, delay: index * 0.2 }}
                className={`h-full rounded-full bg-gradient-to-r ${color.bg.replace('/20', '')}`}
              />
            </div>
          </div>
          
          {/* Hover action */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <button className={`
              flex items-center gap-2 text-sm font-medium ${color.text}
              hover:gap-3 transition-all
            `}>
              Learn more <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
        
        {/* Corner decoration */}
        <div className={`
          absolute -bottom-10 -right-10 w-32 h-32 
          bg-gradient-to-br ${color.bg} 
          rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity
        `} />
      </motion.div>
    </motion.div>
  );
};

// Main Process Component
const Process = () => {
  const containerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const processSteps = [
    {
      icon: Lightbulb,
      title: "Discovery & Strategy",
      desc: "We dive deep into your vision, analyzing market trends, user behavior, and competitive landscape to craft a winning digital strategy.",
      features: ["Market Research", "User Personas", "Competitive Analysis", "Technical Planning"],
      progress: 25,
      duration: "1-2 weeks"
    },
    {
      icon: Code2,
      title: "Design & Development",
      desc: "Transforming concepts into pixel-perfect designs and robust code using cutting-edge technologies and best practices.",
      features: ["UI/UX Design", "Frontend Development", "Backend Architecture", "API Integration"],
      progress: 50,
      duration: "3-6 weeks"
    },
    {
      icon: ShieldCheck,
      title: "Testing & QA",
      desc: "Rigorous quality assurance ensuring flawless performance, security, and accessibility across all devices and platforms.",
      features: ["Performance Testing", "Security Audits", "Cross-browser Testing", "Accessibility Checks"],
      progress: 75,
      duration: "1-2 weeks"
    },
    {
      icon: Rocket,
      title: "Launch & Scale",
      desc: "Seamless deployment with continuous monitoring, optimization, and support to ensure long-term success and growth.",
      features: ["CI/CD Pipeline", "Performance Monitoring", "SEO Optimization", "24/7 Support"],
      progress: 100,
      duration: "Ongoing"
    }
  ];

  // Auto-advance active step
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % processSteps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [processSteps.length]);

  return (
    <section 
      ref={containerRef}
      className="relative py-24 bg-gray-50 dark:bg-[#0A0A0D] overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6"
          >
            <Sparkles size={16} className="animate-pulse" />
            <span>Our Process</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How We Build{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Excellence
            </span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A refined workflow that combines creativity, technology, and strategy 
            to deliver exceptional digital experiences.
          </p>
        </motion.div>

        {/* Progress Timeline */}
        <div className="hidden lg:block mb-12">
          <div className="relative h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
              style={{ width: lineWidth }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {processSteps.map((step, i) => (
              <span key={i} className={activeStep === i ? "text-blue-400 font-medium" : ""}>
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Process Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {processSteps.map((step, index) => (
            <ProcessCard
              key={index}
              step={step}
              index={index}
              isActive={activeStep === index}
              totalSteps={processSteps.length}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Timer className="text-white" size={24} />
              </div>
              <div className="text-left">
                <div className="text-sm text-gray-500 dark:text-gray-400">Average Project Duration</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">4-8 Weeks</div>
              </div>
            </div>
            <div className="h-12 w-px bg-gray-200 dark:bg-gray-700 mx-4" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="text-white" size={24} />
              </div>
              <div className="text-left">
                <div className="text-sm text-gray-500 dark:text-gray-400">Success Rate</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">98%</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Process;
