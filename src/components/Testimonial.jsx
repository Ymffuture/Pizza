import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { 
  Quote, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Verified,
  TrendingUp,
  Users
} from "lucide-react";
import { Tooltip, Badge, Avatar, Rate, Skeleton } from "antd";
import axios from "axios";

// Enhanced testimonial data with roles and companies
const testimonialData = [
  {
    id: 1,
    name: "Thabo Mokoena",
    role: "CEO",
    company: "TechStart SA",
    text: "SwiftMeta transformed our digital presence completely. The AI-powered design suggestions saved us weeks of work, and the final result exceeded all expectations.",
    rating: 5,
    metric: "3x faster launch",
    verified: true,
  },
  {
    id: 2,
    name: "Amina Adebayo",
    role: "Product Designer",
    company: "Creative Labs",
    text: "The customization tools are incredibly intuitive. I built a complete design system without writing code, and my team loves the consistency across all pages.",
    rating: 5,
    metric: "50+ components",
    verified: true,
  },
  {
    id: 3,
    name: "Kwame Osei",
    role: "Founder",
    company: "GreenEnergy NG",
    text: "From concept to live site in 48 hours. The AI assistant understood our brand instantly and generated layouts that felt uniquely ours.",
    rating: 5,
    metric: "48h delivery",
    verified: true,
  },
  {
    id: 4,
    name: "Zuri Ndlovu",
    role: "Marketing Director",
    company: "ShopAfrica",
    text: "Our conversion rates jumped 40% after the redesign. The smart analytics integration gives us insights we never had before.",
    rating: 5,
    metric: "+40% conversions",
    verified: true,
  },
  {
    id: 5,
    name: "Chidi Okonkwo",
    role: "CTO",
    company: "FinTech Solutions",
    text: "Finally, a platform that understands technical requirements while keeping things simple. The code export feature is a game-changer for our team.",
    rating: 5,
    metric: "99.9% uptime",
    verified: true,
  },
  {
    id: 6,
    name: "Liam Chen",
    role: "Startup Advisor",
    company: "Venture Capital Asia",
    text: "I recommend SwiftMeta to every portfolio company. It's the fastest way to establish professional credibility online.",
    rating: 5,
    metric: "12 startups",
    verified: true,
  },
];

// Animated counter component
const AnimatedCounter = ({ value, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    const numValue = parseInt(value.replace(/\D/g, ''));
    const duration = 2000;
    const steps = 60;
    const increment = numValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numValue) {
        setCount(numValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
};

// Individual testimonial card
const TestimonialCard = ({ data, isActive, direction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction * 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -direction * 100, scale: 0.9 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className={`
        relative w-full max-w-4xl mx-auto
        ${isActive ? 'z-10' : 'z-0'}
      `}
    >
      {/* Main Card */}
      <div className="relative bg-white dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        
        {/* Background Gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        {/* Quote Icon */}
        <div className="absolute top-6 left-6 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
          <Quote className="text-white" size={24} />
        </div>

        {/* Content */}
        <div className="relative pt-8">
          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <Rate 
              disabled 
              defaultValue={data.rating} 
              className="text-yellow-400 text-sm"
            />
            <Badge 
              count="VERIFIED" 
              style={{ 
                backgroundColor: '#10b981',
                fontSize: '10px',
                fontWeight: 'bold'
              }}
              icon={<Verified size={10} />}
            />
          </div>

          {/* Testimonial Text */}
          <blockquote className="text-xl md:text-2xl lg:text-3xl text-gray-800 dark:text-gray-100 font-medium leading-relaxed mb-8">
            "{data.text}"
          </blockquote>

          {/* Author Info */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Avatar
                size={64}
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`}
                className="border-2 border-blue-500/30"
              />
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                  {data.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {data.role} at <span className="text-blue-500">{data.company}</span>
                </p>
              </div>
            </div>

            {/* Metric Badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <TrendingUp size={16} className="text-blue-500" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {data.metric}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Stats bar component
const StatsBar = () => {
  const stats = [
    { value: 500, suffix: "+", label: "Happy Clients", icon: Users },
    { value: 98, suffix: "%", label: "Satisfaction Rate", icon: Star },
    { value: 4.9, suffix: "/5", label: "Average Rating", icon: Sparkles },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-12">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          viewport={{ once: true }}
          className="text-center p-4 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-gray-800"
        >
          <div className="flex justify-center mb-2">
            <stat.icon size={20} className="text-blue-500" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            <AnimatedCounter value={stat.value.toString()} suffix={stat.suffix} />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Auto-advance
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonialData.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const navigate = useCallback((newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      if (newDirection === 1) {
        return (prev + 1) % testimonialData.length;
      }
      return prev === 0 ? testimonialData.length - 1 : prev - 1;
    });
    setIsAutoPlaying(false);
    // Resume autoplay after 10s of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const currentTestimonial = testimonialData[currentIndex];

  return (
    <section 
      ref={containerRef}
      className="relative py-24 bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-900 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 text-sm font-medium mb-6"
          >
            <Sparkles size={16} />
            <span>Trusted by Industry Leaders</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Clients Say</span>
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Real stories from real people who transformed their digital presence with SwiftMeta
          </p>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="relative min-h-[400px] flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <TestimonialCard
              key={currentIndex}
              data={currentTestimonial}
              isActive={true}
              direction={direction}
            />
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Tooltip title="Previous">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
            >
              <ChevronLeft size={24} />
            </motion.button>
          </Tooltip>

          {/* Dots */}
          <div className="flex gap-2">
            {testimonialData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                  setIsAutoPlaying(false);
                }}
                className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${idx === currentIndex 
                    ? 'w-8 bg-blue-500' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                  }
                `}
              />
            ))}
          </div>

          <Tooltip title="Next">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(1)}
              className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
            >
              <ChevronRight size={24} />
            </motion.button>
          </Tooltip>
        </div>

        {/* Stats */}
        <StatsBar />

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-16 flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400"
        >
          <div className="flex items-center gap-2">
            <Verified size={16} className="text-green-500" />
            <span>Verified Reviews</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-blue-500" />
            <span>From Real Customers</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-purple-500" />
            <span>Proven Results</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonial;
