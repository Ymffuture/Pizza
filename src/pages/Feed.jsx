import React, { useEffect, useState, useMemo, useCallback } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Clock,
  Eye,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { Avatar, Badge, Tooltip, Dropdown, Empty, Skeleton } from "antd";
import { formatDistanceToNow } from "date-fns";
import { api } from "../api";
import toast from "react-hot-toast";
import likeSound from "../assets/noty.mp3";

const likeAudio = new Audio(likeSound);

// Enhanced Post Card Component
const EnhancedPostCard = ({ post, onLike, isLiked, likesCount, onCommentClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  
  const isLongContent = post.body?.length > 150;
  const displayContent = showFullContent ? post.body : post.body?.slice(0, 150);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white dark:bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800"
    >
      {/* Header with Author Info */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Tooltip title={post.author?.name || "Anonymous"}>
            <div className="relative">
              <Avatar
                size={48}
                src={post.author?.avatar || "https://swiftmeta.vercel.app/pp.jpeg"}
                className="border-2 border-white dark:border-gray-700 shadow-md cursor-pointer hover:scale-105 transition-transform"
              />
              {post.author?.verified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                  <Sparkles size={12} className="text-white" />
                </div>
              )}
            </div>
          </Tooltip>
          
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm md:text-base hover:text-blue-500 cursor-pointer transition-colors">
              {post.author?.name || "Anonymous"}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Clock size={12} />
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
              <span>·</span>
              <Eye size={12} />
              <span>{post.views || 0} views</span>
            </div>
          </div>
        </div>

        <Dropdown
          menu={{
            items: [
              { key: 'save', icon: <Bookmark size={16} />, label: 'Save post' },
              { key: 'share', icon: <Share2 size={16} />, label: 'Share' },
              { key: 'report', icon: <MoreHorizontal size={16} />, label: 'Report' },
            ]
          }}
          placement="bottomRight"
        >
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <MoreHorizontal size={20} className="text-gray-500" />
          </button>
        </Dropdown>
      </div>

      {/* Post Image */}
      {post.images?.[0] && (
        <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton.Image active className="w-full h-full" />
            </div>
          )}
          <img
            src={post.images[0]}
            alt={post.title}
            className={`w-full h-full object-cover transition-transform duration-700 hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Image overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
          
          {/* Multiple images indicator */}
          {post.images.length > 1 && (
            <Badge 
              count={`+${post.images.length - 1}`} 
              className="absolute top-4 right-4"
              style={{ backgroundColor: '#6366f1' }}
            />
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-blue-500 cursor-pointer transition-colors">
          {post.title}
        </h2>
        
        <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
          {displayContent}
          {isLongContent && !showFullContent && (
            <button 
              onClick={() => setShowFullContent(true)}
              className="text-blue-500 hover:underline ml-1 font-medium"
            >
              ...read more
            </button>
          )}
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-6">
            {/* Like Button */}
            <Tooltip title={isLiked ? "Unlike" : "Like"}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onLike}
                className={`flex items-center gap-2 group ${isLiked ? 'text-pink-500' : 'text-gray-500 dark:text-gray-400 hover:text-pink-500'}`}
              >
                <div className={`p-2 rounded-full transition-all ${isLiked ? 'bg-pink-50 dark:bg-pink-900/20' : 'group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20'}`}>
                  <Heart 
                    size={22} 
                    className={`transition-all ${isLiked ? 'fill-current scale-110' : 'group-hover:scale-110'}`} 
                  />
                </div>
                <span className="font-semibold text-sm">{likesCount || 0}</span>
              </motion.button>
            </Tooltip>

            {/* Comment Button */}
            <Tooltip title="Comments">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onCommentClick}
                className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 group"
              >
                <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-all">
                  <MessageCircle size={22} className="group-hover:scale-110 transition-transform" />
                </div>
                <span className="font-semibold text-sm">{post.comments?.length || 0}</span>
              </motion.button>
            </Tooltip>

            {/* Share Button */}
            <Tooltip title="Share">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-green-500 group"
              >
                <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-all">
                  <Share2 size={22} className="group-hover:scale-110 transition-transform" />
                </div>
              </motion.button>
            </Tooltip>
          </div>

          {/* Trending Badge */}
          {(post.likes?.length > 10 || post.views > 100) && (
            <Tooltip title="Trending post">
              <div className="flex items-center gap-1 text-amber-500">
                <TrendingUp size={16} />
                <span className="text-xs font-bold">Hot</span>
              </div>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 hover:opacity-20 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
};

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());

  // Load posts
  useEffect(() => {
    let mounted = true;

    const loadPosts = async () => {
      try {
        const res = await api.get("/posts");
        if (mounted) {
          setPosts(res.data || []);
          // Check which posts user has liked
          const liked = new Set(res.data.filter(p => p.isLiked).map(p => p._id));
          setLikedPosts(liked);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load posts");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadPosts();
    return () => (mounted = false);
  }, []);

  // Handle like with optimistic update
  const handleLikePost = useCallback(async (postId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast((t) => (
        <div className="flex flex-col gap-3 p-2">
          <span className="font-medium">Sign in to like posts</span>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              window.location.href = "/login";
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
          >
            Login Now
          </button>
        </div>
      ), { duration: 5000 });
      return;
    }

    // Optimistic update
    const isCurrentlyLiked = likedPosts.has(postId);
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (isCurrentlyLiked) next.delete(postId);
      else next.add(postId);
      return next;
    });

    setPosts(prev => prev.map(p => {
      if (p._id === postId) {
        const currentLikes = p.likes?.length || 0;
        return {
          ...p,
          likes: isCurrentlyLiked 
            ? Array(Math.max(0, currentLikes - 1)).fill(1)
            : Array(currentLikes + 1).fill(1)
        };
      }
      return p;
    }));

    // Play sound
    if (!isCurrentlyLiked) {
      likeAudio.currentTime = 0;
      likeAudio.play().catch(() => {});
    }

    try {
      const res = await api.post(`/posts/${postId}/toggle-like`);
      toast.success(res.data.liked ? "❤️ Liked!" : "💔 Unliked");
    } catch {
      // Revert on error
      setLikedPosts(prev => {
        const next = new Set(prev);
        if (isCurrentlyLiked) next.add(postId);
        else next.delete(postId);
        return next;
      });
      toast.error("Failed to update like");
    }
  }, [likedPosts]);

  // Update comments count
  const updatePostComments = useCallback((postId, newComments) => {
    setPosts(prev => prev.map(p => 
      p._id === postId ? { ...p, comments: newComments } : p
    ));
  }, []);

  // Slider settings optimized for display
  const sliderSettings = useMemo(() => ({
    dots: true,
    infinite: posts.length > 1,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '60px',
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: '20px',
          arrows: false,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerPadding: '40px',
        }
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          centerPadding: '60px',
        }
      }
    ],
    customPaging: (i) => (
      <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 transition-colors mt-4" />
    ),
    appendDots: dots => (
      <div className="flex justify-center gap-2 mt-4">
        {dots}
      </div>
    )
  }), [posts.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-pulse" size={24} />
          </div>
          <span className="text-gray-500 dark:text-gray-400 font-medium">Loading amazing content...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
            <TrendingUp size={16} />
            <span>Community Feed</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Amazing</span> Stories
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Explore the latest posts from our creative community
          </p>
        </motion.div>

        {/* Posts Slider */}
        {posts.length > 0 ? (
          <div className="relative">
            <Slider {...sliderSettings}>
              {posts.map((post) => (
                <div key={post._id} className="px-3 py-4 outline-none">
                  <EnhancedPostCard
                    post={post}
                    isLiked={likedPosts.has(post._id)}
                    likesCount={post.likes?.length || 0}
                    onLike={() => handleLikePost(post._id)}
                    onCommentClick={() => {
                      // Scroll to comments or open modal
                      document.getElementById(`comments-${post._id}`)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  />
                </div>
              ))}
            </Slider>
          </div>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-gray-500 dark:text-gray-400">
                No posts yet. Be the first to share!
              </span>
            }
            className="py-20"
          />
        )}

        {/* Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {posts.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {posts.reduce((acc, p) => acc + (p.likes?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Likes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {posts.reduce((acc, p) => acc + (p.comments?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Comments</div>
          </div>
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .slick-prev, .slick-next {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          z-index: 10;
          transition: all 0.3s ease;
        }
        .slick-prev:hover, .slick-next:hover {
          background: #3b82f6;
          color: white;
          transform: scale(1.1);
        }
        .slick-prev:before, .slick-next:before {
          font-size: 20px;
          color: inherit;
        }
        .slick-prev {
          left: -24px;
        }
        .slick-next {
          right: -24px;
        }
        .dark .slick-prev, .dark .slick-next {
          background: #1f2937;
          color: white;
        }
        .slick-dots li button:before {
          display: none;
        }
        .slick-center .feed-card {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
