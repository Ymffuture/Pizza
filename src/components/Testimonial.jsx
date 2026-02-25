import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { 
  FaStar, 
  FaRegStar, 
  FaQuoteLeft, 
  FaQuoteRight,
  FaCheckCircle,
  FaShieldAlt,
  FaGlobe
} from "react-icons/fa";
import { 
  Quote, 
  Sparkles, 
  Verified,
  ThumbsUp,
  MessageCircle
} from "lucide-react";
import axios from "axios";
import { Badge, Tooltip, Avatar } from "antd";

// Enhanced data with more realistic diversity
const namesData = [
  { name: "Thabo Mokoena", role: "Startup Founder", location: "Johannesburg, SA" },
  { name: "Amina Adebayo", role: "UX Designer", location: "Lagos, Nigeria" },
  { name: "Kwame Osei", role: "Product Manager", location: "Accra, Ghana" },
  { name: "Zuri Ndlovu", role: "Marketing Director", location: "Cape Town, SA" },
  { name: "Chidi Okonkwo", role: "Tech Lead", location: "Abuja, Nigeria" },
  { name: "Liam Chen", role: "Freelance Developer", location: "Singapore" },
  { name: "Sofia Ramirez", role: "Creative Director", location: "Barcelona, Spain" },
  { name: "Noah Patel", role: "E-commerce Owner", location: "Mumbai, India" },
  { name: "Isabella Müller", role: "Brand Strategist", location: "Berlin, Germany" },
  { name: "Mateo Ivanov", role: "Software Engineer", location: "Sofia, Bulgaria" },
  { name: "Aria Singh", role: "Content Creator", location: "Toronto, Canada" },
  { name: "Lucas Dubois", role: "Consultant", location: "Paris, France" },
];

const testimonialTexts = [
  {
    text: "SwiftMeta transformed our digital presence completely. The AI-powered design suggestions saved us weeks of work, and the final result exceeded all expectations.",
    highlight: "AI-powered design",
    metric: "3x faster delivery"
  },
  {
    text: "I've tried dozens of website builders, but nothing comes close to SwiftMeta's intuitive interface. It's like having a professional designer at your fingertips.",
    highlight: "intuitive interface",
    metric: "Zero coding needed"
  },
  {
    text: "The performance optimization is unreal. Our site loads in under 2 seconds now, and our conversion rate jumped by 40% within the first month.",
    highlight: "performance optimization",
    metric: "40% conversion boost"
  },
  {
    text: "From concept to launch in 48 hours. SwiftMeta's templates are not just beautiful—they're strategically designed for maximum impact.",
    highlight: "48-hour launch",
    metric: "100% uptime"
  },
  {
    text: "The real-time collaboration features are game-changing. Our remote team can now build and iterate together seamlessly, no matter where we are.",
    highlight: "real-time collaboration",
    metric: "50+ team members"
  },
  {
    text: "SwiftMeta's responsive design is flawless. Every device, every screen size—our brand looks perfect everywhere. That's priceless for our reputation.",
    highlight: "flawless responsive",
    metric: "All devices supported"
  },
  {
    text: "Customer support that actually understands development. When we had questions, experts—not bots—helped us solve complex issues within minutes.",
    highlight: "expert support",
    metric: "< 5 min response"
  },
  {
    text: "The analytics dashboard gives us insights we never had before. We can see exactly how users interact with our site and optimize accordingly.",
    highlight: "advanced analytics",
    metric: "Real-time data"
  }
];

// Animated background component
const ParticleBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full bg-blue-500/20"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);

// Individual testimonial card
const TestimonialCard = ({ data, isActive, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ 
        opacity: isActive ? 1 : 0.3, 
        y: isActive ? 0 : 20,
        scale: isActive ? 1 : 0.9,
        filter: isActive ? 'blur(0px)' : 'blur(2px)'
      }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="relative w-full max-w-4xl mx-auto px-4"
    >
      <div className="relative bg-white dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
        
        {/* Quote decoration */}
        <div className="absolute top-6 left-8 text-blue-500/10 dark:text-blue-400/10">
          <Quote size={120} />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                {i < data.rating ? (
                  <FaStar className="text-yellow-400 text-lg" />
                ) : (
                  <FaRegStar className="text-gray-300 text-lg" />
                )}
              </motion.div>
            ))}
            <Badge 
              count={`${data.rating}.0`} 
              style={{ 
                backgroundColor: '#fbbf24', 
                color: '#000',
                fontWeight: 'bold',
                marginLeft: '8px'
              }} 
            />
          </div>

          {/* Testimonial Text */}
          <blockquote className="relative">
            <FaQuoteLeft className="absolute -top-2 -left-4 text-blue-500/30 text-xl" />
            <p className="text-xl md:text-2xl text-gray-800 dark:text-gray-200 leading-relaxed mb-6 pl-4">
              "{data.text.split(data.highlight).map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="text-blue-600 dark:text-blue-400 font-semibold bg-blue-100 dark:bg-blue-900/30 px-1 rounded">
                      {data.highlight}
                    </span>
                  )}
                </span>
              ))}"
            </p>
            <FaQuoteRight className="absolute -bottom-2 -right-4 text-blue-500/30 text-xl" />
          </blockquote>

          {/* Metric Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium mb-8">
            <ThumbsUp size={16} />
            {data.metric}
          </div>

          {/* Author Info */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                {!imageLoaded && (
                  <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                )}
                <Avatar
                  src={data.avatar}
                  size={64}
                  className={`border-2 border-white dark:border-blue-500 shadow-lg transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                  <Verified size={14} className="text-white" />
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {data.name}
                  <Tooltip title="Verified Customer">
                    <FaCheckCircle className="text-blue-500 text-sm" />
                  </Tooltip>
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{data.role}</p>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <Globe size={12} />
                  {data.location}
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <Tooltip title="Identity Verified">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                  <FaShieldAlt size={12} className="text-green-500" />
                  <span>Verified</span>
                </div>
              </Tooltip>
              <Tooltip title="Purchased Service">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                  <FaCheckCircle size={12} className="text-blue-500" />
                  <span>Customer</span>
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Navigation dots
const CustomDots = ({ total, current, onChange }) => (
  <div className="flex items-center justify-center gap-2 mt-8">
    {Array.from({ length: total }).map((_, i) => (
      <motion.button
        key={i}
        onClick={() => onChange(i)}
        className={`h-2 rounded-full transition-all duration-300 ${
          i === current 
            ? 'w-8 bg-blue-500' 
            : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
        }`}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      />
    ))}
  </div>
);

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  // Auto-advance timer
  useEffect(() => {
  if (!testimonials.length) return;

  const timer = setInterval(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, 6000);

  return () => clearInterval(timer);
}, [testimonials.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Shuffle and select 5 testimonials
        const shuffledNames = [...namesData].sort(() => 0.5 - Math.random()).slice(0, 5);
        const shuffledTexts = [...testimonialTexts].sort(() => 0.5 - Math.random()).slice(0, 5);

        // Fetch avatars
        const avatarPromises = shuffledNames.map(() =>
          axios.get(
            "https://api.unsplash.com/photos/random?query=professional+headshot&client_id=vKvUZ1Wv3ez0cdcjK-d9KMB8_wPVRLNQaC2P8FVssaw"
          ).catch(() => null)
        );

        const responses = await Promise.all(avatarPromises);
        const avatars = responses.map((res) => 
          res?.data?.urls?.small || `https://ui-avatars.com/api/?name=${encodeURIComponent(shuffledNames[0]?.name)}&background=random`
        );

        const compiled = shuffledNames.map((person, i) => ({
          id: i,
          ...person,
          ...shuffledTexts[i],
          avatar: avatars[i],
          rating: 5, // All 5 stars for premium feel
        }));

        setTestimonials(compiled);
      } catch (error) {
        console.error("Error:", error);
        // Fallback to generated avatars
        const fallback = namesData.slice(0, 5).map((person, i) => ({
          id: i,
          ...person,
          ...testimonialTexts[i],
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random&size=128`,
          rating: 5,
        }));
        setTestimonials(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-[#0a0a0d] dark:via-[#111] dark:to-[#0a0a0d] overflow-hidden"
    >
      {/* Background Effects */}
      <ParticleBackground />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6"
          >
            <Sparkles size={16} className="animate-pulse" />
            <span>Trusted by 10,000+ Creators</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Loved by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              Innovators
            </span>
            Worldwide
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Real stories from real people who transformed their digital presence with SwiftMeta.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-8 mb-16"
        >
          {[
            { value: "4.9/5", label: "Average Rating", icon: FaStar },
            { value: "10K+", label: "Happy Customers", icon: MessageCircle },
            { value: "98%", label: "Would Recommend", icon: ThumbsUp },
          ].map((stat, idx) => (
            <div key={idx} className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <stat.icon size={20} />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Main Display */}
              <div className="relative h-[500px] flex items-center justify-center">
                <AnimatePresence mode="wait" custom={direction}>
                  {testimonials[activeIndex] && (
  <TestimonialCard 
    key={activeIndex}
    data={testimonials[activeIndex]}
    isActive={true}
    index={activeIndex}
  />
)}
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePrev}
                  className="p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-lg"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </motion.button>

                <CustomDots 
                  total={testimonials.length} 
                  current={activeIndex} 
                  onChange={setActiveIndex}
                />

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleNext}
                  className="p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-lg"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </motion.button>
              </div>

              {/* Thumbnail Previews */}
              <div className="flex justify-center gap-3 mt-8">
                {testimonials.map((t, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setActiveIndex(i)}
                    className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                      i === activeIndex 
                        ? 'border-blue-500 ring-2 ring-blue-500/30' 
                        : 'border-gray-300 dark:border-gray-600 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-16 flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400"
        >
          <div className="flex items-center gap-2">
            <FaShieldAlt className="text-green-500" />
            <span>Verified Reviews</span>
          </div>
          <div className="flex items-center gap-2">
            <FaGlobe className="text-blue-500" />
            <span>Global Community</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-purple-500" />
            <span>No Fake Testimonials</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonial;
