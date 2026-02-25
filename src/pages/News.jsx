import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiLock, 
  FiUnlock, 
  FiAlertCircle, 
  FiExternalLink, 
  FiMaximize2, 
  FiMinimize2,
  FiShare2,
  FiBookmark,
  FiClock,
  FiTrendingUp,
  FiGlobe,
  FiVideo,
  FiImage,
  FiFileText,
  FiX,
  FiChevronRight,
  FiRefreshCw,
  FiEye,
  FiMessageSquare
} from "react-icons/fi";
import { Tooltip, Badge, Tag, Skeleton, Empty, Statistic, Divider } from "antd";
import { Helmet } from "react-helmet";
import { createPortal } from "react-dom";
import { renderMiniViewHTML } from "../utils/MiniView";
import BasedNews from "./BasedNews";

/* ======================
   SMART CONSTANTS
====================== */
const CATEGORIES = {
  business: { color: 'blue', icon: FiTrendingUp },
  technology: { color: 'purple', icon: FiVideo },
  sports: { color: 'green', icon: FiGlobe },
  entertainment: { color: 'pink', icon: FiVideo },
  health: { color: 'red', icon: FiFileText },
  science: { color: 'cyan', icon: FiGlobe },
  politics: { color: 'orange', icon: FiFileText }
};

const SENTIMENT_CONFIG = {
  positive: { color: 'green', label: 'Positive', icon: FiTrendingUp },
  negative: { color: 'red', label: 'Negative', icon: FiAlertCircle },
  neutral: { color: 'gray', label: 'Neutral', icon: FiFileText }
};

/* ======================
   SMART HOOKS
====================== */
const useCountdown = (initialSeconds = 5) => {
  const [count, setCount] = useState(initialSeconds);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (count <= 0) {
      setIsComplete(true);
      return;
    }
    const timer = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count]);

  return { count, isComplete, reset: () => { setCount(initialSeconds); setIsComplete(false); } };
};

/* ======================
   ANIMATED COMPONENTS
====================== */

const LockTransition = ({ size = "sm" }) => {
  const [locked, setLocked] = useState(false);
  const { isComplete } = useCountdown(5);

  useEffect(() => {
    if (isComplete) setLocked(true);
  }, [isComplete]);

  const sizeClasses = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";

  return (
    <AnimatePresence mode="wait">
      {!locked ? (
        <motion.div
          key="unlock"
          initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.6, rotate: 90 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative"
        >
          <FiUnlock className={`${sizeClasses} text-emerald-500`} />
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"
          >
            <motion.span
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 bg-emerald-500 rounded-full"
            />
          </motion.span>
        </motion.div>
      ) : (
        <motion.div
          key="lock"
          initial={{ opacity: 0, scale: 0.6, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <FiLock className={`${sizeClasses} text-slate-400`} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SmartSkeleton = ({ type = "card" }) => {
  if (type === "hero") {
    return (
      <div className="rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 animate-pulse">
        <div className="h-64 bg-slate-200 dark:bg-slate-700" />
        <div className="p-6 space-y-4">
          <div className="h-4 w-24 bg-slate-300 dark:bg-slate-600 rounded" />
          <div className="h-8 w-3/4 bg-slate-300 dark:bg-slate-600 rounded" />
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 p-4 space-y-3 shadow-sm">
      <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
      <div className="flex gap-2">
        <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
        <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
      </div>
      <div className="h-5 w-full bg-slate-300 dark:bg-slate-600 rounded" />
      <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
    </div>
  );
};

/* ======================
   CONTENT RENDERERS
====================== */

const SmartVideoPlayer = ({ video, title, className = "" }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!video) return null;

  return (
    <div className={`relative group ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FiRefreshCw className="w-8 h-8 text-white/50" />
          </motion.div>
        </div>
      )}
      
      {video.type === "mp4" ? (
        <video
          src={video.embed}
          controls
          className="w-full h-full object-cover"
          onLoadedData={() => setIsLoading(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      ) : (
        <iframe
          src={video.embed}
          className="w-full h-full"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          title={title}
          onLoad={() => setIsLoading(false)}
        />
      )}
      
      {!isPlaying && video.type !== "mp4" && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </div>
  );
};

const SmartImage = ({ src, alt, onZoom, priority = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <FiImage className="w-12 h-12 text-slate-300 dark:text-slate-600" />
      </div>
    );
  }

  return (
    <motion.div
      className="relative w-full h-full overflow-hidden cursor-zoom-in group"
      onClick={() => onZoom?.({ src, alt })}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className={`w-full h-full object-cover transition-all duration-500 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        } group-hover:brightness-110`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <FiMaximize2 className="w-8 h-8 text-white drop-shadow-lg" />
      </div>
    </motion.div>
  );
};

const renderValue = (value, type = "text") => {
  if (!value || value === "—") return <span className="text-slate-400 italic">Not available</span>;

  if (typeof value === "string" && value.includes("ONLY AVAILABLE")) {
    return (
      <Tooltip title="Premium feature - Subscribe to unlock">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-medium cursor-help">
          <LockTransition />
          <span>Premium Content</span>
        </span>
      </Tooltip>
    );
  }

  if (type === "sentiment") {
    const config = SENTIMENT_CONFIG[value?.toLowerCase()] || SENTIMENT_CONFIG.neutral;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-${config.color}-100 text-${config.color}-700 dark:bg-${config.color}-900/30 dark:text-${config.color}-300`}>
        <config.icon size={12} />
        {config.label}
      </span>
    );
  }

  return value;
};

/* ======================
   ARTICLE CARD
====================== */

const ArticleCard = ({ article, index, onZoom, onRead, featured = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const category = article.category?.[0]?.toLowerCase();
  const categoryConfig = CATEGORIES[category] || { color: 'slate', icon: FiFileText };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-2xl bg-white dark:bg-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 dark:border-slate-700 ${
        featured ? 'sm:col-span-2 lg:col-span-3' : ''
      }`}
    >
      {/* Media Section */}
      <div className={`relative overflow-hidden ${featured ? 'h-80' : 'h-48'}`}>
        {article.video ? (
          <SmartVideoPlayer 
            video={article.video} 
            title={article.title}
            className="w-full h-full"
          />
        ) : article.image_url ? (
          <SmartImage 
            src={article.image_url} 
            alt={article.title}
            onZoom={onZoom}
            priority={featured}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
            <FiFileText className="w-16 h-16 text-slate-300 dark:text-slate-600" />
          </div>
        )}

        {/* Overlays */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Tag className={`bg-${categoryConfig.color}-500/90 text-white border-0 backdrop-blur-sm`}>
            <categoryConfig.icon size={12} className="inline mr-1" />
            {article.category?.[0] || 'News'}
          </Tag>
          {article.video && (
            <Tag className="bg-red-500/90 text-white border-0 backdrop-blur-sm">
              <FiVideo size={12} className="inline mr-1" />
              Video
            </Tag>
          )}
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-3 right-3 flex gap-2"
            >
              <Tooltip title="Quick view">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); onRead(article); }}
                  className="p-2 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg text-slate-700 dark:text-slate-200"
                >
                  <FiEye size={16} />
                </motion.button>
              </Tooltip>
              <Tooltip title={isBookmarked ? "Remove bookmark" : "Bookmark"}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); setIsBookmarked(!isBookmarked); }}
                  className={`p-2 rounded-full backdrop-blur-sm shadow-lg ${
                    isBookmarked ? 'bg-amber-500 text-white' : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <FiBookmark size={16} />
                </motion.button>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reading time estimate */}
        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs">
          {Math.ceil((article.content?.length || 0) / 1000)} min read
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-3">
        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          {article.source_icon && (
            <Tooltip title={article.source_name}>
              <img src={article.source_icon} alt="" className="w-5 h-5 rounded-full" />
            </Tooltip>
          )}
          <span className="font-medium">{article.source_name}</span>
          <span>•</span>
          <FiClock size={12} />
          <span>{formatDate(article.pubDate)}</span>
        </div>

        {/* Title */}
        <h3 className={`font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
          featured ? 'text-2xl' : 'text-lg line-clamp-2'
        }`}>
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
          {renderValue(article.description)}
        </p>

        {/* AI Summary (if available) */}
        {article.ai_summary && !article.ai_summary.includes("ONLY AVAILABLE") && (
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-1">
              <FiMessageSquare size={12} className="text-blue-500" />
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">AI Summary</span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-300 line-clamp-2">
              {article.ai_summary}
            </p>
          </div>
        )}

        {/* Footer Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            {renderValue(article.sentiment, "sentiment")}
            {article.country?.[0] && (
              <Tooltip title="Country">
                <span className="text-xs text-slate-500">{(article.country[0])}</span>
              </Tooltip>
            )}
          </div>
          
          <motion.a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            whileHover={{ x: 3 }}
          >
            Read
            <FiChevronRight size={16} />
          </motion.a>
        </div>

        {/* Keywords */}
        {article.keywords && article.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {article.keywords.slice(0, 4).map(kw => (
              <span key={kw} className="px-2 py-0.5 text-[10px] rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                #{kw}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
};

/* ======================
   HERO SECTION
====================== */

const HeroSection = ({ article, onZoom, onRead }) => {
  if (!article) return null;

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative mb-12 rounded-3xl overflow-hidden bg-slate-900 shadow-2xl"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {article.image_url ? (
          <img 
            src={article.image_url} 
            alt="" 
            className="w-full h-full object-cover opacity-40"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 min-h-[500px] flex flex-col justify-end">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold uppercase tracking-wider">
              Breaking
            </span>
            <span className="text-slate-300 text-sm">
              {new Date(article.pubDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight max-w-4xl">
            {article.title}
          </h1>

          <p className="text-lg text-slate-300 mb-6 max-w-2xl line-clamp-3">
            {article.description}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onRead(article)}
              className="px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <FiEye size={18} />
              Read Full Story
            </motion.button>
            
            <motion.a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold flex items-center gap-2 border border-white/20 hover:bg-white/20"
            >
              <FiExternalLink size={18} />
              Visit Source
            </motion.a>
          </div>
        </motion.div>

        {/* Source Info */}
        <div className="absolute top-6 right-6 flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
          {article.source_icon && (
            <img src={article.source_icon} alt="" className="w-6 h-6 rounded-full" />
          )}
          <span className="text-white font-medium">{article.source_name}</span>
        </div>
      </div>
    </motion.section>
  );
};

/* ======================
   POPUP NOTIFICATION
====================== */

const NewsPopup = ({ article, onClose, onOpen, onRead }) => {
  if (!article) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 100, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-[9999] w-full max-w-sm"
      >
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="relative h-32">
            {article.image_url ? (
              <img src={article.image_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
            )}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
            >
              <FiX size={16} />
            </button>
            <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-bold">
              LIVE
            </div>
          </div>
          
          <div className="p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Just In</p>
            <h4 className="font-semibold text-slate-900 dark:text-white line-clamp-2 mb-3">
              {article.title}
            </h4>
            
            <div className="flex gap-2">
              <button
                onClick={onOpen}
                className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
              >
                Read Now
              </button>
              <button
                onClick={() => { onRead(article); onClose(); }}
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 transition"
              >
                <FiEye size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

/* ======================
   IMAGE ZOOM MODAL
====================== */

const ImageZoomModal = ({ image, onClose }) => {
  if (!image) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative max-w-5xl max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
          />
          <div className="absolute -bottom-12 left-0 right-0 text-center">
            <p className="text-white/80 text-sm">{image.alt}</p>
          </div>
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <FiX size={24} />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

/* ======================
   MAIN COMPONENT
====================== */

const NewsComponent = () => {
  const [data, setData] = useState(null);
  const [latest, setLatest] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const navigate = useNavigate();

  /* ======================
     DATA FETCHING
  ====================== */
  const processArticles = (articles) => {
    return articles.map(article => ({
      ...article,
      video: extractVideo(article)
    })).sort((a, b) => {
      // Prioritize videos, then by date
      if (b.video && !a.video) return 1;
      if (a.video && !b.video) return -1;
      return new Date(b.pubDate) - new Date(a.pubDate);
    });
  };

  const fetchNews = async (cancelToken = null) => {
    try {
      setLoading(true);
      setError(null);

      const url = "https://newsdata.io/api/1/latest" +
        "?apikey=pub_ac9c8f45cea54c21bf1b8d9bb1ecca16" +
        "&language=en" +
        "&removeduplicate=1";

      const res = await axios.get(url, { cancelToken: cancelToken || undefined });
      const processed = processArticles(res.data.results || []);
      
      setData({ results: processed });
      setLatest(processed[0] || null);
      setShowPopup(Boolean(processed.length));
      
      toast.success(`Loaded ${processed.length} stories`, { duration: 2000 });
    } catch (err) {
      if (!axios.isCancel(err)) {
        setError(err.message || "Failed to fetch news");
        toast.error(err.message || "Failed to fetch news");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    fetchNews(source.token);
    return () => source.cancel("Component unmounted");
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNews();
    setRefreshing(false);
  };

  /* ======================
     HANDLERS
  ====================== */
  const openExternalReader = useCallback((article) => {
    const reader = window.open("", "_blank", "width=420,height=640,noopener,noreferrer");
    if (!reader) {
      toast.error("Popup blocked. Please allow popups for this site.");
      return;
    }
    reader.document.open();
    reader.document.write(renderMiniViewHTML(article));
    reader.document.close();
  }, []);

  /* ======================
     RENDER STATES
  ====================== */
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 pt-24 space-y-8">
        <SmartSkeleton type="hero" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <SmartSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <FiAlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Unable to Load News
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold flex items-center gap-2 mx-auto hover:bg-blue-700 disabled:opacity-50"
          >
            {refreshing ? <FiRefreshCw className="animate-spin" /> : <FiRefreshCw />}
            {refreshing ? "Retrying..." : "Try Again"}
          </button>
        </motion.div>
      </div>
    );
  }

  /* ======================
     MAIN RENDER
  ====================== */
  return (
    <section className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Helmet>
        <title>{latest ? `${latest.title} | SwiftMeta News` : "News | SwiftMeta"}</title>
        <meta name="description" content={latest?.description?.slice(0, 160) || "Latest breaking news"} />
      </Helmet>

      {/* Popup */}
      {showPopup && latest && (
        <NewsPopup
          article={latest}
          onClose={() => setShowPopup(false)}
          onOpen={() => navigate("/news")}
          onRead={openExternalReader}
        />
      )}

      {/* Zoom Modal */}
      {zoomImage && (
        <ImageZoomModal image={zoomImage} onClose={() => setZoomImage(null)} />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold text-slate-900 dark:text-white mb-2"
            >
              Today's News
            </motion.h1>
            <p className="text-slate-500 dark:text-slate-400">
              Curated from trusted sources worldwide • {data?.results?.length || 0} stories
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
            >
              {viewMode === 'grid' ? <FiFileText /> : <FiGlobe />}
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {refreshing ? <FiRefreshCw className="animate-spin" /> : <FiRefreshCw />}
              Refresh
            </button>
          </div>
        </header>

        {/* Hero */}
        {latest && (
          <HeroSection 
            article={latest} 
            onZoom={setZoomImage}
            onRead={openExternalReader}
          />
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm font-medium text-slate-500">Filter by:</span>
          {Object.entries(CATEGORIES).slice(0, 5).map(([key, config]) => (
            <button
              key={key}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-${config.color}-100 hover:text-${config.color}-700`}
            >
              <config.icon size={12} className="inline mr-1" />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'sm:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {data?.results?.slice(1).map((article, index) => (
            <ArticleCard
              key={article.link || index}
              article={article}
              index={index}
              onZoom={setZoomImage}
              onRead={openExternalReader}
              featured={viewMode === 'list'}
            />
          ))}
        </div>

        {/* Empty State */}
        {!data?.results?.length && (
          <Empty 
            description="No news articles found" 
            className="py-20"
          />
        )}
      </div>

      <BasedNews />
    </section>
  );
};

/* ======================
   UTILS
====================== */
const VIDEO_REGEX = /(https?:\/\/(?:www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|vimeo\.com\/|twitter\.com\/.*\/status\/|x\.com\/.*\/status\/)[^\s]+)/i;

const extractVideo = (article) => {
  const sources = [article.video_url, article.content, article.description, article.link].filter(Boolean);
  for (const source of sources) {
    const match = source.match(VIDEO_REGEX);
    if (match) return normalizeVideoUrl(match[1]);
  }
  return null;
};

const normalizeVideoUrl = (url) => {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const id = url.split("v=")[1]?.split("&")[0] || url.split("youtu.be/")[1];
    return { type: "youtube", embed: `https://www.youtube.com/embed/${id}` };
  }
  if (url.includes("vimeo.com")) {
    return { type: "vimeo", embed: `https://player.vimeo.com/video/${url.split("/").pop()}` };
  }
  if (url.includes("twitter.com") || url.includes("x.com")) {
    return { type: "twitter", embed: url };
  }
  if (url.endsWith(".mp4")) {
    return { type: "mp4", embed: url };
  }
  return null;
};

export default NewsComponent;
