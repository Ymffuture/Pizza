import React, { useEffect, useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {Link} from "react-router-dom" 
import axios from "axios";
import { 
  ShoppingCart, 
  Code2, 
  Atom, 
  Globe2, 
  UserCircle, 
  Building2, 
  LayoutTemplate, 
  AppWindow,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Shield,
  Zap
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Pagination, Navigation, Autoplay, EffectCoverflow } from "swiper/modules";
import { Tooltip, Badge, Skeleton, Button, Tag } from "antd";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Service configuration with enhanced metadata
const servicesConfig = [
  { 
    id: 1, 
    name: "E-Commerce Store", 
    tag: "Best Seller", 
    price: "R1,499", 
    originalPrice: "R2,999",
    description: "Complete online store with secure payments, inventory management, and order tracking.",
    features: ["Payment Integration", "Cart & Checkout", "Admin Dashboard", "Mobile App"],
    icon: ShoppingCart,
    color: "from-blue-500 to-cyan-500",
    delivery: "2-3 weeks"
  },
  { 
    id: 2, 
    name: "HTML/CSS Website", 
    tag: "Budget Friendly", 
    price: "R499", 
    description: "Lightning-fast static websites perfect for portfolios and small businesses.",
    features: ["SEO Optimized", "Fast Loading", "Responsive Design", "Hosting Setup"],
    icon: Code2,
    color: "from-orange-500 to-amber-500",
    delivery: "3-5 days"
  },
  { 
    id: 3, 
    name: "React.js Application", 
    tag: "Popular", 
    price: "R799", 
    originalPrice: "R1,599",
    description: "Modern interactive single-page applications with dynamic user experiences.",
    features: ["Component Architecture", "State Management", "API Integration", "Animations"],
    icon: Atom,
    color: "from-cyan-500 to-blue-500",
    delivery: "1-2 weeks"
  },
  { 
    id: 4, 
    name: "Next.js Platform", 
    tag: "SEO Ready", 
    price: "R899", 
    originalPrice: "R1,799",
    description: "Server-side rendered applications with optimal performance and SEO.",
    features: ["SSR/SSG", "Image Optimization", "API Routes", "TypeScript Support"],
    icon: Globe2,
    color: "from-gray-700 to-gray-900",
    delivery: "1-2 weeks"
  },
  { 
    id: 5, 
    name: "Portfolio Website", 
    tag: "50% OFF", 
    price: "R399", 
    originalPrice: "R799",
    description: "Stunning personal portfolios for creatives, developers, and professionals.",
    features: ["Project Showcase", "Contact Forms", "Blog Section", "Social Links"],
    icon: UserCircle,
    color: "from-purple-500 to-pink-500",
    delivery: "5-7 days"
  },
  { 
    id: 6, 
    name: "Business Website", 
    tag: "Enterprise", 
    price: "R1,299", 
    description: "Professional corporate websites with advanced features and integrations.",
    features: ["Multi-page Structure", "CMS Integration", "Analytics", "Chat Support"],
    icon: Building2,
    color: "from-emerald-500 to-teal-500",
    delivery: "2-3 weeks"
  },
  { 
    id: 7, 
    name: "Landing Page", 
    tag: "High Converting", 
    price: "R299", 
    originalPrice: "R599",
    description: "Conversion-focused landing pages designed to maximize your marketing ROI.",
    features: ["A/B Testing Ready", "Lead Forms", "Analytics", "Fast Loading"],
    icon: LayoutTemplate,
    color: "from-rose-500 to-red-500",
    delivery: "2-3 days"
  },
  { 
    id: 8, 
    name: "Custom Web App", 
    tag: "Full Stack", 
    price: "R999", 
    originalPrice: "R1,999",
    description: "Tailored web applications built specifically for your unique business needs.",
    features: ["Custom Features", "Database Design", "User Authentication", "Scalable"],
    icon: AppWindow,
    color: "from-indigo-500 to-violet-500",
    delivery: "3-4 weeks"
  },
];

const keywords = [
  "ecommerce website",
  "html css website minimalist",
  "reactjs modern dashboard",
  "nextjs server side rendering",
  "portfolio website creative",
  "business website professional",
  "landing page marketing",
  "web application interface",
];

const UNSPLASH_KEY = "vKvUZ1Wv3ez0cdcjK-d9KMB8_wPVRLNQaC2P8FVssaw";

// Enhanced Service Card Component
const ServiceCard = ({ service, image, loading, isActive }) => {
  const Icon = service.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        relative w-full max-w-md mx-auto rounded-3xl overflow-hidden
        bg-white dark:bg-gray-900 shadow-2xl
        ${isActive ? 'ring-4 ring-blue-500/30' : ''}
      `}
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        {loading ? (
          <Skeleton.Image active className="w-full h-full" />
        ) : (
          <>
            <img
              src={image}
              alt={service.name}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </>
        )}
        
        {/* Floating Tags */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Badge 
            count={service.tag} 
            style={{ 
              backgroundColor: service.tag.includes('OFF') ? '#ef4444' : '#3b82f6',
              fontSize: '11px',
              fontWeight: 'bold',
              padding: '4px 12px',
              borderRadius: '20px'
            }} 
          />
        </div>
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-2xl px-4 py-2 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {service.price}
            </div>
            {service.originalPrice && (
              <div className="text-xs text-gray-500 line-through">
                {service.originalPrice}
              </div>
            )}
          </div>
        </div>
        
        {/* Delivery Time */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white/90 text-sm">
          <Clock size={14} />
          <span>{service.delivery}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Icon & Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`
            w-12 h-12 rounded-2xl bg-gradient-to-br ${service.color}
            flex items-center justify-center text-white shadow-lg
          `}>
            <Icon size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {service.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {service.description}
            </p>
          </div>
        </div>

        {/* Features List */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {service.features.map((feature, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"
            >
              <CheckCircle2 size={12} className="text-green-500 shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center gap-4 mb-6 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Shield size={12} />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap size={12} />
            <span>Fast Delivery</span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles size={12} />
            <span>Quality Assured</span>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          type="primary"
          size="large"
          block
          className={`
            bg-gradient-to-r ${service.color} border-0
            hover:opacity-90 transition-all
            h-12 text-base font-semibold
          `}
          icon={<ArrowRight size={18} />}
        >
          Get Started
        </Button>
      </div>
      
      {/* Hover Glow Effect */}
      <div className={`
        absolute -inset-1 bg-gradient-to-r ${service.color} 
        rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 
        transition-opacity duration-500 -z-10
      `} />
    </motion.div>
  );
};

// Loading Skeleton Card
const SkeletonCard = () => (
  <div className="w-full max-w-md mx-auto rounded-3xl overflow-hidden bg-white dark:bg-gray-900 shadow-xl">
    <Skeleton.Image active className="w-full h-56" />
    <div className="p-6 space-y-4">
      <div className="flex gap-4">
        <Skeleton.Avatar active size={48} shape="square" />
        <div className="flex-1">
          <Skeleton active title={{ width: '60%' }} paragraph={false} />
          <Skeleton active paragraph={{ rows: 1, width: '80%' }} />
        </div>
      </div>
      <Skeleton.Button active block size="large" />
    </div>
  </div>
);

const Menu = () => {
  const [images, setImages] = useState(Array(8).fill(null));
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fetchImages = async () => {
      try {
        const requests = keywords.map((kw) =>
          axios.get(
            `https://api.unsplash.com/photos/random?query=${encodeURIComponent(kw)}&client_id=${UNSPLASH_KEY}`
          ).catch(() => null)
        );

        const responses = await Promise.all(requests);
        const imgList = responses.map((res) =>
          res?.data?.urls?.regular || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600"
        );

        localStorage.setItem("cachedImages", JSON.stringify(imgList));
        localStorage.setItem("lastFetchTime", Date.now().toString());
        setImages(imgList);
      } catch (error) {
        console.error("Unsplash Error:", error);
      } finally {
        setLoading(false);
      }
    };

    const lastFetch = localStorage.getItem("lastFetchTime");
    const cachedImages = localStorage.getItem("cachedImages");
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    if (lastFetch && cachedImages && Date.now() - Number(lastFetch) < sevenDays) {
      setImages(JSON.parse(cachedImages));
      setLoading(false);
    } else {
      fetchImages();
    }
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 bg-gray-50 dark:bg-[#0a0a0a] overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
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
            <span>Professional Web Services</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Websites That{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              Drive Results
            </span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose from our expertly crafted packages designed to elevate your online presence and accelerate business growth.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-8 mb-12"
        >
          {[
            { value: "500+", label: "Projects Delivered" },
            { value: "98%", label: "Client Satisfaction" },
            { value: "24/7", label: "Support Available" },
            { value: "7 Days", label: "Money Back Guarantee" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Services Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          <Swiper
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView="auto"
            initialSlide={0}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2,
              slideShadows: false,
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="w-full py-8"
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 20 },
              640: { slidesPerView: 1.5, spaceBetween: 30 },
              768: { slidesPerView: 2, spaceBetween: 40 },
              1024: { slidesPerView: 2.5, spaceBetween: 50 },
            }}
          >
            {loading ? (
              // Loading skeletons
              [...Array(3)].map((_, idx) => (
                <SwiperSlide key={idx} className="flex justify-center">
                  <SkeletonCard />
                </SwiperSlide>
              ))
            ) : (
              servicesConfig.map((service, index) => (
                <SwiperSlide key={service.id} className="flex justify-center">
                  <ServiceCard
                    service={service}
                    image={images[index]}
                    loading={false}
                    isActive={index === activeIndex}
                  />
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-16 flex flex-wrap justify-center gap-4"
        >
          {["Secure Payment", "Source Code Included", "Free Revisions", "SEO Ready"].map((badge) => (
            <Tag key={badge} className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CheckCircle2 size={14} className="inline mr-2 text-green-500" />
              {badge}
            </Tag>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Need something custom? We build tailored solutions for unique requirements.
          </p>
          <Button
            type="default"
            size="large"
            className="h-12 px-8 text-base font-medium"
            icon={<ArrowRight size={18} />}
          >
          <Link
          to="/contact" 
          >
          Request Custom Quote
          </Link>  
          </Button>
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #cbd5e1;
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #3b82f6;
          width: 24px;
          border-radius: 5px;
        }
        .swiper-button-next,
        .swiper-button-prev {
          width: 48px;
          height: 48px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          color: #3b82f6;
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 18px;
          font-weight: bold;
        }
        .dark .swiper-button-next,
        .dark .swiper-button-prev {
          background: #1f2937;
          color: #60a5fa;
        }
      `}</style>
    </section>
  );
};

export default Menu;
